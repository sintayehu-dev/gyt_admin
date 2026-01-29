import { useNavigate } from 'react-router-dom';
import AuthTemplate from '../components/templates/AuthTemplate';
import ResetPasswordForm from '../components/organisms/ResetPasswordForm';
import { ROUTE_PATHS } from '../../../core/routes/routeNames';

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const handleResetPassword = (data: { email: string }) => {
    console.log('Reset password submitted with:', data);
    // For now, just navigate to check email page
    navigate(ROUTE_PATHS.CHECK_EMAIL);
  };

  return (
    <AuthTemplate>
      <ResetPasswordForm 
        onSubmit={handleResetPassword}
        loading={false}
        error={null}
      />
    </AuthTemplate>
  );
};

export default ResetPasswordPage;
