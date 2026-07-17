
'use server';
/**
 * @fileOverview AuraTune Neural Voice Synthesis Flow.
 * Converts text to expressive speech using Gemini 2.5 TTS models.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

const GenerateSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  voiceName: z.enum(['Algenib', 'Achernar', 'Kore', 'Zephyr', 'Puck', 'Charon', 'Fenrir']).default('Puck'),
  temperature: z.number().optional().default(1.0),
  stylePrompt: z.string().optional().describe('Optional style instructions for the voice.'),
});

export async function generateSpeech(input: z.infer<typeof GenerateSpeechInputSchema>) {
  return generateSpeechFlow(input);
}

const generateSpeechFlow = ai.defineFlow(
  {
    name: 'generateSpeechFlow',
    inputSchema: GenerateSpeechInputSchema,
    outputSchema: z.object({
      media: z.string().describe('Data URI of the generated WAV audio.'),
    }),
  },
  async (input) => {
    const prompt = input.stylePrompt ? `${input.stylePrompt} ${input.text}` : input.text;

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: input.voiceName },
          },
        },
      },
      prompt,
    });

    if (!media) throw new Error('AuraCore: Audio synthesis failed to return media');

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      media: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
