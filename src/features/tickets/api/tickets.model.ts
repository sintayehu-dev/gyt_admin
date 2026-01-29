// Ticket Models

export interface Ticket {
  uuid: string;
  userUuid: string;
  scheduleUuid: string;
  seatNumber: string;
  price: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  bookingDate: string;
  paymentDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketsListRequest {
  page: number;
  size: number;
  search?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  userUuid?: string;
  scheduleUuid?: string;
}

export const TicketsListRequest = {
  page: 0,
  size: 5,
  search: '',
  status: undefined,
  userUuid: '',
  scheduleUuid: '',
};

export interface Pagination {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface TicketsListResponse {
  items: Ticket[];
  pagination: Pagination;
}
