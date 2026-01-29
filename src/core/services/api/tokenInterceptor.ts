import { tokenRefreshService } from './tokenRefreshService';
import { ROUTE_PATHS } from '../../routes/routeNames';

/**
 * Token Interceptor
 * Handles authentication token injection and automatic token refresh on 401 errors
 */
class TokenInterceptor {
  /**
   * Setup request and response interceptors on axios instance
   * @param {import('axios').AxiosInstance} axiosInstance
   * @param {boolean} requireAuth
   */
  setupInterceptors(axiosInstance, requireAuth) {
    // Request interceptor - Add auth token to requests
    axiosInstance.interceptors.request.use(
      async (config) => {
        const accessToken = tokenRefreshService.getAccessToken();

        if (requireAuth && accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle 401 errors and token refresh
    axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
          // Only handle 401s for requests that were sent with Authorization header
          const authHeader = originalRequest.headers?.Authorization;
          const sentWithBearer = authHeader && authHeader.startsWith('Bearer ');

          // If not a protected request, just pass the error through
          if (!requireAuth || !sentWithBearer) {
            return Promise.reject(error);
          }

          // Prevent infinite retry loops
          const alreadyRetried = originalRequest._retryAttempted === true;

          if (!alreadyRetried) {
            originalRequest._retryAttempted = true;

            try {
              // Attempt to refresh the token
              const newToken = await tokenRefreshService.refreshAccessToken();

              if (newToken) {
                // Update the authorization header with new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                // Retry the original request
                return axiosInstance(originalRequest);
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              // Fall through to logout
            }
          }

          // Refresh failed or second 401: clear session and redirect to login
          await tokenRefreshService.clearUserSession();
          this._redirectToLogin('Session expired. Please login again.');
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Redirect to login page with message
   * @private
   */
  _redirectToLogin(message) {
    // Check if we're already on the login page
    const currentPath = window.location.pathname;
    const isOnLoginScreen = currentPath === ROUTE_PATHS.LOGIN;

    if (!isOnLoginScreen) {
      // Show notification if you have a notification system
      if (window.showNotification) {
        window.showNotification(message, 'error');
      } else {
        console.warn(message);
      }

      // Redirect to login page
      window.location.href = ROUTE_PATHS.LOGIN;
    }
  }
}

// Export singleton instance
export const tokenInterceptor = new TokenInterceptor();
