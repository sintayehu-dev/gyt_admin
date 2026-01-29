import { useNavigate } from 'react-router-dom';
import AuthTemplate from '../components/templates/AuthTemplate';
import LoginForm from '../components/organisms/LoginForm';
import { ROUTE_PATHS } from '../../../core/routes/routeNames';
import { useAuthContext } from '../context/AuthContext';

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthContext();

  const handleLogin = async (credentials: LoginCredentials) => {
    const result = await login({
      email: credentials.email,
      password: credentials.password,
    });

    if (result.success) {
      navigate(ROUTE_PATHS.DASHBOARD);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  return (
    <AuthTemplate>
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
