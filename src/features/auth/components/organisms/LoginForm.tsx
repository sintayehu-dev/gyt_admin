import { useState, ChangeEvent, FormEvent } from 'react';
import './LoginForm.css';
import Button from '../../../../core/components/atoms/Button';
import InputField from '../../../../core/components/molecules/InputField';
import PasswordInput from '../../../../core/components/molecules/PasswordInput';

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string; rememberMe: boolean }) => void;
  onGoogleLogin?: () => void;
  loading?: boolean;
  error?: string | null;
}

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginForm = ({ onSubmit, onGoogleLogin, loading = false, error = null }: LoginFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('Login form submitted with data:', formData);

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      console.log('Validation errors:', newErrors);
      setErrors(newErrors);
      return;
    }

    console.log('Calling onSubmit with:', formData);
    onSubmit(formData);
  };

  return (
    <div className="login-form">
      <div className="login-form__header">
        <h1 className="login-form__title">
          Admin Portal
        </h1>
        <p className="login-form__subtitle">
          Welcome back. Please enter your details.
        </p>
      </div>

      {error && (
        <div className="login-form__error">
          <p className="text-body-4">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form__form">
        <InputField
          label="Username/Email"
          name="email"
          type="email"
          placeholder="admin@theater.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={loading}
        />

        <div className="login-form__password-wrapper">
          <PasswordInput
            label="Password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={loading}
          />
          <a
            href="/reset-password"
            className="login-form__forgot-link"
          >
            Forgot?
          </a>
        </div>

        <div className="login-form__remember">
          <label className="login-form__checkbox-label">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="login-form__checkbox"
            />
            <span className="login-form__checkbox-text">Remember me</span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in →'}
        </Button>
      </form>

      <div className="login-form__footer">
        <p className="login-form__footer-text">
          Need help? <a href="/support" className="login-form__footer-link">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
