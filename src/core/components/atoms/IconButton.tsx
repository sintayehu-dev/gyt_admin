import './IconButton.css';

const IconButton = ({ 
  icon, 
  onClick, 
  variant = 'default',
  label,
  disabled = false 
}) => {
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

