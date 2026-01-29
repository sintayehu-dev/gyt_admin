export interface GenreDTO {
  uuid: string;
  name: string;
  description: string;
  createdAt: string;
  formattedCreatedAt: string;
}

export interface PaginationDTO {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface GenresListDTO {
  items: GenreDTO[];
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

export const transformGenre = (genre: any): GenreDTO => {
  return {
    uuid: genre.uuid || '',
    name: genre.name || '',
    description: genre.description || '',
    createdAt: genre.createdAt || '',
    formattedCreatedAt: formatDate(genre.createdAt),
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

export const transformGenresListResponse = (response: any): GenresListDTO => {
  return {
    items: (response.data?.items || []).map(transformGenre),
    pagination: transformPagination(response.data?.pagination || {}),
  };
};
