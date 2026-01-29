/**
 * PasswordInput Molecule Component
 * 
 * Password input with show/hide toggle
 */

import { useState } from 'react';
import './PasswordInput.css';
import Label from '../atoms/Label';
import Input from '../atoms/Input';

const PasswordInput = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  disabled = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-input">
      {label && (
        <Label htmlFor={name} required={required}>
          {label}
        </Label>
      )}
      <div className="password-input__wrapper">
        <Input
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          error={!!error}
          disabled={disabled}
        />
        <button
          type="button"
          className="password-input__toggle"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <span className="password-input__error text-body-5">
          {error}
        </span>
      )}
    </div>
  );
};

export default PasswordInput;
