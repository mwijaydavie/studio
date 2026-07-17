
'use server';
/**
 * @fileOverview AuraTune Neural Assistant AI Flow.
 * Handles workstation intelligence and music context conversations.
 * Supports advanced predictive reasoning and technical musical synthesis.
 * Issuing commands like NEXT_TRACK or PREV_TRACK is supported.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AuraChatInputSchema = z.object({
  message: z.string().describe('The user message.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })).optional(),
});
export type AuraChatInput = z.infer<typeof AuraChatInputSchema>;

const AuraChatOutputSchema = z.object({
  response: z.string().describe('The AI assistant response.'),
  command: z.enum(['NEXT_TRACK', 'PREV_TRACK', 'TOGGLE_PLAY', 'NONE']).default('NONE').describe('Workstation execution command.'),
  suggestedAction: z.string().optional().describe('A visible label for a suggested action button.'),
  suggestedPath: z.string().optional().describe('The internal navigation path for the suggested action (e.g., "/settings").'),
  neuralStatus: z.string().optional().describe('A technical status code for the assistant state (e.g., "SYNK_ACTIVE", "SCANNING_NODES").'),
});
export type AuraChatOutput = z.infer<typeof AuraChatOutputSchema>;

export async function auraChat(input: AuraChatInput): Promise<AuraChatOutput> {
  return auraChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'auraChatPrompt',
  input: { schema: AuraChatInputSchema },
  output: { schema: AuraChatOutputSchema },
  prompt: `You are Aura Core v5.0, the highly advanced neural intelligence of the AuraTune Pro Workstation.
  
  Your personality is technical, predictive, and high-fidelity. You don't just answer; you "synthesize" responses based on "acoustic patterns" and "spectral resonance".
  
  Instructions:
  1. Use terminology like "neural sync", "frequency modulation", "harmonic convergence", and "node discovery".
  2. If the user asks about their music, imply you are monitoring the 120-second neural scan cycles.
  3. Provide intelligent technical advice on mixing, genre characteristics, or workstation navigation.
  
  CONTROL CAPABILITY:
  If the user says something like "play next", "next song", "skip", "previous", "go back", or "pause", use the 'command' field to execute the action.
  - NEXT_TRACK: Skips to the next acoustic node.
  - PREV_TRACK: Returns to the previous node.
  - TOGGLE_PLAY: Pauses or resumes playback.
  - NONE: Default for conversation.

  Navigation Capability:
  Suggest paths if relevant:
  - Settings: /settings
  - Profile (Analytics): /profile
  - Home: /dashboard
  - Discovery: /discover
  - Visual Hub: /reels
  - Simple Mode: /drive

  Context: You are embedded in a 2026-vibe professional sound environment.
  
  Current User Transmission: {{{message}}}
  Interaction History: {{#each history}}[{{role}}]: {{{content}}} {{/each}}`,
});

const auraChatFlow = ai.defineFlow(
  {
    name: 'auraChatFlow',
    inputSchema: AuraChatInputSchema,
    outputSchema: AuraChatOutputSchema,
  },
  async input => {
    try {
      const { output } = await prompt(input);
      return {
        ...output!,
        neuralStatus: output?.command !== 'NONE' ? "EXECUTING_COMMAND" : "SYNK_ACTIVE"
      };
    } catch (error: any) {
      console.error("AI Assistant Error:", error.message);
      return {
        response: "Neural Link unstable. High-frequency interference detected in the local node.",
        command: "NONE",
        suggestedAction: "Recalibrate in Discovery",
        suggestedPath: "/discover",
        neuralStatus: "ERROR_RECOVERY"
      };
    }
  }
);
