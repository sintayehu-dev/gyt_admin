import { useNavigate } from 'react-router-dom';
import AuthTemplate from '../components/templates/AuthTemplate';
import RegisterForm from '../components/organisms/RegisterForm';
import { ROUTE_PATHS } from '../../../core/routes/routeNames';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = (userData: any) => {
    console.log('Register submitted with:', userData);
    // For now, just navigate to verify OTP page
    navigate(ROUTE_PATHS.VERIFY_OTP);
  };

  return (
    <AuthTemplate>
      <RegisterForm 
        onSubmit={handleRegister}
        loading={false}
        error={null}
      />
    </AuthTemplate>
  );
};

export default RegisterPage;
