import { ReactNode } from 'react';
import './IconButton.css';

interface IconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'view' | 'edit' | 'delete';
  label: string;
  disabled?: boolean;
}

const IconButton = ({ 
  icon, 
  onClick, 
  variant = 'default',
  label,
  disabled = false 
}: IconButtonProps) => {
  return (
    <button
      className={`icon-button icon-button--${variant}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
};

export default IconButton;

