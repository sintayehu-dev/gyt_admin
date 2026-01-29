// Schedule Models

export interface Schedule {
  uuid: string;
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
}

export interface SchedulesListRequest {
  page: number;
  size: number;
  search?: string;
  cinemaHall?: string;
  showDate?: string;
  isActive?: boolean;
}

export const SchedulesListRequest = {
  page: 0,
  size: 5,
  search: '',
  cinemaHall: '',
  showDate: '',
  isActive: undefined,
};

export interface CreateScheduleRequest {
  movieUuid: string;
  cinemaHall: string;
  showDate: string;
  showTime: string;
  endTime: string;
  totalSeats: number;
  price: number;
}

export interface UpdateScheduleRequest {
  movieUuid: string;
  cinemaHall: string;
  showDate: string;
  showTime: string;
  endTime: string;
  totalSeats: number;
  price: number;
}

export interface PatchScheduleRequest {
  movieUuid?: string;
  cinemaHall?: string;
  showDate?: string;
  showTime?: string;
  endTime?: string;
  totalSeats?: number;
  price?: number;
}

export interface Pagination {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface SchedulesListResponse {
  items: Schedule[];
  pagination: Pagination;
}
