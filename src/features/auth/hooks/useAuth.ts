import { useState, useCallback } from 'react';
import { authAPI } from '../api/auth.api';
import { tokenRefreshService } from '../../../core/services/api/tokenRefreshService';

interface User {
  uuid: string;
  email: string;
  name: string;
  role: string;
  lastLogin: string;
  formattedLastLogin: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  /**
   * Login function
   */
  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await authAPI.login(credentials);

      if (result.success) {
        const { user, accessToken, refreshToken } = result.data;

        // Store tokens
        tokenRefreshService.setAccessToken(accessToken);
        tokenRefreshService.setRefreshToken(refreshToken);

        // Store user data
        const userData = {
          id: user.uuid,
          email: user.email,
          name: user.name,
          role: user.role,
        };
        tokenRefreshService.setUserData(userData);

        // Update state
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return { success: true };
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error,
        }));

        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Logout function
   */
  const logout = useCallback(() => {
    tokenRefreshService.clearUserSession();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  /**
   * Check authentication status
   */
  const checkAuth = useCallback(() => {
    const accessToken = tokenRefreshService.getAccessToken();
    const userData = tokenRefreshService.getUserData();

    if (accessToken && userData) {
      setState(prev => ({
        ...prev,
        user: userData as User,
        isAuthenticated: true,
      }));
      return true;
    }

    return false;
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    login,
    logout,
    checkAuth,
    clearError,
  };
};

export default useAuth;
