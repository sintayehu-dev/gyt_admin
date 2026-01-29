import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage, ResetPasswordPage, CheckEmailPage, SetNewPasswordPage, VerifyOTPPage } from '../../features/auth';
import { DashboardPage } from '../../features/dashboard';
import RiderManagementPage from '../../features/users/pages/RiderManagementPage';
import ParentManagementPage from '../../features/users/pages/ParentManagementPage';
import AdminManagementPage from '../../features/users/pages/AdminManagementPage';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import { ROUTE_PATHS } from './routeNames';

// Error component for invalid routes
const ErrorPage = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/login" style={{ color: '#646cff', textDecoration: 'underline' }}>
        Go to Login
      </a>
    </div>
  );
};

/**
 * Application Router Configuration
 * 
 * This router uses feature-based imports to maintain loose coupling between
 * the routing layer and feature implementations. Each route imports page
 * components from feature public APIs (index.js files) rather than directly
 * from internal feature files.
 * 
 * Route Structure:
 * - / (ROOT): Redirects to login page
 * - /login (LOGIN): User authentication page (landing page)
 * - /dashboard (DASHBOARD): Main dashboard after authentication
 * - * (catch-all): 404 error page for invalid routes
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTE_PATHS.LOGIN} replace />,
  },
  {
    path: ROUTE_PATHS.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTE_PATHS.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTE_PATHS.VERIFY_OTP,
    element: <VerifyOTPPage />,
  },
  {
    path: ROUTE_PATHS.RESET_PASSWORD,
    element: <ResetPasswordPage />,
  },
  {
    path: ROUTE_PATHS.CHECK_EMAIL,
    element: <CheckEmailPage />,
  },
  {
    path: ROUTE_PATHS.SET_NEW_PASSWORD,
    element: <SetNewPasswordPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTE_PATHS.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: '/users/rider',
        element: <RiderManagementPage />,
      },
      {
        path: '/users/parent',
        element: <ParentManagementPage />,
      },
      {
        path: '/users/admin',
        element: <AdminManagementPage />,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

export default router;
