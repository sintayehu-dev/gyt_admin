/**
 * Toast Atom Component
 * 
 * Notification toast component
 */

import { useEffect } from 'react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    onClose: () => void;
    duration?: number;
}

const Toast = ({ message, type = 'success', onClose, duration = 3000 }: ToastProps) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'error':
                return (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M18 6L6 18M6 6L18 18"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                );
            case 'info':
                return (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path d="M12 16V12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        <path d="M12 8H12.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                );
            case 'success':
            default:
                return (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M5 13L9 17L19 7"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                );
        }
    };

    return (
        <div className={`toast toast--${type}`}>
            <div className="toast__icon">{getIcon()}</div>
            <div className="toast__message text-body-4">{message}</div>
            <button className="toast__close" onClick={onClose} aria-label="Close notification">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </button>
        </div>
    );
};

export default Toast;
