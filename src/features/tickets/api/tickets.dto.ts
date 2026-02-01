export interface UserDTO {
  uuid: string;
  email: string;
  name: string;
  role: string | null;
  lastLogin: string | null;
}

export interface MovieDTO {
  uuid: string;
  title: string;
  description: string;
  duration: number | null;
  releaseDate: string;
  language: string;
  country: string | null;
  posterUrl: string;
  trailerUrl: string;
}

export interface ScheduleDTO {
  uuid: string;
  movieUuid: string | null;
  cinemaHall: string;
  showDate: string;
  showTime: string;
  endTime: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  movie: MovieDTO | null;
}

export interface TicketDTO {
  uuid: string;
  userUuid: string;
  scheduleUuid: string;
  seatNumber: string;
  price: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';
  bookingTime: string;
  paymentTime: string | null;
  paymentId: string | null;
  createdAt: string;
  updatedAt: string;
  formattedBookingDate: string;
  formattedPaymentDate: string;
  formattedCreatedAt: string;
  user: UserDTO | null;
  schedule: ScheduleDTO | null;
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

const transformUser = (user: any): UserDTO | null => {
  if (!user) return null;
  return {
    uuid: user.uuid || '',
    email: user.email || '',
    name: user.name || '',
    role: user.role || null,
    lastLogin: user.lastLogin || null,
  };
};

const transformMovie = (movie: any): MovieDTO | null => {
  if (!movie) return null;
  return {
    uuid: movie.uuid || '',
    title: movie.title || '',
    description: movie.description || '',
    duration: movie.duration || null,
    releaseDate: movie.releaseDate || '',
    language: movie.language || '',
    country: movie.country || null,
    posterUrl: movie.posterUrl || '',
    trailerUrl: movie.trailerUrl || '',
  };
};

const transformSchedule = (schedule: any): ScheduleDTO | null => {
  if (!schedule) return null;
  return {
    uuid: schedule.uuid || '',
    movieUuid: schedule.movieUuid || null,
    cinemaHall: schedule.cinemaHall || '',
    showDate: schedule.showDate || '',
    showTime: schedule.showTime || '',
    endTime: schedule.endTime || '',
    totalSeats: schedule.totalSeats || 0,
    availableSeats: schedule.availableSeats || 0,
    price: schedule.price || 0,
    isActive: schedule.isActive ?? true,
    createdAt: schedule.createdAt || '',
    updatedAt: schedule.updatedAt || '',
    movie: transformMovie(schedule.movie),
  };
};

export const transformTicket = (ticket: any): TicketDTO => {
  return {
    uuid: ticket.uuid || '',
    userUuid: ticket.userUuid || '',
    scheduleUuid: ticket.scheduleUuid || '',
    seatNumber: ticket.seatNumber || '',
    price: ticket.price || 0,
    status: ticket.status || 'PENDING',
    bookingTime: ticket.bookingTime || '',
    paymentTime: ticket.paymentTime || null,
    paymentId: ticket.paymentId || null,
    createdAt: ticket.createdAt || '',
    updatedAt: ticket.updatedAt || '',
    formattedBookingDate: formatDateTime(ticket.bookingTime),
    formattedPaymentDate: formatDateTime(ticket.paymentTime),
    formattedCreatedAt: formatDate(ticket.createdAt),
    user: transformUser(ticket.user),
    schedule: transformSchedule(ticket.schedule),
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
