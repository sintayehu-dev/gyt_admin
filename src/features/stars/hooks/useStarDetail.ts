import { useQuery } from '@tanstack/react-query';
import { starsAPI } from '../api/stars.api';
import { starKeys } from './useStars';

const useStarDetail = (uuid?: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: starKeys.detail(uuid || ''),
    queryFn: async () => {
      if (!uuid) {
        throw new Error('Star ID is required');
      }

      const result = await starsAPI.getStarById(uuid);

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch star');
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

export default useStarDetail;
