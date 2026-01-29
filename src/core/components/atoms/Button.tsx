/**
 * Button Atom Component
 * 
 * Reusable button component with different variants using external CSS
 */

import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  fullWidth = false,
  disabled = false,
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant} text-body-4 ${fullWidth ? 'btn--full-width' : ''}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
