export interface StarDTO {
  uuid: string;
  name: string;
  biography: string;
  createdAt: string;
  formattedCreatedAt: string;
}

export interface PaginationDTO {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface StarsListDTO {
  items: StarDTO[];
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

export const transformStar = (star: any): StarDTO => {
  return {
    uuid: star.uuid || '',
    name: star.name || '',
    biography: star.biography || '',
    createdAt: star.createdAt || '',
    formattedCreatedAt: formatDate(star.createdAt),
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

export const transformStarsListResponse = (response: any): StarsListDTO => {
  return {
    items: (response.data?.items || []).map(transformStar),
    pagination: transformPagination(response.data?.pagination || {}),
  };
};
