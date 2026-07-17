
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {openAI} from 'genkitx-openai';

/**
 * AuraTune AI Engine
 * Multi-provider initialization with high-resilience fallback logic.
 */
export const ai = genkit({
  plugins: [
    googleAI(),
    // DeepSeek Resilience Node - using OpenRouter/OpenAI compatible bridge
    openAI({
      name: 'deepseek',
      apiKey: process.env.DEEPSEEK_API_KEY || 'dummy',
      baseURL: 'https://api.deepseek.com/v1',
    }),
    // OpenRouter (Free Models Router)
    openAI({
      name: 'openrouter',
      apiKey: process.env.OPENROUTER_API_KEY || 'dummy',
      baseURL: 'https://openrouter.ai/api/v1',
    })
  ].filter(p => typeof p === 'function'), // Safety filter to prevent "plugin is not a function" errors
  model: 'googleai/gemini-2.5-flash',
});
