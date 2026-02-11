import { ChangeEvent } from 'react';
import './InputField.css';
import Label from '../atoms/Label';
import Input from '../atoms/Input';

interface InputFieldProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

const InputField = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
  disabled = false
}: InputFieldProps) => {
  return (
    <div className="input-field">
      {label && (
        <Label htmlFor={name} required={required}>
          {label}
        </Label>
      )}
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={!!error}
        disabled={disabled}
      />
      {error && (
        <span className="input-field__error text-body-5">
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
