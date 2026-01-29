import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moviesAPI } from '../api/movies.api';
import { movieKeys } from './useMovies';
import { MovieDTO } from '../api/movies.dto';

const useMovieDetail = (uuid?: string) => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: movieKeys.detail(uuid || ''),
    queryFn: async () => {
      console.log('[Hook] Fetching movie with uuid:', uuid);
      
      if (!uuid) {
        throw new Error('Movie ID is required');
      }

      const result = await moviesAPI.getMovieById(uuid);
      
      console.log('[Hook] API result:', result);

      if (!result.success) {
        console.error('[Hook] API failed:', result.error);
        throw new Error(result.error || 'Failed to fetch movie');
      }

      console.log('[Hook] Returning movie data:', result.data);
      return result.data;
    },
    enabled: !!uuid,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  console.log('[Hook] Current state - data:', data, 'isLoading:', isLoading, 'error:', error);

  const createMovieMutation = useMutation({
    mutationFn: async (movieData: any) => {
      const result = await moviesAPI.createMovie(movieData);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create movie');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
    },
  });

  const updateMovieMutation = useMutation({
    mutationFn: async ({ uuid, movieData }: { uuid: string; movieData: any }) => {
      const result = await moviesAPI.updateMovie(uuid, movieData);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update movie');
      }
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(movieKeys.detail(variables.uuid), data);
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
    },
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
      queryClient.removeQueries({ queryKey: movieKeys.detail(movieId) });
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
    },
  });

  const createMovie = async (movieData: any) => {
    try {
      const data = await createMovieMutation.mutateAsync(movieData);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const updateMovie = async (uuid: string, movieData: any) => {
    try {
      const data = await updateMovieMutation.mutateAsync({ uuid, movieData });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const deleteMovie = async (movieId: string) => {
    try {
      await deleteMovieMutation.mutateAsync(movieId);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  return {
    data,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
    createMovie,
    updateMovie,
    deleteMovie,
    isCreating: createMovieMutation.isPending,
    isUpdating: updateMovieMutation.isPending,
    isDeleting: deleteMovieMutation.isPending,
  };
};

export default useMovieDetail;
