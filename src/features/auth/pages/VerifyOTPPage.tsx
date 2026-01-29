import { useNavigate } from 'react-router-dom';
import AuthTemplate from '../components/templates/AuthTemplate';
import VerifyOTPForm from '../components/organisms/VerifyOTPForm';
import { ROUTE_PATHS } from '../../../core/routes/routeNames';

const VerifyOTPPage = () => {
  const navigate = useNavigate();

  const handleVerifyOTP = (otp: string) => {
    console.log('OTP submitted:', otp);
    // For now, just navigate to dashboard
    navigate(ROUTE_PATHS.DASHBOARD);
  };

  const handleResendOTP = () => {
    console.log('Resend OTP clicked');
  };

  return (
    <AuthTemplate>
      <VerifyOTPForm 
        onSubmit={handleVerifyOTP}
        onResend={handleResendOTP}
        loading={false}
        email="user@example.com"
        error={null}
      />
    </AuthTemplate>
  );
};

export default VerifyOTPPage;
