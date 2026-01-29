import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { genresAPI } from '../api/genres.api';
import { GenresListRequest } from '../api/genres.model';
import { useState, useCallback, useMemo } from 'react';

export const genreKeys = {
  all: ['genres'],
  lists: () => [...genreKeys.all, 'list'],
  list: (filters: any) => [...genreKeys.lists(), filters],
  details: () => [...genreKeys.all, 'detail'],
  detail: (id: string) => [...genreKeys.details(), id],
};

interface CreateGenreData {
  name: string;
  description: string;
}

interface UpdateGenreData {
  name: string;
  description: string;
}

const useGenres = () => {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState({
    page: GenresListRequest.page,
    size: GenresListRequest.size,
  });

  const [filters, setFilters] = useState({
    search: GenresListRequest.search,
  });

  const queryKey = useMemo(() => {
    return genreKeys.list({
      page: pagination.page,
      size: pagination.size,
      search: filters.search,
    });
  }, [pagination.page, pagination.size, filters.search]);

  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await genresAPI.getGenres({
        page: pagination.page,
        size: pagination.size,
        search: filters.search,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch genres');
      }

      return {
        genres: result.data?.items || [],
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

  const createGenreMutation = useMutation({
    mutationFn: async (genreData: CreateGenreData) => {
      const result = await genresAPI.createGenre(genreData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create genre');
      }
      
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: genreKeys.lists() });
    },
  });

  const updateGenreMutation = useMutation({
    mutationFn: async ({ uuid, genreData }: { uuid: string; genreData: UpdateGenreData }) => {
      const result = await genresAPI.updateGenre(uuid, genreData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update genre');
      }
      
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(genreKeys.detail(variables.uuid), data);
      queryClient.invalidateQueries({ queryKey: genreKeys.lists() });
    },
  });

  const deleteGenreMutation = useMutation({
    mutationFn: async (genreId: string) => {
      const result = await genresAPI.deleteGenre(genreId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete genre');
      }
      
      return result;
    },
    onSuccess: (_result, genreId) => {
      queryClient.invalidateQueries({ queryKey: genreKeys.lists() });
      queryClient.removeQueries({ queryKey: genreKeys.detail(genreId) });
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

  const createGenre = useCallback(async (genreData: CreateGenreData) => {
    try {
      const data = await createGenreMutation.mutateAsync(genreData);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }, [createGenreMutation]);

  const updateGenre = useCallback(async (uuid: string, genreData: UpdateGenreData) => {
    try {
      const data = await updateGenreMutation.mutateAsync({ uuid, genreData });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }, [updateGenreMutation]);

  const deleteGenre = useCallback(async (genreId: string) => {
    try {
      const result = await deleteGenreMutation.mutateAsync(genreId);
      return { success: true, message: result.message };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }, [deleteGenreMutation]);

  return {
    genres: queryData?.genres || [],
    isLoading,
    error: error ? (error as Error).message : null,
    pagination: queryData?.pagination || null,
    filters,
    updateSearch,
    updatePage,
    updatePageSize,
    refetch,
    createGenre,
    updateGenre,
    deleteGenre,
    isCreating: createGenreMutation.isPending,
    isUpdating: updateGenreMutation.isPending,
    isDeleting: deleteGenreMutation.isPending,
  };
};

export default useGenres;
