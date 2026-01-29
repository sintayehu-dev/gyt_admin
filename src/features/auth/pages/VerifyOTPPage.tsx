import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthTemplate from '../components/templates/AuthTemplate';
import VerifyOTPForm from '../components/organisms/VerifyOTPForm';
import Toast from '../../../core/components/atoms/Toast';
import { ROUTE_PATHS } from '../../../core/routes/routeNames';
import { useRegistration } from '../hooks';
import formImage from '../../../core/assets/image/form_image.svg';

const VerifyOTPPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { submitOTP, resendOTP, isLoading, error } = useRegistration();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Get user data from navigation state (passed from RegisterPage)
    const userData = location.state;
    const email = userData?.email || '';

    // Redirect to register if no email provided
    useEffect(() => {
        if (!email) {
            navigate(ROUTE_PATHS.REGISTER);
        }
    }, [email, navigate]);

    if (!email) {
        return null;
    }

    const handleVerifyOTP = async (otp) => {
        // submitOTP expects registrationData.email to be set
        // So we need to use the email from navigation state
        const result = await submitOTP(otp, email);

        if (result.success) {
            setToastMessage(result.message || 'Your account has been created successfully!');
            setShowToast(true);

            // Navigate to login page after showing toast
            setTimeout(() => {
                navigate(ROUTE_PATHS.LOGIN);
            }, 2000);
        }
    };

    const handleResend = async () => {
        // resendOTP expects registrationData to be set
        // So we need to pass userData from navigation state
        const result = await resendOTP(userData);
        
        if (result.success) {
            setToastMessage(result.message || 'OTP has been resent to your email');
            setShowToast(true);
            
            // Hide toast after 3 seconds
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        }
    };

    return (
        <>
            <AuthTemplate imageSrc={formImage}>
                <VerifyOTPForm
                    onSubmit={handleVerifyOTP}
                    onResend={handleResend}
                    loading={isLoading}
                    email={email}
                    error={error}
                />
            </AuthTemplate>

            {showToast && (
                <Toast
                    type="success"
                    message={toastMessage}
                    onClose={() => setShowToast(false)}
                    duration={3000}
                />
            )}
        </>
    );
};

export default VerifyOTPPage;
