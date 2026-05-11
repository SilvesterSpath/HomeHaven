import { POST } from '@/app/api/properties/ai-content/route';
import connectDB from '@/config/database';
import { getSessionUser } from '@/utils/getSessionUser';
import { resetRateLimiter } from '@/utils/ai/rateLimiter';

jest.mock('@/config/database', () => jest.fn());
jest.mock('@/utils/getSessionUser', () => ({
  getSessionUser: jest.fn(),
}));

describe('POST /api/properties/ai-content', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetRateLimiter();
    process.env.OPENAI_API_KEY = 'test-key';
    global.fetch = jest.fn();
  });

  it('returns 401 when user is unauthenticated', async () => {
    getSessionUser.mockResolvedValue(null);

    const request = new Request('http://localhost/api/properties/ai-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(connectDB).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(401);
    expect(payload.error.code).toBe('UNAUTHORIZED');
  });

  it('returns 400 for invalid request payload', async () => {
    getSessionUser.mockResolvedValue({
      user: { id: 'user-1' },
      userId: 'user-1',
    });

    const request = new Request('http://localhost/api/properties/ai-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyType: '',
        location: 'Austin, TX',
        beds: 2,
        baths: 1,
        amenities: [],
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe('INVALID_REQUEST');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns 400 for malformed JSON body', async () => {
    getSessionUser.mockResolvedValue({
      user: { id: 'user-1' },
      userId: 'user-1',
    });

    const request = new Request('http://localhost/api/properties/ai-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-valid-json',
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe('INVALID_REQUEST');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns 502 AI_PROVIDER_ERROR when fetch throws', async () => {
    getSessionUser.mockResolvedValue({
      user: { id: 'user-1' },
      userId: 'user-1',
    });

    global.fetch.mockRejectedValue(new Error('Network failure'));

    const request = new Request('http://localhost/api/properties/ai-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyType: 'Apartment',
        location: 'Austin, TX',
        beds: 2,
        baths: 1,
        amenities: [],
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error.code).toBe('AI_PROVIDER_ERROR');
  });

  it('returns 502 AI_INVALID_RESPONSE when provider body is not parseable JSON', async () => {
    getSessionUser.mockResolvedValue({
      user: { id: 'user-1' },
      userId: 'user-1',
    });

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockRejectedValue(new SyntaxError('Unexpected token')),
    });

    const request = new Request('http://localhost/api/properties/ai-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyType: 'Apartment',
        location: 'Austin, TX',
        beds: 2,
        baths: 1,
        amenities: [],
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error.code).toBe('AI_INVALID_RESPONSE');
  });

  it('returns 502 AI_PROVIDER_ERROR when provider returns non-OK status', async () => {
    getSessionUser.mockResolvedValue({
      user: { id: 'user-1' },
      userId: 'user-1',
    });

    global.fetch.mockResolvedValue({ ok: false });

    const request = new Request('http://localhost/api/properties/ai-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyType: 'Apartment',
        location: 'Austin, TX',
        beds: 2,
        baths: 1,
        amenities: [],
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error.code).toBe('AI_PROVIDER_ERROR');
  });

  it('returns generated content when AI response is valid', async () => {
    getSessionUser.mockResolvedValue({
      user: { id: 'user-1' },
      userId: 'user-1',
    });

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                title: 'Modern Downtown Loft',
                shortDescription:
                  'Bright two-bedroom loft with city views and updated finishes.',
              }),
            },
          },
        ],
      }),
    });

    const request = new Request('http://localhost/api/properties/ai-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyType: 'Apartment',
        location: 'Austin, TX',
        beds: 2,
        baths: 2,
        amenities: ['Pool', 'Gym'],
        rawNotes: 'Close to public transit',
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.data).toEqual({
      title: 'Modern Downtown Loft',
      shortDescription:
        'Bright two-bedroom loft with city views and updated finishes.',
    });
  });
});
