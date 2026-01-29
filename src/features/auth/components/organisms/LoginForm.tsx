import { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginForm.css';
import Button from '../../../../core/components/atoms/Button';
import InputField from '../../../../core/components/molecules/InputField';
import PasswordInput from '../../../../core/components/molecules/PasswordInput';
import { ROUTE_PATHS } from '../../../../core/routes/routeNames';

const LoginForm = ({ onSubmit, onGoogleLogin, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
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

    if (!formData.password) {
      newErrors.password = 'Password is required';
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

  return (
    <div className="login-form">
      <div className="login-form__header">
        <h1 className="login-form__title text-h4">
          Welcome back to Nest Admin
        </h1>
      </div>

      {error && (
        <div className="login-form__error">
          <p className="text-body-4">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form__form">
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

        <PasswordInput
          label="Password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          disabled={loading}
        />

        <div className="login-form__forgot">
          <a
            href="/reset-password"
            className="login-form__forgot-link text-body-4"
          >
            Forgot Password?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <div className="login-form__separator">
        <span className="login-form__separator-line"></span>
        <span className="login-form__separator-text text-body-4">or</span>
        <span className="login-form__separator-line"></span>
      </div>

      <Button
        type="button"
        variant="secondary"
        fullWidth
        onClick={onGoogleLogin}
        disabled={loading}
        className="login-form__google-btn"
      >
        <svg className="login-form__google-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        <span className="text-body-4">Login with Google</span>
      </Button>

      <div className="login-form__footer">
        <p className="login-form__footer-text text-body-3">
          Don't have an account? {' '}
          <Link to={ROUTE_PATHS.REGISTER} className="login-form__footer-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
