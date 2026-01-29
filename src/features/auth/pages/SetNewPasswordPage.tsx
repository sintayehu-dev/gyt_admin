import { useNavigate } from 'react-router-dom';
import AuthTemplate from '../components/templates/AuthTemplate';
import SetNewPasswordForm from '../components/organisms/SetNewPasswordForm';
import { ROUTE_PATHS } from '../../../core/routes/routeNames';

const SetNewPasswordPage = () => {
  const navigate = useNavigate();

  const handleSetNewPassword = (data: { password: string; confirmPassword: string }) => {
    console.log('Set new password submitted with:', data);
    // For now, just navigate to login page
    navigate(ROUTE_PATHS.LOGIN);
  };

  return (
    <AuthTemplate>
      <SetNewPasswordForm 
        onSubmit={handleSetNewPassword}
        loading={false}
        error={null}
      />
    </AuthTemplate>
  );
};

export default SetNewPasswordPage;
