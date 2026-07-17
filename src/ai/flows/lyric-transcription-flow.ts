
'use server';
/**
 * @fileOverview A lyric transcription and translation AI flow.
 * Features advanced simulation fallbacks for offline testing.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeLyricsInputSchema = z.object({
  audioTitle: z.string().describe('The title of the song.'),
  artistName: z.string().describe('The name of the artist.'),
  targetLanguage: z.string().default('English').describe('Target language for translation.'),
  audioDataUri: z.string().optional().describe('Optional audio data URI for actual listening analysis.'),
});
export type TranscribeLyricsInput = z.infer<typeof TranscribeLyricsInputSchema>;

const TranscribeLyricsOutputSchema = z.object({
  lyrics: z.array(z.object({
    time: z.number().describe('Timestamp in seconds.'),
    text: z.string().describe('Lyric line text.'),
    translation: z.string().optional().describe('Translated lyric line.'),
  })),
  detectedLanguage: z.string().describe('The detected language of the lyrics.'),
  summary: z.string().describe('A brief AI summary of the song meaning.'),
});
export type TranscribeLyricsOutput = z.infer<typeof TranscribeLyricsOutputSchema>;

export async function transcribeLyrics(input: TranscribeLyricsInput): Promise<TranscribeLyricsOutput> {
  return transcribeLyricsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transcribeLyricsPrompt',
  input: {schema: TranscribeLyricsInputSchema},
  output: {schema: TranscribeLyricsOutputSchema},
  prompt: `You are an expert AI music linguist for AuraTune.
  
  Process the following track information:
  Title: {{{audioTitle}}}
  Artist: {{{artistName}}}
  Target Translation: {{{targetLanguage}}}
  {{#if audioDataUri}}Audio File: {{media url=audioDataUri}}{{/if}}

  Your task:
  1. Provide a realistic set of timestamped lyrics. If audio data is provided, listen and transcribe exactly. If not, simulate based on the title/artist.
  2. Translate each line into the target language.
  3. Detect the primary language of the original track.
  4. Write a professional 2026-vibe workstation summary of the track's meaning.`,
});

const transcribeLyricsFlow = ai.defineFlow(
  {
    name: 'transcribeLyricsFlow',
    inputSchema: TranscribeLyricsInputSchema,
    outputSchema: TranscribeLyricsOutputSchema,
  },
  async input => {
    try {
      // Check for valid environment but proceed to catch if fail
      const {output} = await prompt(input);
      if (!output) throw new Error('AI Engine calibration failure');
      return output;
    } catch (error: any) {
      console.warn("AuraCore: Lyrics API offline. Initializing local simulation for:", input.audioTitle);
      
      // Professional Local Simulation Fallback
      // This ensures the feature "works" visually for the prototype without an API key
      const simSummary = `[SIMULATED NODE]: "${input.audioTitle}" is an acoustic pattern that explores themes of frequency modulation and neural resonance. AuraCore suggests deep focus during this session.`;
      
      return {
        lyrics: [
          { time: 0, text: `[Opening neural sequence: ${input.audioTitle}]`, translation: `[Kufungua mfuatano wa neva: ${input.audioTitle}]` },
          { time: 5, text: `Resonance detected from artist: ${input.artistName}`, translation: `Mwangwi umegunduliwa kutoka kwa msanii: ${input.artistName}` },
          { time: 10, text: "Synthesizing vocal patterns in real-time...", translation: "Kuunda mifumo ya sauti kwa wakati halisi..." },
          { time: 15, text: "Spectral harmony established in the local node.", translation: "Uwiano wa spectral umeanzishwa katika nodi ya mahali." },
          { time: 20, text: "AuraCore is monitoring acoustic fidelity.", translation: "AuraCore inafuatilia uaminifu wa akustisk." },
          { time: 25, text: "Frequency shift complete. Continuing session.", translation: "Mabadiliko ya mzunguko yamekamilika. Kuendeleza kikao." }
        ],
        detectedLanguage: "Neural (Simulated)",
        summary: simSummary
      };
    }
  }
);
