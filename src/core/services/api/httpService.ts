import axios, { AxiosInstance } from 'axios';
import { tokenInterceptor } from './tokenInterceptor';
import env from '../../config/env';

interface ClientOptions {
  requireAuth?: boolean;
  isMultipart?: boolean;
}

class HttpService {
  client({ requireAuth = false, isMultipart = false }: ClientOptions = {}): AxiosInstance {
    const baseURL = env.apiUrl;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
    };

    if (baseURL.includes('ngrok')) {
      headers['ngrok-skip-browser-warning'] = 'true';
    }

    const axiosInstance = axios.create({
      baseURL,
      timeout: 60000,
      headers,
      withCredentials: false,
    });

    if (requireAuth) {
      tokenInterceptor.setupInterceptors(axiosInstance, requireAuth);
    }

    if (import.meta.env.DEV) {
      this._addLoggingInterceptor(axiosInstance);
    }

    return axiosInstance;
  }

  private _addLoggingInterceptor(axiosInstance: AxiosInstance): void {
    axiosInstance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
}

export const httpService = new HttpService();
