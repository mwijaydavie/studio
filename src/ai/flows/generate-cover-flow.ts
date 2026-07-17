
'use server';
/**
 * @fileOverview AuraTune AI Cover Synthesis Flow.
 * Generates unique album artwork based on track metadata using Imagen 4.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCoverInputSchema = z.object({
  title: z.string().describe('The title of the song.'),
  artist: z.string().describe('The name of the artist.'),
  genre: z.string().describe('The genre of the song.'),
});
export type GenerateCoverInput = z.infer<typeof GenerateCoverInputSchema>;

const GenerateCoverOutputSchema = z.object({
  imageUrl: z.string().describe('Data URI of the generated image.'),
});
export type GenerateCoverOutput = z.infer<typeof GenerateCoverOutputSchema>;

export async function generateTrackCover(input: GenerateCoverInput): Promise<GenerateCoverOutput> {
  return generateCoverFlow(input);
}

const generateCoverFlow = ai.defineFlow(
  {
    name: 'generateCoverFlow',
    inputSchema: GenerateCoverInputSchema,
    outputSchema: GenerateCoverOutputSchema,
  },
  async input => {
    try {
      const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `Professional high-fidelity album cover art for a track titled "${input.title}" by artist "${input.artist}". Genre: ${input.genre}. Aesthetic: 2026 futuristic workstation, cinematic lighting, deep shadows, neon accents, abstract geometric patterns, 4k resolution, artistic depth. No text.`,
      });

      if (!media || !media.url) {
        throw new Error('AuraCore: Image synthesis failed to return media');
      }

      return {
        imageUrl: media.url,
      };
    } catch (error: any) {
      console.error("Image Synthesis Error:", error.message);
      // Absolute fallback to a high-quality picsum seed if generation fails
      return {
        imageUrl: `https://picsum.photos/seed/${input.title.length + input.artist.length}/600/600`
      };
    }
  }
);
