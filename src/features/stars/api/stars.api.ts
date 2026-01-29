import { httpService } from '../../../core/services/api/httpService';
import { NetworkExceptions } from '../../../core/services/api/networkExceptions';
import { transformStarsListResponse, transformStar, StarsListDTO, StarDTO } from './stars.dto';

interface StarsListParams {
  page?: number;
  size?: number;
  search?: string;
}

export const starsAPI = {
  getStars: async (params: StarsListParams = {}) => {
    try {
      const client = httpService.client({ requireAuth: true });
      
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', String(params.page));
      if (params.size !== undefined) queryParams.append('size', String(params.size));
      if (params.search) queryParams.append('search', params.search);

      const response = await client.get(`/movies/stars?${queryParams.toString()}`);
      const transformedData = transformStarsListResponse(response.data);

      return { success: true, data: transformedData };
    } catch (error) {
      return {
        success: false,
        error: NetworkExceptions.getRawErrorMessage(error),
        exception: NetworkExceptions.getException(error)
      };
    }
  },

  getStarById: async (uuid: string): Promise<{ success: true; data: StarDTO } | { success: false; error: string }> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.get(`/movies/stars/${uuid}`);
      const transformedData = transformStar(response.data.data);

      return { success: true, data: transformedData };
    } catch (error) {
      return {
        success: false,
        error: NetworkExceptions.getRawErrorMessage(error),
      };
    }
  },

  createStar: async (starData: any): Promise<{ success: true; data: StarDTO } | { success: false; error: string }> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.post('/admin/movies/stars', starData);
      const transformedData = transformStar(response.data.data);
      
      return { success: true, data: transformedData };
    } catch (error) {
      return {
        success: false,
        error: NetworkExceptions.getRawErrorMessage(error),
      };
    }
  },

  updateStar: async (uuid: string, starData: any): Promise<{ success: true; data: StarDTO } | { success: false; error: string }> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.patch(`/admin/movies/stars/${uuid}`, starData);
      const transformedData = transformStar(response.data.data);
      
      return { success: true, data: transformedData };
    } catch (error) {
      return {
        success: false,
        error: NetworkExceptions.getRawErrorMessage(error),
      };
    }
  },

  deleteStar: async (uuid: string): Promise<{ success: true; message: string } | { success: false; error: string }> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.delete(`/admin/movies/stars/${uuid}`);
      
      return {
        success: true,
        message: response.data.message || 'Star deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: NetworkExceptions.getRawErrorMessage(error),
      };
    }
  }
};
