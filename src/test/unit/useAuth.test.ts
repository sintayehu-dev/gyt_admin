import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useAuth from '../../features/auth/hooks/useAuth';
import { authAPI } from '../../features/auth/api/auth.api';
import { tokenRefreshService } from '../../core/services/api/tokenRefreshService';

vi.mock('../../features/auth/api/auth.api');
vi.mock('../../core/services/api/tokenRefreshService');

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initial State', () => {
    it('initializes with unauthenticated state when no token exists', () => {
      vi.mocked(tokenRefreshService.getAccessToken).mockReturnValue(null);
      vi.mocked(tokenRefreshService.getUserData).mockReturnValue(null);

      const { result } = renderHook(() => useAuth());

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('initializes with authenticated state when token and user data exist', () => {
      const mockUser = {
        uuid: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
        lastLogin: '2024-01-01',
        formattedLastLogin: 'Jan 1, 2024',
      };

      vi.mocked(tokenRefreshService.getAccessToken).mockReturnValue('access-token');
      vi.mocked(tokenRefreshService.getUserData).mockReturnValue(mockUser);

      const { result } = renderHook(() => useAuth());

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('successfully logs in user', async () => {
      const mockUser = {
        uuid: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
        lastLogin: '2024-01-01',
        formattedLastLogin: 'Jan 1, 2024',
      };

      const mockResponse = {
        success: true,
        data: {
          user: mockUser,
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      };

      vi.mocked(authAPI.login).mockResolvedValue(mockResponse as any);
      vi.mocked(tokenRefreshService.getAccessToken).mockReturnValue(null);
      vi.mocked(tokenRefreshService.getUserData).mockReturnValue(null);

      const { result } = renderHook(() => useAuth());

      let loginResult: any;
      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(loginResult.success).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();

      expect(tokenRefreshService.setAccessToken).toHaveBeenCalledWith('new-access-token');
      expect(tokenRefreshService.setRefreshToken).toHaveBeenCalledWith('new-refresh-token');
      expect(tokenRefreshService.setUserData).toHaveBeenCalledWith(mockUser);
    });

    it('handles login failure', async () => {
      const mockResponse = {
        success: false,
        error: 'Invalid credentials',
      };

      vi.mocked(authAPI.login).mockResolvedValue(mockResponse as any);
      vi.mocked(tokenRefreshService.getAccessToken).mockReturnValue(null);
      vi.mocked(tokenRefreshService.getUserData).mockReturnValue(null);

      const { result } = renderHook(() => useAuth());

      let loginResult: any;
      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'wrong-password',
        });
      });

      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBe('Invalid credentials');
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe('Invalid credentials');
      expect(result.current.isLoading).toBe(false);
    });

    it('handles unexpected errors during login', async () => {
      vi.mocked(authAPI.login).mockRejectedValue(new Error('Network error'));
      vi.mocked(tokenRefreshService.getAccessToken).mockReturnValue(null);
      vi.mocked(tokenRefreshService.getUserData).mockReturnValue(null);

      const { result } = renderHook(() => useAuth());

      let loginResult: any;
      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBe('Network error');
      expect(result.current.error).toBe('Network error');
      expect(result.current.isLoading).toBe(false);
    });

    it('sets loading state during login', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: { uuid: '1', email: 'test@example.com', name: 'Test' },
          accessToken: 'token',
          refreshToken: 'refresh',
        },
      };

      vi.mocked(authAPI.login).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockResponse as any), 100))
      );
      vi.mocked(tokenRefreshService.getAccessToken).mockReturnValue(null);
      vi.mocked(tokenRefreshService.getUserData).mockReturnValue(null);

      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('logout', () => {
    it('clears user session and resets state', () => {
      const mockUser = {
        uuid: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
        lastLogin: '2024-01-01',
        formattedLastLogin: 'Jan 1, 2024',
      };

      vi.mocked(tokenRefreshService.getAccessToken).mockReturnValue('access-token');
      vi.mocked(tokenRefreshService.getUserData).mockReturnValue(mockUser);

      const { result } = renderHook(() => useAuth());

      expect(result.current.isAuthenticated).toBe(true);

      act(() => {
        result.current.logout();
      });

      expect(tokenRefreshService.clearUserSession).toHaveBeenCalled();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('checkAuth', () => {
    it('returns true when token and user data exist', () => {
      const mockUser = {
        uuid: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
        lastLogin: '2024-01-01',
        formattedLastLogin: 'Jan 1, 2024',
      };

      vi.mocked(tokenRefreshService.getAccessToken)
        .mockReturnValueOnce(null)
        .mockReturnValue('access-token');
      vi.mocked(tokenRefreshService.getUserData)
        .mockReturnValueOnce(null)
        .mockReturnValue(mockUser);

      const { result } = renderHook(() => useAuth());

      let checkResult: boolean = false;
      act(() => {
        checkResult = result.current.checkAuth();
      });

      expect(checkResult).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });

    it('returns false when no token exists', () => {
      vi.mocked(tokenRefreshService.getAccessToken).mockReturnValue(null);
      vi.mocked(tokenRefreshService.getUserData).mockReturnValue(null);

      const { result } = renderHook(() => useAuth());

      let checkResult: boolean = true;
      act(() => {
        checkResult = result.current.checkAuth();
      });

      expect(checkResult).toBe(false);
    });

    it('returns false when token exists but no user data', () => {
      vi.mocked(tokenRefreshService.getAccessToken)
        .mockReturnValueOnce(null)
        .mockReturnValue('access-token');
      vi.mocked(tokenRefreshService.getUserData).mockReturnValue(null);

      const { result } = renderHook(() => useAuth());

      let checkResult: boolean = true;
      act(() => {
        checkResult = result.current.checkAuth();
      });

      expect(checkResult).toBe(false);
    });
  });

  describe('clearError', () => {
    it('clears error state', async () => {
      const mockResponse = {
        success: false,
        error: 'Invalid credentials',
      };

      vi.mocked(authAPI.login).mockResolvedValue(mockResponse as any);
      vi.mocked(tokenRefreshService.getAccessToken).mockReturnValue(null);
      vi.mocked(tokenRefreshService.getUserData).mockReturnValue(null);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'wrong-password',
        });
      });

      expect(result.current.error).toBe('Invalid credentials');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
