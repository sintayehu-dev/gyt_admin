import { httpService } from '../../../core/services/api/httpService';
import { NetworkExceptions } from '../../../core/services/api/networkExceptions';
import { transformTicketsListResponse, TicketsListDTO, transformTicket } from './tickets.dto';

interface TicketsListParams {
  page?: number;
  size?: number;
  search?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  userUuid?: string;
  scheduleUuid?: string;
}

interface TicketsSuccessResponse {
  success: true;
  data: TicketsListDTO;
}

interface TicketsErrorResponse {
  success: false;
  error: string;
  exception?: any;
}

export type TicketsResponse = TicketsSuccessResponse | TicketsErrorResponse;

export const ticketsAPI = {
  getTickets: async (params: TicketsListParams = {}): Promise<TicketsResponse> => {
    try {
      const client = httpService.client({ requireAuth: true });

      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', String(params.page));
      if (params.size !== undefined) queryParams.append('size', String(params.size));
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.userUuid) queryParams.append('userUuid', params.userUuid);
      if (params.scheduleUuid) queryParams.append('scheduleUuid', params.scheduleUuid);

      const response = await client.get(`/admin/tickets?${queryParams.toString()}`);

      const transformedData = transformTicketsListResponse(response.data);

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

  getTicketsByUser: async (userUuid: string, params: { page?: number; size?: number } = {}): Promise<TicketsResponse> => {
    try {
      const client = httpService.client({ requireAuth: true });

      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', String(params.page));
      if (params.size !== undefined) queryParams.append('size', String(params.size));

      const response = await client.get(`/admin/tickets/user/${userUuid}?${queryParams.toString()}`);

      const transformedData = transformTicketsListResponse(response.data);

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

  getTicketsBySchedule: async (scheduleUuid: string, params: { page?: number; size?: number } = {}): Promise<TicketsResponse> => {
    try {
      const client = httpService.client({ requireAuth: true });

      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', String(params.page));
      if (params.size !== undefined) queryParams.append('size', String(params.size));

      const response = await client.get(`/admin/tickets/schedule/${scheduleUuid}?${queryParams.toString()}`);

      const transformedData = transformTicketsListResponse(response.data);

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

  getTicketsByStatus: async (status: 'PENDING' | 'CONFIRMED' | 'CANCELLED', params: { page?: number; size?: number } = {}): Promise<TicketsResponse> => {
    try {
      const client = httpService.client({ requireAuth: true });

      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', String(params.page));
      if (params.size !== undefined) queryParams.append('size', String(params.size));

      const response = await client.get(`/admin/tickets/status/${status}?${queryParams.toString()}`);

      const transformedData = transformTicketsListResponse(response.data);

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

  advancedSearch: async (params: {
    userUuid?: string;
    scheduleUuid?: string;
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';
    seatNumber?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
  } = {}): Promise<TicketsResponse> => {
    try {
      const client = httpService.client({ requireAuth: true });

      const queryParams = new URLSearchParams();
      if (params.userUuid) queryParams.append('userUuid', params.userUuid);
      if (params.scheduleUuid) queryParams.append('scheduleUuid', params.scheduleUuid);
      if (params.status) queryParams.append('status', params.status);
      if (params.seatNumber) queryParams.append('seatNumber', params.seatNumber);
      if (params.minPrice !== undefined) queryParams.append('minPrice', String(params.minPrice));
      if (params.maxPrice !== undefined) queryParams.append('maxPrice', String(params.maxPrice));
      if (params.page !== undefined) queryParams.append('page', String(params.page));
      if (params.size !== undefined) queryParams.append('size', String(params.size));

      const response = await client.get(`/admin/tickets/search?${queryParams.toString()}`);

      const transformedData = transformTicketsListResponse(response.data);

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

  deleteTicket: async (uuid: string): Promise<any> => {
    try {
      const client = httpService.client({ requireAuth: true });
      const response = await client.delete(`/admin/tickets/${uuid}`);

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
