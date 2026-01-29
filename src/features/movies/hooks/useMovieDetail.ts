import { useQuery } from '@tanstack/react-query';
import { moviesAPI } from '../api/movies.api';
import { movieKeys } from './useMovies';

const useMovieDetail = (uuid?: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: movieKeys.detail(uuid || ''),
    queryFn: async () => {
      console.log('[useMovieDetail] Fetching movie with uuid:', uuid);
      
      if (!uuid) {
        throw new Error('Movie ID is required');
      }

      const result = await moviesAPI.getMovieById(uuid);
      
      console.log('[useMovieDetail] API result:', result);

      if (!result.success) {
        console.error('[useMovieDetail] API failed:', result.error);
        throw new Error(result.error || 'Failed to fetch movie');
      }

      console.log('[useMovieDetail] Returning movie data:', result.data);
      return result.data;
    },
    enabled: !!uuid,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  console.log('[useMovieDetail] Current state - data:', data, 'isLoading:', isLoading, 'error:', error);

  return {
    data,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
};

export default useMovieDetail;
