import { useQuery } from '@tanstack/react-query';
import { genresAPI } from '../api/genres.api';
import { genreKeys } from './useGenres';

const useGenreDetail = (uuid?: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: genreKeys.detail(uuid || ''),
    queryFn: async () => {
      if (!uuid) {
        throw new Error('Genre ID is required');
      }

      const result = await genresAPI.getGenreById(uuid);

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch genre');
      }

      return result.data;
    },
    enabled: !!uuid,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  return {
    data,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
};

export default useGenreDetail;
