import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage, ResetPasswordPage, CheckEmailPage, SetNewPasswordPage, VerifyOTPPage } from '../../features/auth';
import { DashboardPage } from '../../features/dashboard';
import { MoviesPage } from '../../features/movies';
import MovieDetailPage from '../../features/movies/pages/MovieDetailPage';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import { ROUTE_PATHS } from './routeNames';

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
        path: ROUTE_PATHS.MOVIES,
        element: <MoviesPage />,
      },
      {
        path: ROUTE_PATHS.MOVIE_DETAIL,
        element: <MovieDetailPage />,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

export default router;
