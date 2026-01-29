import { httpService } from '../../../core/services/api/httpService';
import { NetworkExceptions } from '../../../core/services/api/networkExceptions';
import { transformMoviesListResponse, MoviesListDTO, transformMovie } from './movies.dto';

interface MoviesListParams {
  page?: number;
  size?: number;
  search?: string;
  genre?: string;
  language?: string;
  isActive?: boolean;
}

interface MoviesSuccessResponse {
  success: true;
  data: MoviesListDTO;
}

interface MoviesErrorResponse {
  success: false;
  error: string;
  exception?: any;
}

export type MoviesResponse = MoviesSuccessResponse | MoviesErrorResponse;

export const moviesAPI = {
  getMovies: async (params: MoviesListParams = {}): Promise<MoviesResponse> => {
    try {
      const client = httpService.client({ requireAuth: false });

      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', String(params.page));
      if (params.size !== undefined) queryParams.append('size', String(params.size));
      if (params.search) queryParams.append('search', params.search);
      if (params.genre) queryParams.append('genre', params.genre);
      if (params.language) queryParams.append('language', params.language);
      if (params.isActive !== undefined) queryParams.append('isActive', String(params.isActive));

      const response = await client.get(`/movies?${queryParams.toString()}`);

      const transformedData = transformMoviesListResponse(response.data);

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

  getMovieById: async (uuid: string): Promise<any> => {
    try {
      const client = httpService.client({ requireAuth: false });
      const response = await client.get(`/movies/${uuid}`);

      return {
        success: true,
        data: transformMovie(response.data.data)
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

  createMovie: async (movieData: any): Promise<any> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.post('/movies', movieData);

      return {
        success: true,
        data: transformMovie(response.data.data)
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

  updateMovie: async (uuid: string, movieData: any): Promise<any> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.put(`/movies/${uuid}`, movieData);

      return {
        success: true,
        data: transformMovie(response.data.data)
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

  deleteMovie: async (uuid: string): Promise<any> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.delete(`/movies/${uuid}`);

      return {
        success: true,
        data: response.data
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
