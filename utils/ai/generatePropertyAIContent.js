import { buildPropertyAIContentPrompt } from '@/utils/ai/buildPropertyAIContentPrompt';
import { parsePropertyAIContent } from '@/utils/ai/parsePropertyAIContent';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = 'gpt-4o-mini';

export const generatePropertyAIContent = async (input) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      error: {
        status: 500,
        message: 'AI provider is not configured on the server',
        code: 'AI_PROVIDER_NOT_CONFIGURED',
      },
    };
  }

  let response;
  try {
    response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content:
              'You produce clean listing copy and must return only valid JSON.',
          },
          {
            role: 'user',
            content: buildPropertyAIContentPrompt(input),
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });
  } catch {
    return {
      error: {
        status: 502,
        message: 'AI provider request failed',
        code: 'AI_PROVIDER_ERROR',
      },
    };
  }

  if (!response.ok) {
    return {
      error: {
        status: 502,
        message: 'AI provider request failed',
        code: 'AI_PROVIDER_ERROR',
      },
    };
  }

  let data;
  try {
    data = await response.json();
  } catch {
    return {
      error: {
        status: 502,
        message: 'AI provider returned an invalid response shape',
        code: 'AI_INVALID_RESPONSE',
      },
    };
  }
  const content = data?.choices?.[0]?.message?.content;
  const parsed = parsePropertyAIContent(content);

  if (!parsed) {
    return {
      error: {
        status: 502,
        message: 'AI provider returned an invalid response shape',
        code: 'AI_INVALID_RESPONSE',
      },
    };
  }

  return {
    value: parsed,
  };
};
