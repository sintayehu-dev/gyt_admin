import { useInfiniteQuery } from '@tanstack/react-query';
import { schedulesAPI } from '../api/schedules.api';

const useSchedulesForDropdown = () => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['schedules', 'dropdown'],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await schedulesAPI.getSchedules({ 
        page: pageParam, 
        size: 20,
        isActive: true
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch schedules');
      }

      return {
        items: result.data?.items || [],
        pagination: result.data?.pagination || { page: 0, size: 20, totalItems: 0, totalPages: 0 },
      };
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page + 1 < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Flatten all pages into a single array
  const schedules = data?.pages.flatMap(page => page.items) || [];

  return {
    schedules,
    isLoading,
    error: error ? (error as Error).message : null,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export default useSchedulesForDropdown;
