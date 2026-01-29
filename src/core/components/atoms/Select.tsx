/**
 * Select Atom Component
 * 
 * Reusable select dropdown component
 */

import './Select.css';

const Select = ({
  options = [],
  placeholder,
  value,
  onChange,
  name,
  disabled = false,
  error = false,
  ...props
}) => {
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

