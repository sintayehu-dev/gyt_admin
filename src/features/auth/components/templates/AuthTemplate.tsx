import './AuthTemplate.css';
import Logo from '../../../../core/components/atoms/Logo';

const AuthTemplate = ({ children }) => {
  return (
    <div className="auth-template-container">
      <div className="auth-template-main">
        <div className="auth-template-form">
          <div className="auth-template-form__content">
            <div className="auth-template-logo">
              <Logo size="medium" />
            </div>
            {children}
          </div>
        </div>

        <div className="auth-template-bg-pattern">
          <div className="auth-template-car-image"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthTemplate;
