import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsAPI } from '../api/tickets.api';
import { TicketsListRequest } from '../api/tickets.model';
import { useState, useCallback, useMemo } from 'react';

export const ticketKeys = {
  all: ['tickets'],
  lists: () => [...ticketKeys.all, 'list'],
  list: (filters: any) => [...ticketKeys.lists(), filters],
};

const useTickets = () => {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState({
    page: TicketsListRequest.page,
    size: TicketsListRequest.size,
  });

  const [filters, setFilters] = useState<{
    search: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | undefined;
    userUuid: string;
    scheduleUuid: string;
  }>({
    search: TicketsListRequest.search || '',
    status: TicketsListRequest.status,
    userUuid: TicketsListRequest.userUuid || '',
    scheduleUuid: TicketsListRequest.scheduleUuid || '',
  });

  const queryKey = useMemo(() => {
    return ticketKeys.list({
      page: pagination.page,
      size: pagination.size,
      search: filters.search,
      status: filters.status,
      userUuid: filters.userUuid,
      scheduleUuid: filters.scheduleUuid,
    });
  }, [pagination.page, pagination.size, filters.search, filters.status, filters.userUuid, filters.scheduleUuid]);

  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await ticketsAPI.getTickets({
        page: pagination.page,
        size: pagination.size,
        search: filters.search,
        status: filters.status,
        userUuid: filters.userUuid,
        scheduleUuid: filters.scheduleUuid,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch tickets');
      }

      return {
        tickets: result.data?.items || [],
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

  const deleteTicketMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      const result = await ticketsAPI.deleteTicket(ticketId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete ticket');
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });

  const updateSearch = useCallback((searchValue: string) => {
    setFilters(prev => ({ ...prev, search: searchValue }));
    setPagination(prev => ({ ...prev, page: 0 }));
  }, []);

  const updateStatus = useCallback((status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | undefined) => {
    setFilters(prev => ({ ...prev, status }));
    setPagination(prev => ({ ...prev, page: 0 }));
  }, []);

  const updatePage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page: page - 1 }));
  }, []);

  const updatePageSize = useCallback((size: number) => {
    setPagination(prev => ({ ...prev, size, page: 0 }));
  }, []);

  const deleteTicket = useCallback(async (ticketId: string) => {
    try {
      const result = await deleteTicketMutation.mutateAsync(ticketId);
      return { success: true, message: result.message };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }, [deleteTicketMutation]);

  return {
    tickets: queryData?.tickets || [],
    isLoading,
    error: error ? (error as Error).message : null,
    pagination: queryData?.pagination || null,
    filters,
    updateSearch,
    updateStatus,
    updatePage,
    updatePageSize,
    refetch,
    deleteTicket,
    isDeleting: deleteTicketMutation.isPending,
  };
};

export default useTickets;
