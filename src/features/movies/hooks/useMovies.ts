import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moviesAPI } from '../api/movies.api';
import { MoviesListRequest } from '../api/movies.model';
import { useState, useCallback, useMemo } from 'react';
import { useToast } from '../../../core/context/ToastContext';

export const movieKeys = {
  all: ['movies'],
  lists: () => [...movieKeys.all, 'list'],
  list: (filters: any) => [...movieKeys.lists(), filters],
  details: () => [...movieKeys.all, 'detail'],
  detail: (id: string) => [...movieKeys.details(), id],
};

interface CreateMovieData {
  title: string;
  description: string;
  durationMinutes: number;
  releaseDate: string;
  posterUrl: string;
  trailerUrl: string;
  language: string;
  genres: string[];
  directors: string[];
  stars: string[];
}

interface UpdateMovieData extends CreateMovieData {
  isActive: boolean;
}

const useMovies = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [pagination, setPagination] = useState({
    page: MoviesListRequest.page,
    size: MoviesListRequest.size,
  });

  const [filters, setFilters] = useState({
    search: MoviesListRequest.search,
    genre: MoviesListRequest.genre,
    language: MoviesListRequest.language,
    isActive: MoviesListRequest.isActive,
  });

  const queryKey = useMemo(() => {
    return movieKeys.list({
      page: pagination.page,
      size: pagination.size,
      search: filters.search,
      genre: filters.genre,
      language: filters.language,
      isActive: filters.isActive,
    });
  }, [pagination.page, pagination.size, filters.search, filters.genre, filters.language, filters.isActive]);

  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await moviesAPI.getMovies({
        page: pagination.page,
        size: pagination.size,
        search: filters.search,
        genre: filters.genre,
        language: filters.language,
        isActive: filters.isActive,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch movies');
      }

      return {
        movies: result.data?.items || [],
        pagination: result.data?.pagination || {
          page: pagination.page,
          size: pagination.size,
          totalItems: 0,
          totalPages: 0,
        },
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMovieMutation = useMutation({
    mutationFn: async (movieData: CreateMovieData) => {
      console.log('[useMovies] Creating movie with data:', movieData);
      const result = await moviesAPI.createMovie(movieData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create movie');
      }

      console.log('[useMovies] Movie created successfully:', result.data);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
      showToast('Movie created successfully', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to create movie', 'error');
    },
  });

  const updateMovieMutation = useMutation({
    mutationFn: async ({ uuid, movieData }: { uuid: string; movieData: UpdateMovieData }) => {
      console.log('[useMovies] Updating movie:', uuid, 'with data:', movieData);
      const result = await moviesAPI.updateMovie(uuid, movieData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to update movie');
      }

      console.log('[useMovies] Movie updated successfully:', result.data);
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(movieKeys.detail(variables.uuid), data);
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
      showToast('Movie updated successfully', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to update movie', 'error');
    },
  });

  const deleteMovieMutation = useMutation({
    mutationFn: async (movieId: string) => {
      console.log('[useMovies] Deleting movie:', movieId);
      const result = await moviesAPI.deleteMovie(movieId);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete movie');
      }

      console.log('[useMovies] Movie deleted successfully');
      return result;
    },
    onSuccess: (_result, movieId) => {
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
      queryClient.removeQueries({ queryKey: movieKeys.detail(movieId) });
      showToast('Movie deleted successfully', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to delete movie', 'error');
    },
  });

  const updateSearch = useCallback((searchValue: string) => {
    setFilters(prev => ({ ...prev, search: searchValue }));
    setPagination(prev => ({ ...prev, page: 0 }));
  }, []);

  const updatePage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page: page - 1 }));
  }, []);

  const updatePageSize = useCallback((size: number) => {
    setPagination(prev => ({ ...prev, size, page: 0 }));
  }, []);

  const createMovie = useCallback(async (movieData: CreateMovieData) => {
    try {
      const data = await createMovieMutation.mutateAsync(movieData);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }, [createMovieMutation]);

  const updateMovie = useCallback(async (uuid: string, movieData: UpdateMovieData) => {
    try {
      const data = await updateMovieMutation.mutateAsync({ uuid, movieData });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }, [updateMovieMutation]);

  const deleteMovie = useCallback(async (movieId: string) => {
    try {
      const result = await deleteMovieMutation.mutateAsync(movieId);
      return { success: true, message: result.message };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }, [deleteMovieMutation]);

  return {
    movies: queryData?.movies || [],
    isLoading,
    error: error ? (error as Error).message : null,
    pagination: queryData?.pagination || null,
    filters,
    updateSearch,
    updatePage,
    updatePageSize,
    refetch,
    createMovie,
    updateMovie,
    deleteMovie,
    isCreating: createMovieMutation.isPending,
    isUpdating: updateMovieMutation.isPending,
    isDeleting: deleteMovieMutation.isPending,
  };
};

export default useMovies;
