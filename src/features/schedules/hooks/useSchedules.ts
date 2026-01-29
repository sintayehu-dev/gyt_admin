import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { schedulesAPI } from '../api/schedules.api';
import { SchedulesListRequest } from '../api/schedules.model';
import { useState, useCallback, useMemo } from 'react';

export const scheduleKeys = {
  all: ['schedules'],
  lists: () => [...scheduleKeys.all, 'list'],
  list: (filters: any) => [...scheduleKeys.lists(), filters],
  details: () => [...scheduleKeys.all, 'detail'],
  detail: (id: string) => [...scheduleKeys.details(), id],
};

interface CreateScheduleData {
  movieUuid: string;
  cinemaHall: string;
  showDate: string;
  showTime: string;
  endTime: string;
  totalSeats: number;
  price: number;
}

interface UpdateScheduleData {
  movieUuid: string;
  cinemaHall: string;
  showDate: string;
  showTime: string;
  endTime: string;
  totalSeats: number;
  price: number;
}

const useSchedules = () => {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState({
    page: SchedulesListRequest.page,
    size: SchedulesListRequest.size,
  });

  const [filters, setFilters] = useState({
    search: SchedulesListRequest.search,
    cinemaHall: SchedulesListRequest.cinemaHall,
    showDate: SchedulesListRequest.showDate,
    isActive: SchedulesListRequest.isActive,
  });

  const queryKey = useMemo(() => {
    return scheduleKeys.list({
      page: pagination.page,
      size: pagination.size,
      search: filters.search,
      cinemaHall: filters.cinemaHall,
      showDate: filters.showDate,
      isActive: filters.isActive,
    });
  }, [pagination.page, pagination.size, filters.search, filters.cinemaHall, filters.showDate, filters.isActive]);

  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await schedulesAPI.getSchedules({
        page: pagination.page,
        size: pagination.size,
        search: filters.search,
        cinemaHall: filters.cinemaHall,
        showDate: filters.showDate,
        isActive: filters.isActive,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch schedules');
      }

      return {
        schedules: result.data?.items || [],
        pagination: result.data?.pagination || {
          page: pagination.page,
          size: pagination.size,
          totalItems: 0,
          totalPages: 0,
        },
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (scheduleData: CreateScheduleData) => {
      const result = await schedulesAPI.createSchedule(scheduleData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create schedule');
      }
      
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: async ({ uuid, scheduleData }: { uuid: string; scheduleData: UpdateScheduleData }) => {
      const result = await schedulesAPI.updateSchedule(uuid, scheduleData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update schedule');
      }
      
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(scheduleKeys.detail(variables.uuid), data);
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      const result = await schedulesAPI.deleteSchedule(scheduleId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete schedule');
      }
      
      return result;
    },
    onSuccess: (_result, scheduleId) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      queryClient.removeQueries({ queryKey: scheduleKeys.detail(scheduleId) });
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

  const createSchedule = useCallback(async (scheduleData: CreateScheduleData) => {
    try {
      const data = await createScheduleMutation.mutateAsync(scheduleData);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }, [createScheduleMutation]);

  const updateSchedule = useCallback(async (uuid: string, scheduleData: UpdateScheduleData) => {
    try {
      const data = await updateScheduleMutation.mutateAsync({ uuid, scheduleData });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }, [updateScheduleMutation]);

  const deleteSchedule = useCallback(async (scheduleId: string) => {
    try {
      const result = await deleteScheduleMutation.mutateAsync(scheduleId);
      return { success: true, message: result.message };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }, [deleteScheduleMutation]);

  return {
    schedules: queryData?.schedules || [],
    isLoading,
    error: error ? (error as Error).message : null,
    pagination: queryData?.pagination || null,
    filters,
    updateSearch,
    updatePage,
    updatePageSize,
    refetch,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    isCreating: createScheduleMutation.isPending,
    isUpdating: updateScheduleMutation.isPending,
    isDeleting: deleteScheduleMutation.isPending,
  };
};

export default useSchedules;
