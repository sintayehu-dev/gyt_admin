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
  movie: MovieDTO;
  movieUuid: string;
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
  formattedShowDate: string;
  formattedShowTime: string;
  formattedEndTime: string;
  formattedCreatedAt: string;
}

export interface PaginationDTO {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface SchedulesListDTO {
  items: ScheduleDTO[];
  pagination: PaginationDTO;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatTime = (timeString: string): string => {
  if (!timeString) return '';
  return timeString.substring(0, 5); // HH:MM
};

const transformMovie = (movie: any): MovieDTO => {
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

export const transformSchedule = (schedule: any): ScheduleDTO => {
  return {
    uuid: schedule.uuid || '',
    movie: transformMovie(schedule.movie || {}),
    movieUuid: schedule.movie?.uuid || schedule.movieUuid || '',
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
    formattedShowDate: formatDate(schedule.showDate),
    formattedShowTime: formatTime(schedule.showTime),
    formattedEndTime: formatTime(schedule.endTime),
    formattedCreatedAt: formatDate(schedule.createdAt),
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

export const transformSchedulesListResponse = (response: any): SchedulesListDTO => {
  return {
    items: (response.data?.items || []).map(transformSchedule),
    pagination: transformPagination(response.data?.pagination || {}),
  };
};
