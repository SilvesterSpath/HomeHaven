import connectDB from '@/config/database';
import { getSessionUser } from '@/utils/getSessionUser';
import { generatePropertyAIContent } from '@/utils/ai/generatePropertyAIContent';
import { validatePropertyAIContentPayload } from '@/utils/ai/validatePropertyAIContentPayload';
import { isRateLimited } from '@/utils/ai/rateLimiter';

const jsonResponse = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });

const errorResponse = (status, message, code) =>
  jsonResponse(
    {
      success: false,
      error: {
        code,
        message,
      },
    },
    status,
  );

// POST /api/properties/ai-content
export const POST = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return errorResponse(401, 'Unauthorized', 'UNAUTHORIZED');
    }

    if (isRateLimited(sessionUser.userId)) {
      return errorResponse(
        429,
        'Too many requests. Try again shortly.',
        'RATE_LIMITED',
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse(
        400,
        'Request body must be valid JSON',
        'INVALID_REQUEST',
      );
    }

    const validated = validatePropertyAIContentPayload(body);

    if (validated.error) {
      return errorResponse(400, validated.error, 'INVALID_REQUEST');
    }

    const aiResult = await generatePropertyAIContent(validated.value);

    if (aiResult.error) {
      return errorResponse(
        aiResult.error.status,
        aiResult.error.message,
        aiResult.error.code,
      );
    }

    return jsonResponse({
      success: true,
      data: aiResult.value,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(
      500,
      'Failed to generate AI content',
      'INTERNAL_ERROR',
    );
  }
};
