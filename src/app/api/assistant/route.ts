import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from 'ai';
import { getAssistantModel, isAssistantConfigured } from '@/lib/assistant/model';
import {
  buildAssistantInstructions,
  type WizardAssistantState,
} from '@/lib/assistant/prompt';

export const maxDuration = 60;

type AssistantRequestBody = {
  messages: UIMessage[];
  wizardState?: WizardAssistantState | null;
};

function isWizardState(value: unknown): value is WizardAssistantState {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.activeStep === 'number' &&
    typeof v.stepName === 'string' &&
    typeof v.customerName === 'string' &&
    typeof v.customerSlug === 'string' &&
    typeof v.layoutStyle === 'string'
  );
}

export async function POST(req: Request) {
  if (!isAssistantConfigured()) {
    return Response.json(
      {
        error:
          'Assistant is not configured. Add ANTHROPIC_API_KEY or OPENAI_API_KEY to .env.local and restart the server.',
      },
      { status: 503 },
    );
  }

  let body: AssistantRequestBody;
  try {
    body = (await req.json()) as AssistantRequestBody;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { messages, wizardState } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'messages array is required' }, { status: 400 });
  }

  const result = streamText({
    model: getAssistantModel(),
    instructions: buildAssistantInstructions(
      isWizardState(wizardState) ? wizardState : null,
    ),
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
