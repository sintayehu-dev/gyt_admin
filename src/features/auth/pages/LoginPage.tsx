import { useNavigate } from 'react-router-dom';
import AuthTemplate from '../components/templates/AuthTemplate';
import LoginForm from '../components/organisms/LoginForm';
import { ROUTE_PATHS } from '../../../core/routes/routeNames';
import useAuth from '../hooks/useAuth';
import formImage from '../../../core/assets/image/form_image.svg';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();

  const handleLogin = async (credentials) => {
    const result = await login(credentials);

    if (result.success) {
      navigate(ROUTE_PATHS.DASHBOARD);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth login
    console.log('Google login clicked');
    // This would typically redirect to Google OAuth or trigger a popup
  };

  return (
    <AuthTemplate imageSrc={formImage}>
      <LoginForm 
        onSubmit={handleLogin} 
        onGoogleLogin={handleGoogleLogin}
        loading={isLoading} 
        error={error} 
      />
    </AuthTemplate>
  );
};

export default LoginPage;
