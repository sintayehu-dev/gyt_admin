import { useQuery } from '@tanstack/react-query';
import { ticketsAPI } from '../api/tickets.api';

export const ticketDetailKeys = {
  all: ['tickets', 'detail'],
  detail: (id: string) => [...ticketDetailKeys.all, id],
};

const useTicketDetail = (uuid?: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ticketDetailKeys.detail(uuid || ''),
    queryFn: async () => {
      if (!uuid) {
        throw new Error('Ticket ID is required');
      }

      const result = await ticketsAPI.getTicketById(uuid);

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch ticket');
      }

      return result.data;
    },
    enabled: !!uuid,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  return {
    data,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
};

export default useTicketDetail;
