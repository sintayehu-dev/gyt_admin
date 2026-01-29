import { useState } from 'react';
import Button from '../../../../core/components/atoms/Button';
import BackButton from '../../../../core/components/atoms/BackButton';
import PasswordInput from '../../../../core/components/molecules/PasswordInput';
import './SetNewPasswordForm.css';

const SetNewPasswordForm = ({ onSubmit, loading = false, error = null }) => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
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

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
        <div className="set-new-password-form">
            <div className="set-new-password-form__header">
                <div className="set-new-password-form__logo-row">
                    <BackButton onClick={handleBackToLogin}>
                        Go Back
                    </BackButton>
                </div>
                <h1 className="set-new-password-form__title text-h6">Set New Password</h1>
                <p className="set-new-password-form__description text-body-4">
                    Your new password must be different from previously used passwords.
                </p>
            </div>

            {error && (
                <div className="set-new-password-form__error">
                    <p className="text-body-4">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="set-new-password-form__form">
                <PasswordInput
                    label="New Password"
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    disabled={loading}
                />

                <PasswordInput
                    label="Confirm Password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    disabled={loading}
                />

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Continue'}
                </Button>
            </form>
        </div>
    );
};

export default SetNewPasswordForm;
