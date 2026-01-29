import { useState, useCallback, useContext, useMemo } from 'react';
import AuthContext from '../context/AuthContext';

const useRegistration = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useRegistration must be used within an AuthProvider');
    }

    const { state, authActions } = context;
    const { register, verifyOTP, clearError } = authActions;

    const [registrationData, setRegistrationData] = useState(null);
    const [registrationStep, setRegistrationStep] = useState('form');
    const [validationError, setValidationError] = useState(null);

    // Registration
    const submitRegistration = useCallback(async (userData) => {
        setValidationError(null);
        clearError();

        const result = await register(userData);

        if (result.success) {
            setRegistrationData(userData);
            setRegistrationStep('otp');
            return {
                success: true,
                message: result.message || 'OTP sent to your email',
                email: userData.email
            };
        }

        return { success: false, error: result.error };
    }, [register, clearError]);

    // VerifyOTP
    const submitOTP = useCallback(async (otp, emailOverride = null) => {
        const email = emailOverride || registrationData?.email;

        if (!email) {
            setValidationError('Email not found. Please restart registration.');
            return { success: false, error: 'Email not found' };
        }

        setValidationError(null);
        clearError();

        const result = await verifyOTP(email, otp);

        if (result.success) {
            setRegistrationStep('success');
            return {
                success: true,
                message: result.message || 'Registration completed successfully',
                data: result.data
            };
        }

        return { success: false, error: result.error };
    }, [registrationData, verifyOTP, clearError]);

    // Registration
    const resendOTP = useCallback(async (userDataOverride = null) => {
        const dataToUse = userDataOverride || registrationData;

        if (!dataToUse) {
            setValidationError('No registration data found. Please restart registration.');
            return { success: false, error: 'No registration data' };
        }

        setValidationError(null);
        clearError();

        const result = await register(dataToUse);

        if (result.success) {
            return {
                success: true,
                message: result.message || 'OTP resent to your email'
            };
        }

        return { success: false, error: result.error };
    }, [registrationData, register, clearError]);

    const resetRegistration = useCallback(() => {
        setRegistrationData(null);
        setRegistrationStep('form');
        setValidationError(null);
        clearError();
    }, [clearError]);

    const goBackToForm = useCallback(() => {
        setRegistrationStep('form');
        setValidationError(null);
        clearError();
    }, [clearError]);

    return useMemo(
        () => ({
            registrationStep,
            registrationData,
            isLoading: state.isLoading,
            error: validationError || state.error,
            submitRegistration,
            submitOTP,
            resendOTP,
            resetRegistration,
            goBackToForm,
            clearError: () => {
                setValidationError(null);
                clearError();
            },
        }),
        [
            registrationStep,
            registrationData,
            state.isLoading,
            state.error,
            validationError,
            submitRegistration,
            submitOTP,
            resendOTP,
            resetRegistration,
            goBackToForm,
            clearError,
        ]
    );
};

export default useRegistration;

