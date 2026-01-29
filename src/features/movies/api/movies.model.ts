export const MovieModel = {
  uuid: '',
  title: '',
  description: '',
  durationMinutes: 0,
  releaseDate: '',
  posterUrl: '',
  trailerUrl: '',
  language: '',
  isActive: true,
  genres: [],
  directors: [],
  stars: [],
  createdAt: '',
  updatedAt: '',
};

export const PaginationModel = {
  page: 0,
  size: 5,
  totalItems: 0,
  totalPages: 0,
};

export const MoviesListResponse = {
  success: true,
  status: 200,
  message: '',
  data: {
    items: [],
    pagination: PaginationModel,
  },
  timestamp: '',
};

export const MoviesListRequest = {
  page: 0,
  size: 5,
  search: '',
  genre: '',
  language: '',
  isActive: true,
};
