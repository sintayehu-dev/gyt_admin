import { useState } from 'react';
import Button from '../../../../core/components/atoms/Button';
import BackButton from '../../../../core/components/atoms/BackButton';
import InputField from '../../../../core/components/molecules/InputField';
import './ResetPasswordForm.css';

const ResetPasswordForm = ({ onSubmit, loading = false, error = null }) => {
    const [formData, setFormData] = useState({
        email: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(formData);
    };

    const handleBackToLogin = () => {
        window.location.href = '/login';
    };

    return (
        <div className="reset-password-form">
            <div className="reset-password-form__header">
                <div className="reset-password-form__logo-row">
                    <BackButton onClick={handleBackToLogin}>
                        Go Back
                    </BackButton>
                </div>
                <h1 className="reset-password-form__title text-h4">Reset Password</h1>
                <p className="reset-password-form__description text-body-4">
                    Enter your registered email and we'll send you a reset link or code.
                </p>
            </div>

            {error && (
                <div className="reset-password-form__error">
                    <p className="text-body-4">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="reset-password-form__form">
                <InputField
                    label="Email address"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    disabled={loading}
                />

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
            </form>
        </div>
    );
};

export default ResetPasswordForm;
