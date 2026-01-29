import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Toast, { ToastType } from '../components/atoms/Toast';

interface ToastState {
    message: string;
    type: ToastType;
    isOpen: boolean;
}

interface ToastContextData {
    showToast: (message: string, type?: ToastType) => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextData | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToast] = useState<ToastState>({
        message: '',
        type: 'success',
        isOpen: false,
    });

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        setToast({
            message,
            type,
            isOpen: true,
        });
    }, []);

    const hideToast = useCallback(() => {
        setToast((prev) => ({ ...prev, isOpen: false }));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            {toast.isOpen && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
