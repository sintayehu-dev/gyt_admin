import AuthTemplate from '../components/templates/AuthTemplate';
import CheckEmailForm from '../components/organisms/CheckEmailForm';

const CheckEmailPage = () => {
  return (
    <AuthTemplate>
      <CheckEmailForm email="user@example.com" />
    </AuthTemplate>
  );
};

export default CheckEmailPage;
