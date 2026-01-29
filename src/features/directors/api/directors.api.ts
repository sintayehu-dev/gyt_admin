import { httpService } from '../../../core/services/api/httpService';
import { NetworkExceptions } from '../../../core/services/api/networkExceptions';
import { transformDirectorsListResponse, transformDirector, DirectorsListDTO, DirectorDTO } from './directors.dto';

interface DirectorsListParams {
  page?: number;
  size?: number;
  search?: string;
}

export const directorsAPI = {
  getDirectors: async (params: DirectorsListParams = {}) => {
    try {
      const client = httpService.client({ requireAuth: true });
      
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', String(params.page));
      if (params.size !== undefined) queryParams.append('size', String(params.size));
      if (params.search) queryParams.append('search', params.search);

      const response = await client.get(`/movies/directors?${queryParams.toString()}`);
      const transformedData = transformDirectorsListResponse(response.data);

      return { success: true, data: transformedData };
    } catch (error) {
      return {
        success: false,
        error: NetworkExceptions.getRawErrorMessage(error),
        exception: NetworkExceptions.getException(error)
      };
    }
  },

  getDirectorById: async (uuid: string): Promise<{ success: true; data: DirectorDTO } | { success: false; error: string }> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.get(`/movies/directors/${uuid}`);
      const transformedData = transformDirector(response.data.data);

      return { success: true, data: transformedData };
    } catch (error) {
      return {
        success: false,
        error: NetworkExceptions.getRawErrorMessage(error),
      };
    }
  },

  createDirector: async (directorData: any): Promise<{ success: true; data: DirectorDTO } | { success: false; error: string }> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.post('/admin/movies/directors', directorData);
      const transformedData = transformDirector(response.data.data);
      
      return { success: true, data: transformedData };
    } catch (error) {
      return {
        success: false,
        error: NetworkExceptions.getRawErrorMessage(error),
      };
    }
  },

  updateDirector: async (uuid: string, directorData: any): Promise<{ success: true; data: DirectorDTO } | { success: false; error: string }> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.patch(`/admin/movies/directors/${uuid}`, directorData);
      const transformedData = transformDirector(response.data.data);
      
      return { success: true, data: transformedData };
    } catch (error) {
      return {
        success: false,
        error: NetworkExceptions.getRawErrorMessage(error),
      };
    }
  },

  deleteDirector: async (uuid: string): Promise<{ success: true; message: string } | { success: false; error: string }> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.delete(`/admin/movies/directors/${uuid}`);
      
      return {
        success: true,
        message: response.data.message || 'Director deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: NetworkExceptions.getRawErrorMessage(error),
      };
    }
  }
};
