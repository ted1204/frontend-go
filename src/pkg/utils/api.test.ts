import { beforeEach, describe, expect, it, vi } from 'vitest';

// We will mock the config module to control API_KEY behavior
vi.mock('@/core/config/config', () => ({ default: { API_KEY: 'TEST_API_KEY' } }));

import { fetchWithAuth, ApiError } from './api';

describe('fetchWithAuth', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // clear localStorage
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: vi.fn().mockReturnValue(null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      configurable: true,
    });
  });

  it('sends X-API-Key header when API_KEY present', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    Object.defineProperty(globalThis, 'fetch', { value: fetchMock, configurable: true });

    const res = await fetchWithAuth('https://example.test/ping', { method: 'GET' });

    expect(fetchMock).toHaveBeenCalled();
    const callArgs = fetchMock.mock.calls[0];
    expect(callArgs[0]).toBe('https://example.test/ping');
    expect(callArgs[1].credentials).toBe('include');
    expect(callArgs[1].headers['X-API-Key']).toBe('TEST_API_KEY');
    expect(res).toEqual({ ok: true });
  });

  it('returns minimal object for 204', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204, json: async () => null });
    Object.defineProperty(globalThis, 'fetch', { value: fetchMock, configurable: true });

    const res = await fetchWithAuth('https://example.test/nocontent', { method: 'DELETE' });
    expect(res).toEqual({ status: 204 });
  });

  it('throws ApiError for network failures', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network failure'));
    Object.defineProperty(globalThis, 'fetch', { value: fetchMock, configurable: true });

    await expect(fetchWithAuth('https://example.test/fail')).rejects.toBeInstanceOf(ApiError);
  });
});
