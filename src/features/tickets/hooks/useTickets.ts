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
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED' | undefined;
    scheduleUuid: string;
  }>({
    search: TicketsListRequest.search || '',
    status: TicketsListRequest.status,
    scheduleUuid: TicketsListRequest.scheduleUuid || '',
  });

  const queryKey = useMemo(() => {
    return ticketKeys.list({
      page: pagination.page,
      size: pagination.size,
      search: filters.search,
      status: filters.status,
      scheduleUuid: filters.scheduleUuid,
    });
  }, [pagination.page, pagination.size, filters.search, filters.status, filters.scheduleUuid]);

  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      let result;

      // Use specific API endpoints based on filters
      if (filters.scheduleUuid && filters.status) {
        // If both schedule and status are selected, use schedule endpoint and filter by status client-side
        result = await ticketsAPI.getTicketsBySchedule(filters.scheduleUuid, {
          page: pagination.page,
          size: pagination.size,
        });
      } else if (filters.scheduleUuid) {
        // Use schedule-specific endpoint
        result = await ticketsAPI.getTicketsBySchedule(filters.scheduleUuid, {
          page: pagination.page,
          size: pagination.size,
        });
      } else if (filters.status) {
        // Use status-specific endpoint
        result = await ticketsAPI.getTicketsByStatus(filters.status, {
          page: pagination.page,
          size: pagination.size,
        });
      } else {
        // Use general endpoint
        result = await ticketsAPI.getTickets({
          page: pagination.page,
          size: pagination.size,
          search: filters.search,
        });
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch tickets');
      }

      let tickets = result.data?.items || [];

      // Client-side filtering if both schedule and status are selected
      if (filters.scheduleUuid && filters.status) {
        tickets = tickets.filter(ticket => ticket.status === filters.status);
      }

      return {
        tickets,
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

  const updateStatus = useCallback((status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED' | undefined) => {
    setFilters(prev => ({ ...prev, status }));
    setPagination(prev => ({ ...prev, page: 0 }));
  }, []);

  const updateSchedule = useCallback((scheduleUuid: string) => {
    setFilters(prev => ({ ...prev, scheduleUuid }));
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
    updateSchedule,
    updatePage,
    updatePageSize,
    refetch,
    deleteTicket,
    isDeleting: deleteTicketMutation.isPending,
  };
};

export default useTickets;
