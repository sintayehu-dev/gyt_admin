import { useNavigate } from 'react-router-dom';
import AuthTemplate from '../components/templates/AuthTemplate';
import RegisterForm from '../components/organisms/RegisterForm';
import { ROUTE_PATHS } from '../../../core/routes/routeNames';
import { useRegistration } from '../hooks';
import formImage from '../../../core/assets/image/form_image.svg';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { submitRegistration, isLoading, error } = useRegistration();

    const handleRegister = async (userData) => {
        const result = await submitRegistration(userData);

        if (result.success) {
            // Navigate to OTP verification page with all user data for resend
            navigate(ROUTE_PATHS.VERIFY_OTP, { 
                state: userData
            });
        }
    };

    return (
        <AuthTemplate imageSrc={formImage}>
            <RegisterForm 
                onSubmit={handleRegister} 
                loading={isLoading} 
                error={error} 
            />
        </AuthTemplate>
    );
};

export default RegisterPage;
