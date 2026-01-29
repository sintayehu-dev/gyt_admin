import { useContext, useMemo } from 'react';
import AuthContext from '../context/AuthContext';

const usePasswordRecovery = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('usePasswordRecovery must be used within an AuthProvider');
  }

  const { state, recoveryActions } = context;

  return useMemo(
    () => ({
      forgotPassword: recoveryActions.forgotPassword,
      resetPassword: recoveryActions.resetPassword,
      isLoading: state.isLoading,
      error: state.error,
    }),
    [
      recoveryActions.forgotPassword,
      recoveryActions.resetPassword,
      state.isLoading,
      state.error,
    ]
  );
};

export default usePasswordRecovery;
