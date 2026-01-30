import { useInfiniteQuery } from '@tanstack/react-query';
import { directorsAPI } from '../api/directors.api';

const useDirectorsForDropdown = () => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['directors', 'dropdown'],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await directorsAPI.getDirectors({ 
        page: pageParam, 
        size: 20
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch directors');
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
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Flatten all pages into a single array
  const directors = data?.pages.flatMap(page => page.items) || [];

  return {
    directors,
    isLoading,
    error: error ? (error as Error).message : null,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export default useDirectorsForDropdown;
