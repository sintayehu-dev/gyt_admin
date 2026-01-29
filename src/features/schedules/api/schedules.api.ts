import { httpService } from '../../../core/services/api/httpService';
import { NetworkExceptions } from '../../../core/services/api/networkExceptions';
import { transformSchedulesListResponse, SchedulesListDTO, transformSchedule } from './schedules.dto';

interface SchedulesListParams {
  page?: number;
  size?: number;
  search?: string;
  cinemaHall?: string;
  showDate?: string;
  isActive?: boolean;
}

interface SchedulesSuccessResponse {
  success: true;
  data: SchedulesListDTO;
}

interface SchedulesErrorResponse {
  success: false;
  error: string;
  exception?: any;
}

export type SchedulesResponse = SchedulesSuccessResponse | SchedulesErrorResponse;

export const schedulesAPI = {
  getSchedules: async (params: SchedulesListParams = {}): Promise<SchedulesResponse> => {
    try {
      const client = httpService.client({ requireAuth: true });

      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', String(params.page));
      if (params.size !== undefined) queryParams.append('size', String(params.size));
      if (params.search) queryParams.append('search', params.search);
      if (params.cinemaHall) queryParams.append('cinemaHall', params.cinemaHall);
      if (params.showDate) queryParams.append('showDate', params.showDate);
      if (params.isActive !== undefined) queryParams.append('isActive', String(params.isActive));

      const response = await client.get(`/admin/schedules?${queryParams.toString()}`);

      const transformedData = transformSchedulesListResponse(response.data);

      return {
        success: true,
        data: transformedData
      };
    } catch (error) {
      const networkException = NetworkExceptions.getException(error);
      const errorMessage = NetworkExceptions.getRawErrorMessage(error);

      return {
        success: false,
        error: errorMessage,
        exception: networkException
      };
    }
  },

  getScheduleById: async (uuid: string): Promise<any> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.get(`/admin/schedules/${uuid}`);

      return {
        success: true,
        data: transformSchedule(response.data.data)
      };
    } catch (error) {
      const networkException = NetworkExceptions.getException(error);
      const errorMessage = NetworkExceptions.getRawErrorMessage(error);

      return {
        success: false,
        error: errorMessage,
        exception: networkException
      };
    }
  },

  createSchedule: async (scheduleData: any): Promise<any> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.post('/admin/schedules', scheduleData);

      return {
        success: true,
        data: transformSchedule(response.data.data)
      };
    } catch (error) {
      const networkException = NetworkExceptions.getException(error);
      const errorMessage = NetworkExceptions.getRawErrorMessage(error);

      return {
        success: false,
        error: errorMessage,
        exception: networkException
      };
    }
  },

  updateSchedule: async (uuid: string, scheduleData: any): Promise<any> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.put(`/admin/schedules/${uuid}`, scheduleData);

      return {
        success: true,
        data: transformSchedule(response.data.data)
      };
    } catch (error) {
      const networkException = NetworkExceptions.getException(error);
      const errorMessage = NetworkExceptions.getRawErrorMessage(error);

      return {
        success: false,
        error: errorMessage,
        exception: networkException
      };
    }
  },

  patchSchedule: async (uuid: string, scheduleData: any): Promise<any> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.patch(`/admin/schedules/${uuid}`, scheduleData);

      return {
        success: true,
        data: transformSchedule(response.data.data)
      };
    } catch (error) {
      const networkException = NetworkExceptions.getException(error);
      const errorMessage = NetworkExceptions.getRawErrorMessage(error);

      return {
        success: false,
        error: errorMessage,
        exception: networkException
      };
    }
  },

  deleteSchedule: async (uuid: string): Promise<any> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.delete(`/admin/schedules/${uuid}`);

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const networkException = NetworkExceptions.getException(error);
      const errorMessage = NetworkExceptions.getRawErrorMessage(error);

      return {
        success: false,
        error: errorMessage,
        exception: networkException
      };
    }
  }
};
