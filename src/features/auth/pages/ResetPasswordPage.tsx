import { useNavigate } from 'react-router-dom';
import AuthTemplate from '../components/templates/AuthTemplate';
import ResetPasswordForm from '../components/organisms/ResetPasswordForm';
import usePasswordRecovery from '../hooks/usePasswordRecovery';
import { ROUTE_PATHS } from '../../../core/routes/routeNames';
import formImage from '../../../core/assets/image/form_image.svg';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const { forgotPassword, isLoading, error } = usePasswordRecovery();

    const handleResetPassword = async (credentials) => {
        const result = await forgotPassword(credentials.email);

        if (result.success) {
            navigate(ROUTE_PATHS.CHECK_EMAIL, { state: { email: credentials.email } });
        }
    };

    return (
        <AuthTemplate imageSrc={formImage}>
            <ResetPasswordForm onSubmit={handleResetPassword} loading={isLoading} error={error} />
        </AuthTemplate>
    );
};

export default ResetPasswordPage;
