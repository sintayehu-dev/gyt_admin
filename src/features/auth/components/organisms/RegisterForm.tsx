import { useState, ChangeEvent, FormEvent } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import Button from '../../../../core/components/atoms/Button';
import Label from '../../../../core/components/atoms/Label';
import InputField from '../../../../core/components/molecules/InputField';
import PasswordInput from '../../../../core/components/molecules/PasswordInput';
import './RegisterForm.css';

interface RegisterFormData {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

interface RegisterFormErrors {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    confirmPassword?: string;
    agreeToTerms?: string;
}

interface RegisterFormProps {
    onSubmit: (data: RegisterFormData) => void;
    loading?: boolean;
    error?: string | null;
}

const RegisterForm = ({ onSubmit, loading = false, error = null }: RegisterFormProps) => {
    const [formData, setFormData] = useState<RegisterFormData>({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });
    const [errors, setErrors] = useState<RegisterFormErrors>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name as keyof RegisterFormErrors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = (): RegisterFormErrors => {
        const newErrors: RegisterFormErrors = {};

        if (!formData.fullName) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
        }

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

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms';
        }

        return newErrors;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(formData);
    };

    return (
        <div className="register-form">
            <div className="register-form__header">
                <h1 className="register-form__title text-h4">
                    Create Admin Account
                </h1>
            </div>

            {error && (
                <div className="register-form__error-message">
                    <p className="text-body-4">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="register-form__form">
                <div className="register-form__row">
                    <InputField
                        label="Full Name"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={errors.fullName}
                        disabled={loading}
                    />

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
                </div>

                <div className="register-form__phone-wrapper">
                    <Label htmlFor="phoneNumber" required={false}>
                        Phone Number
                    </Label>
                    <div className="phone-input-wrapper">
                        <PhoneInput
                            defaultCountry="et"
                            value={formData.phoneNumber}
                            onChange={(phone) => {
                                setFormData(prev => ({ ...prev, phoneNumber: phone }));
                                if (errors.phoneNumber) {
                                    setErrors(prev => ({ ...prev, phoneNumber: '' }));
                                }
                            }}
                            disabled={loading}
                            placeholder="123 4567 890"
                            inputClassName="phone-input-field"
                            countrySelectorStyleProps={{
                                buttonClassName: 'phone-country-button'
                            }}
                        />
                    </div>
                    {errors.phoneNumber && (
                        <span className="register-form__error text-body-5">{errors.phoneNumber}</span>
                    )}
                </div>

                <div className="register-form__row">
                    <PasswordInput
                        label="Password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        disabled={loading}
                    />

                    <PasswordInput
                        label="Confirm Password"
                        name="confirmPassword"
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        disabled={loading}
                    />
                </div>

                <div className="register-form__checkbox-wrapper">
                    <label className="register-form__checkbox-label">
                        <input
                            type="checkbox"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            disabled={loading}
                            className="register-form__checkbox"
                        />
                        <span className="register-form__checkbox-text text-body-4 color-text-secondary">
                            * I agree to the Terms of Service and Privacy Policy.
                        </span>
                    </label>
                    {errors.agreeToTerms && (
                        <span className="register-form__error text-body-5">{errors.agreeToTerms}</span>
                    )}
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <div className="register-form__footer">
                    <p className="register-form__footer-text text-body-3">
                        Have an account? {' '}
                        <a
                            href="/login"
                            className="register-form__footer-link"
                        >
                            Sign In
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
