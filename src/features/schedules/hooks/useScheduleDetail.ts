import { useQuery } from '@tanstack/react-query';
import { schedulesAPI } from '../api/schedules.api';
import { scheduleKeys } from './useSchedules';

const useScheduleDetail = (uuid: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: scheduleKeys.detail(uuid),
    queryFn: async () => {
      const result = await schedulesAPI.getScheduleById(uuid);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch schedule');
      }
      
      return result.data;
    },
    enabled: !!uuid,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  return {
    schedule: data,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
};

export default useScheduleDetail;
