
'use server';
/**
 * @fileOverview This file implements a Genkit flow for providing personalized music recommendations.
 * Includes fallback logic for quota exhaustion (429 errors) and multi-provider support.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PersonalizedContentFeedInputSchema = z.object({
  listeningHistory: z
    .array(z.string())
    .describe('A list of tracks or artists the user has recently listened to.'),
  preferences: z
    .string()
    .describe('User-defined preferences for music genres or moods.'),
});
export type PersonalizedContentFeedInput = z.infer<
  typeof PersonalizedContentFeedInputSchema
>;

const PersonalizedContentFeedOutputSchema = z.object({
  recommendations: z
    .array(
      z.object({
        name: z.string().describe('The name of the recommended song.'),
        artist: z.string().describe('The artist of the recommended song.'),
        genre: z.string().describe('The genre of the recommended song.'),
        reason: z
          .string()
          .describe('A brief explanation for why this song was recommended.'),
      })
    )
    .describe('A list of personalized music recommendations.'),
});
export type PersonalizedContentFeedOutput = z.infer<
  typeof PersonalizedContentFeedOutputSchema
>;

export async function personalizedContentFeed(
  input: PersonalizedContentFeedInput
): Promise<PersonalizedContentFeedOutput> {
  return personalizedContentFeedFlow(input);
}

const personalizedContentFeedPrompt = ai.definePrompt({
  name: 'personalizedContentFeedPrompt',
  input: { schema: PersonalizedContentFeedInputSchema },
  output: { schema: PersonalizedContentFeedOutputSchema },
  prompt: `You are an expert music recommender for AuraTune workstation.
  
  Based on the following information, suggest 5 songs that the user would enjoy. 

  User Listening History:
  {{#each listeningHistory}}- {{this}}
  {{/each}}

  User Preferences: {{{preferences}}}`,
});

const personalizedContentFeedFlow = ai.defineFlow(
  {
    name: 'personalizedContentFeedFlow',
    inputSchema: PersonalizedContentFeedInputSchema,
    outputSchema: PersonalizedContentFeedOutputSchema,
  },
  async (input) => {
    try {
      // Primary Neural Node: Gemini 2.5 Flash
      const { output } = await personalizedContentFeedPrompt(input);
      return output!;
    } catch (error: any) {
      console.error("AI Feed Error (Gemini Throttled):", error.message);
      
      try {
        // Resilience Node: OpenRouter
        const arceeModel = ai.model('openrouter/arcee-ai/trinity-large-preview');
        const { output } = await personalizedContentFeedPrompt(input, { model: arceeModel });
        return output!;
      } catch (fallbackError: any) {
        // Absolute Fallback: Empty recommendations to trigger Discovery UI instead of non-working patterns
        return {
          recommendations: []
        };
      }
    }
  }
);
