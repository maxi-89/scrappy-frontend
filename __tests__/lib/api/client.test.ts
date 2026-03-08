import { apiFetch, apiFetchBlob, ApiError } from '@/lib/api/client';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('ApiError', () => {
  it('is an instance of Error', () => {
    const error = new ApiError(404, 'Not found');
    expect(error).toBeInstanceOf(Error);
  });

  it('stores status and message', () => {
    const error = new ApiError(401, 'Unauthorized');
    expect(error.status).toBe(401);
    expect(error.message).toBe('Unauthorized');
  });
});

describe('apiFetch', () => {
  it('calls the correct URL with the base URL', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    await apiFetch('/test');

    expect(fetch).toHaveBeenCalledWith(
      'https://api.test.io/test',
      expect.any(Object),
    );
  });

  it('includes Content-Type: application/json header', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    await apiFetch('/test');

    const [, options] = (fetch as jest.Mock).mock.calls[0];
    expect(options.headers['Content-Type']).toBe('application/json');
  });

  it('includes Authorization Bearer header when token is provided', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    await apiFetch('/test', { token: 'my-jwt-token' });

    const [, options] = (fetch as jest.Mock).mock.calls[0];
    expect(options.headers['Authorization']).toBe('Bearer my-jwt-token');
  });

  it('does not include Authorization header when no token is provided', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    await apiFetch('/test');

    const [, options] = (fetch as jest.Mock).mock.calls[0];
    expect(options.headers).not.toHaveProperty('Authorization');
  });

  it('returns parsed JSON on success', async () => {
    const mockData = { id: '123', name: 'test' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockData,
    });

    const result = await apiFetch<typeof mockData>('/test');

    expect(result).toEqual(mockData);
  });

  it('throws ApiError when response is not ok', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Not found' }),
    });

    await expect(apiFetch('/test')).rejects.toBeInstanceOf(ApiError);
  });

  it('throws ApiError with correct status and message', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Unauthorized' }),
    });

    try {
      await apiFetch('/test');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(401);
      expect((err as ApiError).message).toBe('Unauthorized');
    }
  });

  it('uses fallback message when response body has no error field', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(apiFetch('/test')).rejects.toMatchObject({
      status: 500,
      message: 'Request failed: 500',
    });
  });

  it('returns undefined for 204 No Content responses', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: async () => { throw new Error('no body'); },
    });

    const result = await apiFetch<void>('/test');
    expect(result).toBeUndefined();
  });

  it('passes additional fetch options through', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    await apiFetch('/test', { method: 'POST', body: JSON.stringify({ data: 'value' }) });

    const [, options] = (fetch as jest.Mock).mock.calls[0];
    expect(options.method).toBe('POST');
    expect(options.body).toBe(JSON.stringify({ data: 'value' }));
  });
});

describe('apiFetchBlob', () => {
  it('calls the correct URL and returns a Blob', async () => {
    const mockBlob = new Blob(['csv-data'], { type: 'text/csv' });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      blob: async () => mockBlob,
    });

    const result = await apiFetchBlob('/orders/123/download');

    expect(fetch).toHaveBeenCalledWith(
      'https://api.test.io/orders/123/download',
      expect.any(Object),
    );
    expect(result).toBeInstanceOf(Blob);
  });

  it('includes Authorization header when token is provided', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      blob: async () => new Blob(),
    });

    await apiFetchBlob('/test', { token: 'my-token' });

    const [, options] = (fetch as jest.Mock).mock.calls[0];
    expect(options.headers['Authorization']).toBe('Bearer my-token');
  });

  it('throws ApiError when response is not ok', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: 'Forbidden' }),
    });

    await expect(apiFetchBlob('/test')).rejects.toBeInstanceOf(ApiError);
  });
});
