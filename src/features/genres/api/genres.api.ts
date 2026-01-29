import { httpService } from '../../../core/services/api/httpService';
import { NetworkExceptions } from '../../../core/services/api/networkExceptions';
import { transformGenresListResponse, transformGenre, GenresListDTO, GenreDTO } from './genres.dto';

interface GenresListParams {
  page?: number;
  size?: number;
  search?: string;
}

interface GenresSuccessResponse {
  success: true;
  data: GenresListDTO;
}

interface GenresErrorResponse {
  success: false;
  error: string;
  exception?: any;
}

export type GenresResponse = GenresSuccessResponse | GenresErrorResponse;

export const genresAPI = {
  getGenres: async (params: GenresListParams = {}): Promise<GenresResponse> => {
    try {
      const client = httpService.client({ requireAuth: true });
      
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', String(params.page));
      if (params.size !== undefined) queryParams.append('size', String(params.size));
      if (params.search) queryParams.append('search', params.search);

      const response = await client.get(`/movies/genres?${queryParams.toString()}`);
      
      const transformedData = transformGenresListResponse(response.data);

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
  },

  getGenreById: async (uuid: string): Promise<{ success: true; data: GenreDTO } | { success: false; error: string; exception?: any }> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.get(`/movies/genres/${uuid}`);
      
      const transformedData = transformGenre(response.data.data);

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
  },

  createGenre: async (genreData: any): Promise<{ success: true; data: GenreDTO } | { success: false; error: string; exception?: any }> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.post('/admin/movies/genres', genreData);
      
      const transformedData = transformGenre(response.data.data);
      
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
  },

  updateGenre: async (uuid: string, genreData: any): Promise<{ success: true; data: GenreDTO } | { success: false; error: string; exception?: any }> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.patch(`/admin/movies/genres/${uuid}`, genreData);
      
      const transformedData = transformGenre(response.data.data);
      
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
  },

  deleteGenre: async (uuid: string): Promise<{ success: true; message: string } | { success: false; error: string; exception?: any }> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.delete(`/admin/movies/genres/${uuid}`);
      
      return {
        success: true,
        message: response.data.message || 'Genre deleted successfully'
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
