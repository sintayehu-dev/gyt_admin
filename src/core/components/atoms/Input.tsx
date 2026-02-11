import { ChangeEvent, InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  disabled?: boolean;
  error?: boolean;
}

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  disabled = false,
  error = false,
  ...props
}: InputProps) => {
  return (
    <input
      type={type}
      className={`input text-body-4 ${error ? 'input--error' : ''}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      disabled={disabled}
      {...props}
    />
  );
};

export default Input;
