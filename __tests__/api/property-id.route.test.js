import { DELETE, GET } from '@/app/api/properties/[id]/route';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';

jest.mock('@/config/database', () => jest.fn());
jest.mock('@/utils/getSessionUser', () => ({
  getSessionUser: jest.fn(),
}));
jest.mock('@/models/Property', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('GET /api/properties/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 404 when property does not exist', async () => {
    Property.findById.mockResolvedValue(null);

    const response = await GET(new Request('http://localhost/api/properties/1'), {
      params: { id: '1' },
    });

    expect(connectDB).toHaveBeenCalledTimes(1);
    expect(Property.findById).toHaveBeenCalledWith('1');
    expect(response.status).toBe(404);
    await expect(response.text()).resolves.toBe('Property not found');
  });

  it('returns property payload when record exists', async () => {
    Property.findById.mockResolvedValue({ _id: '1', name: 'Sample listing' });

    const response = await GET(new Request('http://localhost/api/properties/1'), {
      params: { id: '1' },
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      _id: '1',
      name: 'Sample listing',
    });
  });
});

describe('DELETE /api/properties/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when there is no active user session', async () => {
    Property.findById.mockResolvedValue({ owner: { toString: () => 'owner-id' } });
    getSessionUser.mockResolvedValue(null);

    const response = await DELETE(
      new Request('http://localhost/api/properties/1', { method: 'DELETE' }),
      { params: { id: '1' } }
    );

    expect(response.status).toBe(401);
    await expect(response.text()).resolves.toBe('Unauthorized');
  });

  it('returns 401 when logged-in user is not the owner', async () => {
    Property.findById.mockResolvedValue({ owner: { toString: () => 'owner-id' } });
    getSessionUser.mockResolvedValue({
      user: { id: 'different-user' },
      userId: 'different-user',
    });

    const response = await DELETE(
      new Request('http://localhost/api/properties/1', { method: 'DELETE' }),
      { params: { id: '1' } }
    );

    expect(response.status).toBe(401);
    await expect(response.text()).resolves.toBe('Unauthorized');
  });
});
