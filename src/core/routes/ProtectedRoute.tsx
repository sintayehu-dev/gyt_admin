import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth';
import { ROUTE_PATHS } from './routeNames';

const ProtectedRoute = ({ children, requireAuth = true }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (!requireAuth) {
        return children;
    }

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
    }

    return children;
};

export default ProtectedRoute;

