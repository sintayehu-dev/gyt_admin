import { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenRefreshService } from './tokenRefreshService';
import { ROUTE_PATHS } from '../../routes/routeNames';

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retryAttempted?: boolean;
}

class TokenInterceptor {
  setupInterceptors(axiosInstance: AxiosInstance, requireAuth: boolean): void {
    axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const accessToken = tokenRefreshService.getAccessToken();

        if (requireAuth && accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;

        if (error.response?.status === 401 && originalRequest) {
          const authHeader = originalRequest.headers?.Authorization;
          const sentWithBearer = authHeader && String(authHeader).startsWith('Bearer ');

          if (!requireAuth || !sentWithBearer) {
            return Promise.reject(error);
          }

          const alreadyRetried = originalRequest._retryAttempted === true;

          if (!alreadyRetried) {
            originalRequest._retryAttempted = true;

            try {
              const newToken = await tokenRefreshService.refreshAccessToken();

              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
            }
          }

          await tokenRefreshService.clearUserSession();
          this._redirectToLogin('Session expired. Please login again.');
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );
  }

  private _redirectToLogin(message: string): void {
    const currentPath = window.location.pathname;
    const isOnLoginScreen = currentPath === ROUTE_PATHS.LOGIN;

    if (!isOnLoginScreen) {
      if ((window as any).showNotification) {
        (window as any).showNotification(message, 'error');
      } else {
        console.warn(message);
      }

      window.location.href = ROUTE_PATHS.LOGIN;
    }
  }
}

export const tokenInterceptor = new TokenInterceptor();
