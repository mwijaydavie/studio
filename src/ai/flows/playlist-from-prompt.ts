'use server';
/**
 * @fileOverview A Genkit flow for generating a music playlist from a natural language prompt.
 * Includes error handling for API rate limits.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PlaylistFromPromptInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A natural language description of the desired mood, activity, or theme for a playlist.'
    ),
});
export type PlaylistFromPromptInput = z.infer<typeof PlaylistFromPromptInputSchema>;

const PlaylistFromPromptOutputSchema = z.object({
  playlistName: z.string().describe('A suitable name for the generated playlist.'),
  songs: z.array(
    z.object({
      title: z.string().describe('The title of the song.'),
      artist: z.string().describe('The artist of the song.'),
      genre: z.string().describe('The genre of the song.'),
    })
  ),
});
export type PlaylistFromPromptOutput = z.infer<typeof PlaylistFromPromptOutputSchema>;

export async function playlistFromPrompt(
  input: PlaylistFromPromptInput
): Promise<PlaylistFromPromptOutput> {
  return playlistFromPromptFlow(input);
}

const generatePlaylistPrompt = ai.definePrompt({
  name: 'generatePlaylistPrompt',
  input: {schema: PlaylistFromPromptInputSchema},
  output: {schema: PlaylistFromPromptOutputSchema},
  prompt: `You are an AI music curator. Generate a playlist of at least 5 songs based on: {{{prompt}}}`,
});

const playlistFromPromptFlow = ai.defineFlow(
  {
    name: 'playlistFromPromptFlow',
    inputSchema: PlaylistFromPromptInputSchema,
    outputSchema: PlaylistFromPromptOutputSchema,
  },
  async input => {
    try {
      const {output} = await generatePlaylistPrompt(input);
      if (!output) throw new Error('No output from prompt');
      return output;
    } catch (error: any) {
      console.error("AI Playlist Error:", error.message);
      // Fallback: Return empty list to trigger Discovery Node UI
      return {
        playlistName: "Aura Backup Session",
        songs: []
      };
    }
  }
);
