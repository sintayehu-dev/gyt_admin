export interface DirectorDTO {
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

export interface DirectorsListDTO {
  items: DirectorDTO[];
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

export const transformDirector = (director: any): DirectorDTO => {
  return {
    uuid: director.uuid || '',
    name: director.name || '',
    biography: director.biography || '',
    createdAt: director.createdAt || '',
    formattedCreatedAt: formatDate(director.createdAt),
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

export const transformDirectorsListResponse = (response: any): DirectorsListDTO => {
  return {
    items: (response.data?.items || []).map(transformDirector),
    pagination: transformPagination(response.data?.pagination || {}),
  };
};
