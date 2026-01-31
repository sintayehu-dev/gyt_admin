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

  advancedSearch: async (params: {
    title?: string;
    description?: string;
    language?: string;
    genre?: string;
    director?: string;
    star?: string;
    minDuration?: number;
    maxDuration?: number;
    page?: number;
    size?: number;
  } = {}): Promise<MoviesResponse> => {
    try {
      const client = httpService.client({ requireAuth: false });

      const queryParams = new URLSearchParams();
      if (params.title) queryParams.append('title', params.title);
      if (params.description) queryParams.append('description', params.description);
      if (params.language) queryParams.append('language', params.language);
      if (params.genre) queryParams.append('genre', params.genre);
      if (params.director) queryParams.append('director', params.director);
      if (params.star) queryParams.append('star', params.star);
      if (params.minDuration !== undefined) queryParams.append('minDuration', String(params.minDuration));
      if (params.maxDuration !== undefined) queryParams.append('maxDuration', String(params.maxDuration));
      if (params.page !== undefined) queryParams.append('page', String(params.page));
      if (params.size !== undefined) queryParams.append('size', String(params.size));

      const response = await client.get(`/movies/advanced-search?${queryParams.toString()}`);

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
      
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      
      // Add basic fields
      formData.append('title', movieData.title);
      formData.append('description', movieData.description);
      formData.append('durationMinutes', String(movieData.durationMinutes));
      formData.append('releaseDate', movieData.releaseDate);
      formData.append('language', movieData.language);
      
      // Add poster file or URL
      if (movieData.poster instanceof File) {
        formData.append('poster', movieData.poster);
      } else if (movieData.posterUrl) {
        formData.append('posterUrl', movieData.posterUrl);
      }
      
      // Add trailer URL
      if (movieData.trailerUrl) {
        formData.append('trailerUrl', movieData.trailerUrl);
      }
      
      // Add arrays - backend expects format like: genres=[uuid1, uuid2, uuid3]
      if (movieData.genres && movieData.genres.length > 0) {
        formData.append('genres', `[${movieData.genres.join(', ')}]`);
      }
      
      if (movieData.directors && movieData.directors.length > 0) {
        formData.append('directors', `[${movieData.directors.join(', ')}]`);
      }
      
      if (movieData.stars && movieData.stars.length > 0) {
        formData.append('stars', `[${movieData.stars.join(', ')}]`);
      }

      const response = await client.post('/admin/movies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
      
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      
      // Add basic fields
      formData.append('title', movieData.title);
      formData.append('description', movieData.description);
      formData.append('durationMinutes', String(movieData.durationMinutes));
      formData.append('releaseDate', movieData.releaseDate);
      formData.append('language', movieData.language);
      formData.append('isActive', String(movieData.isActive));
      
      // Add poster file or URL
      if (movieData.poster instanceof File) {
        formData.append('poster', movieData.poster);
      } else if (movieData.posterUrl) {
        formData.append('posterUrl', movieData.posterUrl);
      }
      
      // Add trailer URL
      if (movieData.trailerUrl) {
        formData.append('trailerUrl', movieData.trailerUrl);
      }
      
      // Add arrays - backend expects format like: genres=[uuid1, uuid2, uuid3]
      if (movieData.genres && movieData.genres.length > 0) {
        formData.append('genres', `[${movieData.genres.join(', ')}]`);
      }
      
      if (movieData.directors && movieData.directors.length > 0) {
        formData.append('directors', `[${movieData.directors.join(', ')}]`);
      }
      
      if (movieData.stars && movieData.stars.length > 0) {
        formData.append('stars', `[${movieData.stars.join(', ')}]`);
      }

      const response = await client.put(`/admin/movies/${uuid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
      const response = await client.delete(`/admin/movies/${uuid}`);

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
