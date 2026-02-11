import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { tokenInterceptor } from '../../core/services/api/tokenInterceptor';
import { tokenRefreshService } from '../../core/services/api/tokenRefreshService';
import { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

vi.mock('../../core/services/api/tokenRefreshService');

describe('TokenInterceptor', () => {
  let mockAxiosInstance: AxiosInstance;
  let requestInterceptor: any;
  let responseInterceptor: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockAxiosInstance = {
      interceptors: {
        request: {
          use: vi.fn((success, error) => {
            requestInterceptor = { success, error };
          }),
        },
        response: {
          use: vi.fn((success, error) => {
            responseInterceptor = { success, error };
          }),
        },
      },
    } as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Request Interceptor', () => {
    it('adds Authorization header when requireAuth is true and token exists', async () => {
      const mockToken = 'test-access-token';
      vi.mocked(tokenRefreshService.getAccessToken).mockReturnValue(mockToken);

      tokenInterceptor.setupInterceptors(mockAxiosInstance, true);

      const config: InternalAxiosRequestConfig = {
        headers: {} as any,
      } as InternalAxiosRequestConfig;

      const result = await requestInterceptor.success(config);

      expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
    });

    it('does not add Authorization header when requireAuth is false', async () => {
      const mockToken = 'test-access-token';
      vi.mocked(tokenRefreshService.getAccessToken).mockReturnValue(mockToken);

      tokenInterceptor.setupInterceptors(mockAxiosInstance, false);

      const config: InternalAxiosRequestConfig = {
        headers: {} as any,
      } as InternalAxiosRequestConfig;

      const result = await requestInterceptor.success(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('does not add Authorization header when no token exists', async () => {
      vi.mocked(tokenRefreshService.getAccessToken).mockReturnValue(null);

      tokenInterceptor.setupInterceptors(mockAxiosInstance, true);

      const config: InternalAxiosRequestConfig = {
        headers: {} as any,
      } as InternalAxiosRequestConfig;

      const result = await requestInterceptor.success(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('handles request errors', async () => {
      tokenInterceptor.setupInterceptors(mockAxiosInstance, true);

      const error = new Error('Request error');

      await expect(requestInterceptor.error(error)).rejects.toThrow('Request error');
    });
  });

  describe('Response Interceptor', () => {
    it('returns response on success', () => {
      tokenInterceptor.setupInterceptors(mockAxiosInstance, true);

      const response = { data: { message: 'Success' }, status: 200 };

      const result = responseInterceptor.success(response);

      expect(result).toBe(response);
    });

    it('rejects non-401 errors', async () => {
      tokenInterceptor.setupInterceptors(mockAxiosInstance, true);

      const error: AxiosError = {
        response: { status: 500 } as any,
        config: {} as any,
      } as AxiosError;

      await expect(responseInterceptor.error(error)).rejects.toEqual(error);
    });

    it('rejects 401 when requireAuth is false', async () => {
      tokenInterceptor.setupInterceptors(mockAxiosInstance, false);

      const error: AxiosError = {
        response: { status: 401 } as any,
        config: {
          headers: { Authorization: 'Bearer token' } as any,
        } as any,
      } as AxiosError;

      await expect(responseInterceptor.error(error)).rejects.toEqual(error);
    });

    it('rejects 401 when no Bearer token was sent', async () => {
      tokenInterceptor.setupInterceptors(mockAxiosInstance, true);

      const error: AxiosError = {
        response: { status: 401 } as any,
        config: {
          headers: {} as any,
        } as any,
      } as AxiosError;

      await expect(responseInterceptor.error(error)).rejects.toEqual(error);
    });



    it('does not retry request twice', async () => {
      vi.mocked(tokenRefreshService.refreshAccessToken).mockResolvedValue('new-token');
      vi.mocked(tokenRefreshService.clearUserSession).mockResolvedValue();

      const mockLocation = {
        pathname: '/dashboard',
        href: '',
      };
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
      });

      tokenInterceptor.setupInterceptors(mockAxiosInstance, true);

      const originalConfig: any = {
        headers: { Authorization: 'Bearer old-token' } as any,
        _retryAttempted: true,
      };

      const error: AxiosError = {
        response: { status: 401 } as any,
        config: originalConfig,
      } as AxiosError;

      await expect(responseInterceptor.error(error)).rejects.toEqual(error);
      expect(tokenRefreshService.clearUserSession).toHaveBeenCalled();
    });

    it('clears session when token refresh fails', async () => {
      vi.mocked(tokenRefreshService.refreshAccessToken).mockResolvedValue(null);
      vi.mocked(tokenRefreshService.clearUserSession).mockResolvedValue();

      const mockLocation = {
        pathname: '/dashboard',
        href: '',
      };
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
      });

      tokenInterceptor.setupInterceptors(mockAxiosInstance, true);

      const originalConfig: InternalAxiosRequestConfig = {
        headers: { Authorization: 'Bearer old-token' } as any,
      } as InternalAxiosRequestConfig;

      const error: AxiosError = {
        response: { status: 401 } as any,
        config: originalConfig,
      } as AxiosError;

      await expect(responseInterceptor.error(error)).rejects.toEqual(error);
      expect(tokenRefreshService.clearUserSession).toHaveBeenCalled();
    });

    it('does not redirect when already on login page', async () => {
      vi.mocked(tokenRefreshService.refreshAccessToken).mockResolvedValue(null);
      vi.mocked(tokenRefreshService.clearUserSession).mockResolvedValue();

      const mockLocation = {
        pathname: '/login',
        href: '/login',
      };
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
      });

      tokenInterceptor.setupInterceptors(mockAxiosInstance, true);

      const originalConfig: InternalAxiosRequestConfig = {
        headers: { Authorization: 'Bearer old-token' } as any,
      } as InternalAxiosRequestConfig;

      const error: AxiosError = {
        response: { status: 401 } as any,
        config: originalConfig,
      } as AxiosError;

      await expect(responseInterceptor.error(error)).rejects.toEqual(error);
      expect(mockLocation.href).toBe('/login');
    });
  });
});
