import { useNavigate } from 'react-router-dom';
import Button from '../../../../core/components/atoms/Button';
import BackButton from '../../../../core/components/atoms/BackButton';
import { ROUTE_PATHS } from '../../../../core/routes/routeNames';
import './CheckEmailForm.css';

interface CheckEmailFormProps {
    email: string;
}

const CheckEmailForm = ({ email }: CheckEmailFormProps) => {
    const navigate = useNavigate();

    const handleOpenGmail = () => {
        window.open('https://mail.google.com', '_blank');
    };

    const handleBackToLogin = () => {
        navigate(ROUTE_PATHS.LOGIN);
    };

    const handleResend = () => {
        navigate(ROUTE_PATHS.RESET_PASSWORD);
    };

    return (
        <div className="check-email-form">
            <div className="check-email-form__header">
                <div className="check-email-form__logo-row">
                <BackButton onClick={handleBackToLogin}>
                        Go Back
                </BackButton>
                </div>
            </div>

            <div className="check-email-form__content">
                <div className="check-email-form__icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                </div>

                <h1 className="check-email-form__title text-h6">
                    Check Your Email
                </h1>

                <p className="check-email-form__description text-body-2">
                    We've sent a password reset link to <strong>{email}</strong>
                </p>

                <p className="check-email-form__instruction text-body-4">
                    Please click the link in the email to reset your password. The link will expire in 24 hours.
                </p>

                <div className="check-email-form__actions">
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={handleOpenGmail}
                    >
                        Open Gmail
                    </Button>

                    <p className="check-email-form__resend text-body-4">
                        Didn't receive the email?{' '}
                        <button
                            className="check-email-form__resend-link"
                            onClick={handleResend}
                        >
                            Resend
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CheckEmailForm;

