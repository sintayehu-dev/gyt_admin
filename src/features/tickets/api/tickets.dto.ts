export interface TicketDTO {
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
  formattedBookingDate: string;
  formattedPaymentDate: string;
  formattedCreatedAt: string;
}

export interface PaginationDTO {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface TicketsListDTO {
  items: TicketDTO[];
  pagination: PaginationDTO;
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export const transformTicket = (ticket: any): TicketDTO => {
  return {
    uuid: ticket.uuid || '',
    userUuid: ticket.userUuid || '',
    scheduleUuid: ticket.scheduleUuid || '',
    seatNumber: ticket.seatNumber || '',
    price: ticket.price || 0,
    status: ticket.status || 'PENDING',
    bookingDate: ticket.bookingDate || '',
    paymentDate: ticket.paymentDate || null,
    createdAt: ticket.createdAt || '',
    updatedAt: ticket.updatedAt || '',
    formattedBookingDate: formatDateTime(ticket.bookingDate),
    formattedPaymentDate: formatDateTime(ticket.paymentDate),
    formattedCreatedAt: formatDate(ticket.createdAt),
  };
};

export const transformPagination = (pagination: any): PaginationDTO => {
  return {
    page: pagination.page || 0,
    size: pagination.size || 10,
    totalItems: pagination.totalItems || 0,
    totalPages: pagination.totalPages || 0,
  };
};

export const transformTicketsListResponse = (response: any): TicketsListDTO => {
  return {
    items: (response.data?.items || []).map(transformTicket),
    pagination: transformPagination(response.data?.pagination || {}),
  };
};
