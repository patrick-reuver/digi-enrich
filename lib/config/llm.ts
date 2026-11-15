import OpenAI from 'openai';

/**
 * Optional OpenAI-compatible provider settings.
 * Defaults preserve the upstream behavior when no overrides are set.
 * Configure via server-side .env.local, never in client-side code.
 */
export function createLLMClient(apiKey: string): OpenAI {
  const baseURL = process.env.OPENAI_BASE_URL?.trim();
  return new OpenAI({ apiKey, ...(baseURL ? { baseURL } : {}) });
}

export function getLLMModel(tier: 'primary' | 'fast' = 'primary'): string {
  const primary = process.env.OPENAI_MODEL?.trim() || 'gpt-5';
  if (tier === 'primary') return primary;

  return process.env.OPENAI_MODEL_FAST?.trim()
    || process.env.OPENAI_MODEL?.trim()
    || 'gpt-5-mini';
}
