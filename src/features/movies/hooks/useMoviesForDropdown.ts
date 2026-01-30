import { useInfiniteQuery } from '@tanstack/react-query';
import { moviesAPI } from '../api/movies.api';

const useMoviesForDropdown = () => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['movies', 'dropdown'],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await moviesAPI.getMovies({ 
        page: pageParam, 
        size: 20, 
        isActive: true 
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch movies');
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
  const movies = data?.pages.flatMap(page => page.items) || [];

  return {
    movies,
    isLoading,
    error: error ? (error as Error).message : null,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export default useMoviesForDropdown;
