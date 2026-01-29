import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moviesAPI } from '../api/movies.api';
import { MoviesListRequest } from '../api/movies.model';
import { useState, useCallback, useMemo } from 'react';

export const movieKeys = {
  all: ['movies'],
  lists: () => [...movieKeys.all, 'list'],
  list: (filters: any) => [...movieKeys.lists(), filters],
  details: () => [...movieKeys.all, 'detail'],
  detail: (id: string) => [...movieKeys.details(), id],
};

const useMovies = () => {
  const queryClient = useQueryClient();

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

  const deleteMovieMutation = useMutation({
    mutationFn: async (movieId: string) => {
      const result = await moviesAPI.deleteMovie(movieId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete movie');
      }
      return result;
    },
    onSuccess: (_result, movieId) => {
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
      queryClient.removeQueries({ queryKey: movieKeys.detail(movieId) });
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
    deleteMovie,
  };
};

export default useMovies;
