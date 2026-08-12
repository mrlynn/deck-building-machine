import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

export type AssistantProvider = 'anthropic' | 'openai';

function resolveProvider(): AssistantProvider {
  const preferred = process.env.ASSISTANT_PROVIDER?.trim().toLowerCase();
  if (preferred === 'openai' || preferred === 'anthropic') {
    return preferred;
  }
  if (process.env.ANTHROPIC_API_KEY?.trim()) return 'anthropic';
  if (process.env.OPENAI_API_KEY?.trim()) return 'openai';
  throw new Error(
    'Assistant is not configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env.local, then restart the dev server.',
  );
}

/** Prefer Anthropic when both keys exist; override with ASSISTANT_PROVIDER / ASSISTANT_MODEL. */
export function getAssistantModel(): LanguageModel {
  const provider = resolveProvider();
  const override = process.env.ASSISTANT_MODEL?.trim();

  if (provider === 'anthropic') {
    return anthropic(override || 'claude-sonnet-4-5');
  }

  return openai(override || 'gpt-5.4');
}

export function isAssistantConfigured(): boolean {
  return Boolean(
    process.env.ANTHROPIC_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim(),
  );
}
