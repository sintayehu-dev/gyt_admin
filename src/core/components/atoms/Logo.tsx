

import './Logo.css';
import cinemaLogo from '../../assets/image/cinema.png';

const Logo = ({ size = 'small' }) => {
  const sizeClass = `logo--${size}`;

  return (
    <div className="logo">
      <img
        src={cinemaLogo}
        alt="NEST"
        className={`logo__image ${sizeClass}`}
      />
    </div>
  );
};

export default Logo;
