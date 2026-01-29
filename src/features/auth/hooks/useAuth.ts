import { useContext, useMemo } from 'react';
import AuthContext from '../context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { state, authActions } = context;

  return useMemo(
    () => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      error: state.error,
      login: authActions.login,
      logout: authActions.logout,
      clearError: authActions.clearError,
    }),
    [
      state.user,
      state.isAuthenticated,
      state.isLoading,
      state.error,
      authActions.login,
      authActions.logout,
      authActions.clearError,
    ]
  );
};

export default useAuth;

