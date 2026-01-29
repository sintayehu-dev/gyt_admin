import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../features/auth/context/AuthContext';
import { ROUTE_PATHS } from './routeNames';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAuth?: boolean;
}

const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
    const { isAuthenticated } = useAuthContext();

    if (requireAuth && !isAuthenticated) {
        return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;

