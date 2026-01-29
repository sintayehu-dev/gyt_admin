/**
 * Logo Atom Component
 * 
 * Application logo component
 */

import './Logo.css';
import nestLogo from '../../assets/image/NEST.svg';

const Logo = ({ size = 'small' }) => {
  const sizeClass = `logo--${size}`;

  return (
    <div className="logo">
      <img
        src={nestLogo}
        alt="NEST"
        className={`logo__image ${sizeClass}`}
      />
    </div>
  );
};

export default Logo;
