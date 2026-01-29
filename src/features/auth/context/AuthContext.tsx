import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authAPI } from '../services/auth.api';
import { tokenRefreshService } from '../../../core/services/api/tokenRefreshService';

const AuthContext = createContext(null);

// Utility
const decodeJWT = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

const useProvideAuth = () => {
    // State
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Utility
    const applyAuthState = useCallback((accessToken, refreshToken) => {
        tokenRefreshService.setAccessToken(accessToken);
        tokenRefreshService.setRefreshToken(refreshToken);

        const decodedToken = decodeJWT(accessToken);
        if (decodedToken) {
            const userData = {
                id: decodedToken.sub,
                email: decodedToken.email,
            };
            tokenRefreshService.setUserData(userData);
            setUser(userData);
        }
        setIsAuthenticated(true);
    }, []);

    // Utility
    const checkAuth = useCallback(() => {
        const accessToken = tokenRefreshService.getAccessToken();
        const userData = tokenRefreshService.getUserData();

        if (accessToken && userData) {
            setUser(userData);
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Login
    const login = useCallback(async (credentials) => {
        setIsLoading(true);
        setError(null);

        const result = await authAPI.login(credentials);

        if (result.success) {
            const { accessToken, refreshToken } = result.data;
            applyAuthState(accessToken, refreshToken);
            setIsLoading(false);
            return { success: true };
        }

        setError(result.error);
        setIsLoading(false);
        return { success: false, error: result.error };
    }, [applyAuthState]);

    // Logout
    const logout = useCallback(() => {
        tokenRefreshService.clearUserSession();
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
    }, []);

    // Registration
    const register = useCallback(async (userData) => {
        setIsLoading(true);
        setError(null);

        const result = await authAPI.register(userData);

        if (result.success) {
            setIsLoading(false);
            return { success: true, data: result.data, message: result.message };
        }

        setError(result.error);
        setIsLoading(false);
        return { success: false, error: result.error };
    }, []);

    // VerifyOTP
    const verifyOTP = useCallback(async (email, otp) => {
        setIsLoading(true);
        setError(null);

        const result = await authAPI.verifyOTP(email, otp);

        if (result.success) {
            setIsLoading(false);
            return { success: true, data: result.data, message: result.message };
        }

        setError(result.error);
        setIsLoading(false);
        return { success: false, error: result.error };
    }, []);

    // Password Recovery
    const forgotPassword = useCallback(async (email) => {
        setIsLoading(true);
        setError(null);

        const result = await authAPI.forgotPassword(email);

        if (result.success) {
            setIsLoading(false);
            return { success: true, data: result.data };
        }

        setError(result.error);
        setIsLoading(false);
        return { success: false, error: result.error };
    }, []);

    // Password Recovery
    const resetPassword = useCallback(async (token, userId, newPassword) => {
        setIsLoading(true);
        setError(null);

        const result = await authAPI.resetPassword(token, userId, newPassword);

        if (result.success) {
            setIsLoading(false);
            return { success: true, data: result.data };
        }

        setError(result.error);
        setIsLoading(false);
        return { success: false, error: result.error };
    }, []);

    // Utility
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // State
    const state = useMemo(() => ({
        user,
        isAuthenticated,
        isLoading,
        error,
    }), [user, isAuthenticated, isLoading, error]);

    // Actions
    const authActions = useMemo(() => ({
        login,
        logout,
        register,
        verifyOTP,
        clearError,
    }), [login, logout, register, verifyOTP, clearError]);

    // Actions
    const recoveryActions = useMemo(() => ({
        forgotPassword,
        resetPassword,
    }), [forgotPassword, resetPassword]);

    return { state, authActions, recoveryActions };
};

// Provider
export const AuthProvider = ({ children }) => {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default AuthContext;

