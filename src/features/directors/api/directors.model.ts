export const DirectorModel = {
  uuid: '',
  name: '',
  biography: '',
  createdAt: '',
};

export const PaginationModel = {
  page: 0,
  size: 10,
  totalItems: 0,
  totalPages: 0,
};

export const DirectorsListResponse = {
  success: true,
  status: 200,
  message: '',
  data: {
    items: [],
    pagination: PaginationModel,
  },
  timestamp: '',
};

export const DirectorsListRequest = {
  page: 0,
  size: 10,
  search: '',
};

export const CreateDirectorRequest = {
  name: '',
  biography: '',
};

export const UpdateDirectorRequest = {
  name: '',
  biography: '',
};
