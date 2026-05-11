import { POST } from '@/app/api/messages/route';
import connectDB from '@/config/database';
import Message from '@/models/Message';
import { getSessionUser } from '@/utils/getSessionUser';

const mockSave = jest.fn();

jest.mock('@/config/database', () => jest.fn());
jest.mock('@/utils/getSessionUser', () => ({
  getSessionUser: jest.fn(),
}));
jest.mock('@/models/Message', () => {
  const MockMessage = jest.fn().mockImplementation(function Message(payload) {
    Object.assign(this, payload);
    this.save = mockSave;
  });

  return {
    __esModule: true,
    default: MockMessage,
  };
});

describe('POST /api/messages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when user is not logged in', async () => {
    getSessionUser.mockResolvedValue(null);

    const request = new Request('http://localhost/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '123456',
        message: 'Hello',
        property: 'propertyId',
        recipient: 'recipientId',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(connectDB).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(401);
    expect(payload.message).toBe('You must be logged in to send the message');
  });

  it('returns 400 when sender attempts to message self', async () => {
    getSessionUser.mockResolvedValue({
      user: { id: 'same-user-id' },
      userId: 'same-user-id',
    });

    const request = new Request('http://localhost/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '123456',
        message: 'Hello',
        property: 'propertyId',
        recipient: 'same-user-id',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.message).toBe('You can not send message to yourself');
    expect(Message).not.toHaveBeenCalled();
    expect(mockSave).not.toHaveBeenCalled();
  });

  it('creates and saves message for valid request', async () => {
    getSessionUser.mockResolvedValue({
      user: { id: 'sender-id' },
      userId: 'sender-id',
    });
    mockSave.mockResolvedValue(undefined);

    const request = new Request('http://localhost/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '123456',
        message: 'Hello from test',
        property: 'propertyId',
        recipient: 'recipient-id',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.message).toBe('Message sent successfully');
    expect(Message).toHaveBeenCalledWith({
      sender: 'sender-id',
      recipient: 'recipient-id',
      property: 'propertyId',
      name: 'Test User',
      email: 'test@example.com',
      phone: '123456',
      body: 'Hello from test',
    });
    expect(mockSave).toHaveBeenCalledTimes(1);
  });
});
