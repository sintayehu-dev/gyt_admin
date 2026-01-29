import { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAuth?: boolean;
}

const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
    // For now, just render children without authentication check
    // This is UI-only mode, no auth integration
    return <>{children}</>;
};

export default ProtectedRoute;

