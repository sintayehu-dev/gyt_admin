import { httpService } from '../../../core/services/api/httpService';
import { NetworkExceptions } from '../../../core/services/api/networkExceptions';
import { transformLoginResponse, LoginResponseDTO } from './auth.dto';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthSuccessResponse {
  success: true;
  data: LoginResponseDTO;
}

interface AuthErrorResponse {
  success: false;
  error: string;
  exception?: any;
}

export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const client = httpService.client({ requireAuth: false });
      const response = await client.post('/auth/login', credentials);
      
      const transformedData = transformLoginResponse(response.data);

      return {
        success: true,
        data: transformedData
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
  }
};
