import { useInfiniteQuery } from '@tanstack/react-query';
import { genresAPI } from '../api/genres.api';

const useGenresForDropdown = () => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['genres', 'dropdown'],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await genresAPI.getGenres({ 
        page: pageParam, 
        size: 20
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch genres');
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
  const genres = data?.pages.flatMap(page => page.items) || [];

  return {
    genres,
    isLoading,
    error: error ? (error as Error).message : null,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export default useGenresForDropdown;
