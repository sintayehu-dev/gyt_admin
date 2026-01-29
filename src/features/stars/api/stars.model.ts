export const StarModel = {
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

export const StarsListResponse = {
  success: true,
  status: 200,
  message: '',
  data: {
    items: [],
    pagination: PaginationModel,
  },
  timestamp: '',
};

export const StarsListRequest = {
  page: 0,
  size: 10,
  search: '',
};

export const CreateStarRequest = {
  name: '',
  biography: '',
};

export const UpdateStarRequest = {
  name: '',
  biography: '',
};
