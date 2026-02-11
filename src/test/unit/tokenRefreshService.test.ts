import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { tokenRefreshService } from '../../core/services/api/tokenRefreshService';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('TokenRefreshService', () => {
  let mockAxiosInstance: any;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    
    mockAxiosInstance = {
      post: vi.fn(),
    };
    
    mockedAxios.create.mockReturnValue(mockAxiosInstance);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Token Storage', () => {
    it('sets and gets access token', () => {
      const token = 'test-access-token';
      tokenRefreshService.setAccessToken(token);
      expect(tokenRefreshService.getAccessToken()).toBe(token);
    });

    it('sets and gets refresh token', () => {
      const token = 'test-refresh-token';
      tokenRefreshService.setRefreshToken(token);
      expect(tokenRefreshService.getRefreshToken()).toBe(token);
    });

    it('returns null when no access token exists', () => {
      expect(tokenRefreshService.getAccessToken()).toBeNull();
    });

    it('returns null when no refresh token exists', () => {
      expect(tokenRefreshService.getRefreshToken()).toBeNull();
    });
  });

  describe('User Data Storage', () => {
    it('sets and gets user data', () => {
      const user = { id: '1', email: 'test@example.com', name: 'Test User' };
      tokenRefreshService.setUserData(user);
      
      const retrieved = tokenRefreshService.getUserData();
      expect(retrieved).toEqual(user);
    });

    it('returns null when no user data exists', () => {
      expect(tokenRefreshService.getUserData()).toBeNull();
    });

    it('handles complex user objects', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        profile: { name: 'Test', age: 30 },
        roles: ['admin', 'user'],
      };
      
      tokenRefreshService.setUserData(user);
      expect(tokenRefreshService.getUserData()).toEqual(user);
    });
  });

  describe('clearUserSession', () => {
    it('clears all tokens and user data', async () => {
      tokenRefreshService.setAccessToken('access-token');
      tokenRefreshService.setRefreshToken('refresh-token');
      tokenRefreshService.setUserData({ id: '1', name: 'Test' });

      await tokenRefreshService.clearUserSession();

      expect(tokenRefreshService.getAccessToken()).toBeNull();
      expect(tokenRefreshService.getRefreshToken()).toBeNull();
      expect(tokenRefreshService.getUserData()).toBeNull();
    });
  });

  describe('isAccessTokenExpired', () => {
    it('returns true when no token exists', () => {
      expect(tokenRefreshService.isAccessTokenExpired()).toBe(true);
    });

    it('returns true for expired token', () => {
      const expiredTime = Math.floor(Date.now() / 1000) - 3600;
      const payload = { exp: expiredTime };
      const token = createMockJWT(payload);
      
      tokenRefreshService.setAccessToken(token);
      expect(tokenRefreshService.isAccessTokenExpired()).toBe(true);
    });

    it('returns false for valid token', () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const payload = { exp: futureTime };
      const token = createMockJWT(payload);
      
      tokenRefreshService.setAccessToken(token);
      expect(tokenRefreshService.isAccessTokenExpired()).toBe(false);
    });

    it('returns true for token expiring within 60 seconds', () => {
      const soonTime = Math.floor(Date.now() / 1000) + 30;
      const payload = { exp: soonTime };
      const token = createMockJWT(payload);
      
      tokenRefreshService.setAccessToken(token);
      expect(tokenRefreshService.isAccessTokenExpired()).toBe(true);
    });

    it('handles invalid token format', () => {
      tokenRefreshService.setAccessToken('invalid-token');
      expect(tokenRefreshService.isAccessTokenExpired()).toBe(false);
    });
  });

  describe('refreshAccessToken', () => {
    it('returns null when no refresh token exists', async () => {
      const result = await tokenRefreshService.refreshAccessToken();
      expect(result).toBeNull();
    });

    it('handles refresh failure gracefully', async () => {
      tokenRefreshService.setRefreshToken('refresh-token');

      mockAxiosInstance.post.mockRejectedValue(new Error('Refresh failed'));

      const result = await tokenRefreshService.refreshAccessToken();
      expect(result).toBeNull();
    });
  });

  describe('getValidAccessToken', () => {
    it('returns current token when valid', async () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const payload = { exp: futureTime };
      const token = createMockJWT(payload);
      
      tokenRefreshService.setAccessToken(token);

      const result = await tokenRefreshService.getValidAccessToken();
      expect(result).toBe(token);
    });

    it('returns null when no token exists', async () => {
      const result = await tokenRefreshService.getValidAccessToken();
      expect(result).toBeNull();
    });
  });
});

function createMockJWT(payload: any): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = 'mock-signature';
  return `${header}.${encodedPayload}.${signature}`;
}
