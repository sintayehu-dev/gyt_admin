import { httpService } from '../../../core/services/api/httpService';
import { NetworkExceptions } from '../../../core/services/api/networkExceptions';

export const authAPI = {
  login: async (credentials) => {
    try {
      const client = httpService.client({ requireAuth: false });
      const response = await client.post('/auth/login', credentials);
      const { data } = response.data;

      return {
        success: true,
        data: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        }
      };
    } catch (error) {
      const networkException = NetworkExceptions.getException(error);
      const errorMessage = NetworkExceptions.getRawErrorMessage(error);
      return {
        success: false,
        error: errorMessage,
        exception: networkException
      };
    }
  },

  register: async (userData) => {
    try {
      const client = httpService.client({ requireAuth: false });

      // Transform userData to match API requirements
      const payload = {
        phone_number: userData.phoneNumber,
        email: userData.email,
        first_name: userData.fullName.split(' ')[0], // Extract first name
        last_name: userData.fullName.split(' ').slice(1).join(' ') || userData.fullName.split(' ')[0], // Extract last name or use first name if no last name
        password: userData.password
      };

      const response = await client.post('/admins/send/otp', payload);
      const { data } = response.data;

      return {
        success: true,
        data: {
          message: data.message,
          email: userData.email
        },
        message: response.data.message
      };
    } catch (error) {
      const networkException = NetworkExceptions.getException(error);
      const errorMessage = NetworkExceptions.getRawErrorMessage(error);
      return {
        success: false,
        error: errorMessage,
        exception: networkException
      };
    }
  },

  verifyOTP: async (email, otp) => {
    try {
      const client = httpService.client({ requireAuth: false });
      const response = await client.post('/admins/verify/otp', {
        email,
        otp
      });
      const { data } = response.data;

      return {
        success: true,
        data: data,
        message: response.data.message
      };
    } catch (error) {
      const networkException = NetworkExceptions.getException(error);
      const errorMessage = NetworkExceptions.getRawErrorMessage(error);
      return {
        success: false,
        error: errorMessage,
        exception: networkException
      };
    }
  },

  getProfile: async () => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.get('/auth/profile');
      return { success: true, data: response.data };
    } catch (error) {
      const networkException = NetworkExceptions.getException(error);
      const errorMessage = NetworkExceptions.getRawErrorMessage(error);
      return {
        success: false,
        error: errorMessage,
        exception: networkException
      };
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const client = httpService.client({ requireAuth: false });
      const response = await client.post('/auth/refresh', { refresh_token: refreshToken });
      return { success: true, data: response.data };
    } catch (error) {
      const networkException = NetworkExceptions.getException(error);
      const errorMessage = NetworkExceptions.getRawErrorMessage(error);
      return {
        success: false,
        error: errorMessage,
        exception: networkException
      };
    }
  },

  forgotPassword: async (email) => {
    try {
      const client = httpService.client({ requireAuth: false });
      const response = await client.post('/admins/send/forgot-password', { email });

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      const networkException = NetworkExceptions.getException(error);
      const errorMessage = NetworkExceptions.getRawErrorMessage(error);
      return {
        success: false,
        error: errorMessage,
        exception: networkException
      };
    }
  },

  resetPassword: async (token, userId, newPassword) => {
    try {
      const client = httpService.client({ requireAuth: false });
      const response = await client.post('/admins/reset-password', {
        token,
        userId,
        newPassword
      });

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      const networkException = NetworkExceptions.getException(error);
      const errorMessage = NetworkExceptions.getRawErrorMessage(error);
      return {
        success: false,
        error: errorMessage,
        exception: networkException
      };
    }
  },
};
