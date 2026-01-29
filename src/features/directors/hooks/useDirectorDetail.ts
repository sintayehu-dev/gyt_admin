import { useQuery } from '@tanstack/react-query';
import { directorsAPI } from '../api/directors.api';
import { directorKeys } from './useDirectors';

const useDirectorDetail = (uuid?: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: directorKeys.detail(uuid || ''),
    queryFn: async () => {
      if (!uuid) {
        throw new Error('Director ID is required');
      }

      const result = await directorsAPI.getDirectorById(uuid);

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch director');
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

export default useDirectorDetail;
