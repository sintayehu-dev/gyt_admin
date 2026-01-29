import { useLocation } from 'react-router-dom';
import AuthTemplate from '../components/templates/AuthTemplate';
import CheckEmailForm from '../components/organisms/CheckEmailForm';
import formImage from '../../../core/assets/image/form_image.svg';

const CheckEmailPage = () => {
    const location = useLocation();
    const email = location.state?.email || 'your email';

    return (
        <AuthTemplate imageSrc={formImage}>
            <CheckEmailForm email={email} />
        </AuthTemplate>
    );
};

export default CheckEmailPage;

