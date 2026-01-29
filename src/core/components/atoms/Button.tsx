/**
 * Button Atom Component
 * 
 * Reusable button component with different variants using external CSS
 */

import { ReactNode, MouseEvent } from 'react';
import './Button.css';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  fullWidth = false,
  disabled = false,
  onClick,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant} text-body-4 ${fullWidth ? 'btn--full-width' : ''} ${className || ''}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
