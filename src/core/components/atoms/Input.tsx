/**
 * Input Atom Component
 * 
 * Reusable input field component with external CSS
 */

import './Input.css';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  disabled = false,
  error = false,
  ...props
}) => {
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
