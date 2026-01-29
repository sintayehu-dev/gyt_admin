import { useNavigate } from 'react-router-dom';
import AuthTemplate from '../components/templates/AuthTemplate';
import LoginForm from '../components/organisms/LoginForm';
import { ROUTE_PATHS } from '../../../core/routes/routeNames';

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (credentials: LoginCredentials) => {
    console.log('Login submitted with:', credentials);
    // For now, just navigate to dashboard without API call
    navigate(ROUTE_PATHS.DASHBOARD);
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // For now, just navigate to dashboard
    navigate(ROUTE_PATHS.DASHBOARD);
  };

  return (
    <AuthTemplate>
      <LoginForm 
        onSubmit={handleLogin} 
        onGoogleLogin={handleGoogleLogin}
        loading={false} 
        error={null} 
      />
    </AuthTemplate>
  );
};

export default LoginPage;
