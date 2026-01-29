import axios from 'axios';
import { tokenInterceptor } from './tokenInterceptor';
import env from '../../config/env';

class HttpService {
  client({ requireAuth = false, isMultipart = false } = {}) {
    const baseURL = env.apiUrl;

    const axiosInstance = axios.create({
      baseURL,
      timeout: 60000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
      },
    });

    if (requireAuth) {
      tokenInterceptor.setupInterceptors(axiosInstance, requireAuth);
    }

    if (import.meta.env.DEV) {
      this._addLoggingInterceptor(axiosInstance);
    }

    return axiosInstance;
  }

  _addLoggingInterceptor(axiosInstance) {
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
