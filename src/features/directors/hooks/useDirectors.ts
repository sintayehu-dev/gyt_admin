import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { directorsAPI } from '../api/directors.api';
import { DirectorsListRequest } from '../api/directors.model';
import { useState, useCallback, useMemo } from 'react';

export const directorKeys = {
  all: ['directors'],
  lists: () => [...directorKeys.all, 'list'],
  list: (filters: any) => [...directorKeys.lists(), filters],
  details: () => [...directorKeys.all, 'detail'],
  detail: (id: string) => [...directorKeys.details(), id],
};

interface CreateDirectorData {
  name: string;
  biography: string;
}

interface UpdateDirectorData {
  name: string;
  biography: string;
}

const useDirectors = () => {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState({
    page: DirectorsListRequest.page,
    size: DirectorsListRequest.size,
  });

  const [filters, setFilters] = useState({
    search: DirectorsListRequest.search,
  });

  const queryKey = useMemo(() => {
    return directorKeys.list({
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
      const result = await directorsAPI.getDirectors({
        page: pagination.page,
        size: pagination.size,
        search: filters.search,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch directors');
      }

      return {
        directors: result.data?.items || [],
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

  const createDirectorMutation = useMutation({
    mutationFn: async (directorData: CreateDirectorData) => {
      const result = await directorsAPI.createDirector(directorData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create director');
      }
      
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: directorKeys.lists() });
    },
  });

  const updateDirectorMutation = useMutation({
    mutationFn: async ({ uuid, directorData }: { uuid: string; directorData: UpdateDirectorData }) => {
      const result = await directorsAPI.updateDirector(uuid, directorData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update director');
      }
      
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(directorKeys.detail(variables.uuid), data);
      queryClient.invalidateQueries({ queryKey: directorKeys.lists() });
    },
  });

  const deleteDirectorMutation = useMutation({
    mutationFn: async (directorId: string) => {
      const result = await directorsAPI.deleteDirector(directorId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete director');
      }
      
      return result;
    },
    onSuccess: (_result, directorId) => {
      queryClient.invalidateQueries({ queryKey: directorKeys.lists() });
      queryClient.removeQueries({ queryKey: directorKeys.detail(directorId) });
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

  const createDirector = useCallback(async (directorData: CreateDirectorData) => {
    try {
      const data = await createDirectorMutation.mutateAsync(directorData);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }, [createDirectorMutation]);

  const updateDirector = useCallback(async (uuid: string, directorData: UpdateDirectorData) => {
    try {
      const data = await updateDirectorMutation.mutateAsync({ uuid, directorData });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }, [updateDirectorMutation]);

  const deleteDirector = useCallback(async (directorId: string) => {
    try {
      const result = await deleteDirectorMutation.mutateAsync(directorId);
      return { success: true, message: result.message };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }, [deleteDirectorMutation]);

  return {
    directors: queryData?.directors || [],
    isLoading,
    error: error ? (error as Error).message : null,
    pagination: queryData?.pagination || null,
    filters,
    updateSearch,
    updatePage,
    updatePageSize,
    refetch,
    createDirector,
    updateDirector,
    deleteDirector,
    isCreating: createDirectorMutation.isPending,
    isUpdating: updateDirectorMutation.isPending,
    isDeleting: deleteDirectorMutation.isPending,
  };
};

export default useDirectors;
