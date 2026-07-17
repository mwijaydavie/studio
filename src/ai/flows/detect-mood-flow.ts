'use server';
/**
 * @fileOverview A Genkit flow for detecting mood from a facial expression image.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DetectMoodInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectMoodInput = z.infer<typeof DetectMoodInputSchema>;

const DetectMoodOutputSchema = z.object({
  emoji: z.string().describe('A single emoji representing the detected mood.'),
  moodName: z.string().describe('A brief name for the detected mood.'),
  confidence: z.number().describe('Confidence score of the detection.'),
});
export type DetectMoodOutput = z.infer<typeof DetectMoodOutputSchema>;

export async function detectMood(input: DetectMoodInput): Promise<DetectMoodOutput> {
  return detectMoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectMoodPrompt',
  input: { schema: DetectMoodInputSchema },
  output: { schema: DetectMoodOutputSchema },
  prompt: `You are a neural psychologist for the AuraTune Pro Workstation.
  
Analyze the facial expression in this image and return a single emoji that best represents the mood. 

Photo: {{media url=photoDataUri}}`,
});

const detectMoodFlow = ai.defineFlow(
  {
    name: 'detectMoodFlow',
    inputSchema: DetectMoodInputSchema,
    outputSchema: DetectMoodOutputSchema,
  },
  async input => {
    try {
      const { output } = await prompt(input);
      if (!output) throw new Error('Neural analysis failed');
      return output;
    } catch (error: any) {
      console.error("Mood detection error:", error.message);
      return {
        emoji: "😐",
        moodName: "Neutral",
        confidence: 0
      };
    }
  }
);
