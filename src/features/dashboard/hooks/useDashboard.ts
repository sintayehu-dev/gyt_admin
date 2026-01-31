import { useQuery } from '@tanstack/react-query';

interface DashboardStats {
  weeklyRevenue: number;
  ticketsSold: number;
  activeMovies: number;
  totalHalls: number;
}

interface RecentBooking {
  uuid: string;
  customerName: string;
  movieTitle: string;
  createdAt: string;
  seatsBooked: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

interface DashboardData {
  stats: DashboardStats;
  recentBookings: RecentBooking[];
}

const useDashboard = () => {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      // Mock data for now - replace with actual API call later
      return {
        stats: {
          weeklyRevenue: 45231,
          ticketsSold: 1234,
          activeMovies: 12,
          totalHalls: 8,
        },
        recentBookings: [],
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    data,
    isLoading,
    error: error ? (error as Error).message : null,
  };
};

export default useDashboard;
