import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { starsAPI } from '../api/stars.api';
import { StarsListRequest } from '../api/stars.model';
import { useState, useCallback, useMemo } from 'react';

export const starKeys = {
  all: ['stars'],
  lists: () => [...starKeys.all, 'list'],
  list: (filters: any) => [...starKeys.lists(), filters],
  details: () => [...starKeys.all, 'detail'],
  detail: (id: string) => [...starKeys.details(), id],
};

interface CreateStarData {
  name: string;
  biography: string;
}

interface UpdateStarData {
  name: string;
  biography: string;
}

const useStars = () => {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState({
    page: StarsListRequest.page,
    size: StarsListRequest.size,
  });

  const [filters, setFilters] = useState({
    search: StarsListRequest.search,
  });

  const queryKey = useMemo(() => {
    return starKeys.list({
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
      const result = await starsAPI.getStars({
        page: pagination.page,
        size: pagination.size,
        search: filters.search,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch stars');
      }

      return {
        stars: result.data?.items || [],
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

  const createStarMutation = useMutation({
    mutationFn: async (starData: CreateStarData) => {
      const result = await starsAPI.createStar(starData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create star');
      }
      
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: starKeys.lists() });
    },
  });

  const updateStarMutation = useMutation({
    mutationFn: async ({ uuid, starData }: { uuid: string; starData: UpdateStarData }) => {
      const result = await starsAPI.updateStar(uuid, starData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update star');
      }
      
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(starKeys.detail(variables.uuid), data);
      queryClient.invalidateQueries({ queryKey: starKeys.lists() });
    },
  });

  const deleteStarMutation = useMutation({
    mutationFn: async (starId: string) => {
      const result = await starsAPI.deleteStar(starId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete star');
      }
      
      return result;
    },
    onSuccess: (_result, starId) => {
      queryClient.invalidateQueries({ queryKey: starKeys.lists() });
      queryClient.removeQueries({ queryKey: starKeys.detail(starId) });
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

  const createStar = useCallback(async (starData: CreateStarData) => {
    try {
      const data = await createStarMutation.mutateAsync(starData);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }, [createStarMutation]);

  const updateStar = useCallback(async (uuid: string, starData: UpdateStarData) => {
    try {
      const data = await updateStarMutation.mutateAsync({ uuid, starData });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }, [updateStarMutation]);

  const deleteStar = useCallback(async (starId: string) => {
    try {
      const result = await deleteStarMutation.mutateAsync(starId);
      return { success: true, message: result.message };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }, [deleteStarMutation]);

  return {
    stars: queryData?.stars || [],
    isLoading,
    error: error ? (error as Error).message : null,
    pagination: queryData?.pagination || null,
    filters,
    updateSearch,
    updatePage,
    updatePageSize,
    refetch,
    createStar,
    updateStar,
    deleteStar,
    isCreating: createStarMutation.isPending,
    isUpdating: updateStarMutation.isPending,
    isDeleting: deleteStarMutation.isPending,
  };
};

export default useStars;
