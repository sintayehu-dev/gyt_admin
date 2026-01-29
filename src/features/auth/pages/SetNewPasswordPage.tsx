import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthTemplate from '../components/templates/AuthTemplate';
import SetNewPasswordForm from '../components/organisms/SetNewPasswordForm';
import Toast from '../../../core/components/atoms/Toast';
import usePasswordRecovery from '../hooks/usePasswordRecovery';
import { ROUTE_PATHS } from '../../../core/routes/routeNames';
import formImage from '../../../core/assets/image/form_image.svg';

const SetNewPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { resetPassword, isLoading, error } = usePasswordRecovery();
    const [showToast, setShowToast] = useState(false);

    const handleSetNewPassword = async (formData) => {
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');

        if (!token || !userId) {
            return;
        }

        const result = await resetPassword(token, userId, formData.password);

        if (result.success) {
            setShowToast(true);
            setTimeout(() => {
                navigate(ROUTE_PATHS.LOGIN);
            }, 3000);
        }
    };

    return (
        <>
            <AuthTemplate imageSrc={formImage}>
                <SetNewPasswordForm onSubmit={handleSetNewPassword} loading={isLoading} error={error} />
            </AuthTemplate>

            {showToast && (
                <Toast
                    type="success"
                    message="Your password has been updated successfully."
                    onClose={() => setShowToast(false)}
                    duration={3000}
                />
            )}
        </>
    );
};

export default SetNewPasswordPage;
