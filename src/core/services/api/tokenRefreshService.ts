import axios from 'axios';
import env from '../../config/env';

class TokenRefreshService {
  constructor() {
    this._isRefreshing = false;
    this._refreshSubscribers = [];

    this._axiosClient = axios.create({
      baseURL: env.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async refreshAccessToken() {
    if (this._isRefreshing) {
      return new Promise((resolve) => {
        this._refreshSubscribers.push((token) => {
          resolve(token);
        });
      });
    }

    this._isRefreshing = true;

    try {
      const refreshToken = this.getRefreshToken();

      if (!refreshToken) {
        console.log('No refresh token available');
        this._isRefreshing = false;
        this._onRefreshFinished(null);
        return null;
      }

      console.log('Attempting to refresh access token...');

      const response = await this._axiosClient.post('/auth/refresh', {
        refresh_token: refreshToken,
      });

      if (response.status === 200 && response.data) {
        const { access_token, refresh_token, user } = response.data;

        this.setAccessToken(access_token);
        this.setRefreshToken(refresh_token);

        if (user) {
          this.setUserData(user);
        }

        console.log('Token refreshed successfully');
        this._isRefreshing = false;
        this._onRefreshFinished(access_token);
        return access_token;
      } else {
        console.log('Token refresh failed with status:', response.status);
        this._isRefreshing = false;
        this._onRefreshFinished(null);
        return null;
      }
    } catch (error) {
      console.error('Token refresh error:', error.message);

      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Refresh token is invalid, clearing user session');
        await this.clearUserSession();
      }

      this._isRefreshing = false;
      this._onRefreshFinished(null);
      return null;
    }
  }

  _onRefreshFinished(token) {
    this._refreshSubscribers.forEach((callback) => callback(token));
    this._refreshSubscribers = [];
  }

  isAccessTokenExpired() {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const payload = this._decodeJWT(token);
      if (payload && payload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp - 60 < currentTime;
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
    }

    return false;
  }

  _decodeJWT(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  async getValidAccessToken() {
    const currentToken = this.getAccessToken();

    if (!currentToken) {
      console.log('No access token available');
      return null;
    }

    if (this.isAccessTokenExpired()) {
      console.log('Access token is expired, refreshing...');
      return await this.refreshAccessToken();
    }

    return currentToken;
  }

  async clearUserSession() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    console.log('All tokens cleared');
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  setAccessToken(token) {
    localStorage.setItem('accessToken', token);
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  setRefreshToken(token) {
    localStorage.setItem('refreshToken', token);
  }

  getUserData() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  setUserData(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export const tokenRefreshService = new TokenRefreshService();
