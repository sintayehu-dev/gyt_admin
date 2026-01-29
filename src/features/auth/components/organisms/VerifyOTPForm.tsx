import Button from '../../../../core/components/atoms/Button';
import { useState, useRef } from 'react';
import './VerifyOTPForm.css';

const VerifyOTPForm = ({ onSubmit, onResend, loading = false, email = '', error: externalError = null }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        onSubmit(otpValue);
    };

    const handleResend = () => {
        setOtp(['', '', '', '', '', '']);
        setError('');
        onResend();
    };

    return (
        <div className="verify-otp-form">
            <div className="verify-otp-form__header">
                <h1 className="verify-otp-form__title text-h5">Verify email address</h1>
                <p className="verify-otp-form__description text-body-4">
                    Click the link sent to the email address {email && `[${email}]`}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="verify-otp-form__form">
                <div className="verify-otp-form__inputs">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="verify-otp-form__input text-h5"
                            disabled={loading}
                        />
                    ))}
                </div>

                {(error || externalError) && (
                    <span className="verify-otp-form__error text-body-5">
                        {externalError || error}
                    </span>
                )}

                <div className="verify-otp-form__resend">
                    <span className="verify-otp-form__resend-text text-body-4">
                        Didn't get a code?{' '}
                        <button
                            type="button"
                            onClick={handleResend}
                            className="verify-otp-form__resend-link"
                            disabled={loading}
                        >
                            Resend in 00:45
                        </button>
                    </span>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Verifying...' : 'Create Account'}
                </Button>
            </form>
        </div>
    );
};

export default VerifyOTPForm;
