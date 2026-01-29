export const GenreModel = {
  uuid: '',
  name: '',
  description: '',
  createdAt: '',
};

export const PaginationModel = {
  page: 0,
  size: 10,
  totalItems: 0,
  totalPages: 0,
};

export const GenresListResponse = {
  success: true,
  status: 200,
  message: '',
  data: {
    items: [],
    pagination: PaginationModel,
  },
  timestamp: '',
};

export const GenresListRequest = {
  page: 0,
  size: 10,
  search: '',
};

export const CreateGenreRequest = {
  name: '',
  description: '',
};

export const UpdateGenreRequest = {
  name: '',
  description: '',
};
