import { ChangeEvent, SelectHTMLAttributes } from 'react';
import './Select.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options?: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  disabled?: boolean;
  error?: boolean;
}

const Select = ({
  options = [],
  placeholder,
  value,
  onChange,
  name,
  disabled = false,
  error = false,
  ...props
}: SelectProps) => {
  return (
    <select
      className={`select text-body-4 ${error ? 'select--error' : ''}`}
      value={value}
      onChange={onChange}
      name={name}
      disabled={disabled}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;

