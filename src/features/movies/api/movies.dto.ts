export interface MovieDTO {
  uuid: string;
  title: string;
  description: string;
  durationMinutes: number;
  releaseDate: string;
  posterUrl: string;
  trailerUrl: string;
  language: string;
  isActive: boolean;
  genres: string[];
  directors: string[];
  stars: string[];
  createdAt: string;
  updatedAt: string;
  formattedReleaseDate: string;
  formattedDuration: string;
}

export interface PaginationDTO {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface MoviesListDTO {
  items: MovieDTO[];
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

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const transformMovie = (movie: any): MovieDTO => {
  console.log('[DTO] Input movie:', movie);
  console.log('[DTO] releaseDate:', movie.releaseDate);
  console.log('[DTO] durationMinutes:', movie.durationMinutes);
  
  const formatted = {
    uuid: movie.uuid || '',
    title: movie.title || '',
    description: movie.description || '',
    durationMinutes: movie.durationMinutes || 0,
    releaseDate: movie.releaseDate || '',
    posterUrl: movie.posterUrl || '',
    trailerUrl: movie.trailerUrl || '',
    language: movie.language || '',
    isActive: movie.isActive ?? true,
    genres: movie.genres || [],
    directors: movie.directors || [],
    stars: movie.stars || [],
    createdAt: movie.createdAt || '',
    updatedAt: movie.updatedAt || '',
    formattedReleaseDate: formatDate(movie.releaseDate),
    formattedDuration: formatDuration(movie.durationMinutes),
  };
  
  console.log('[DTO] Formatted movie:', formatted);
  console.log('[DTO] formattedReleaseDate:', formatted.formattedReleaseDate);
  console.log('[DTO] formattedDuration:', formatted.formattedDuration);
  
  return formatted;
};

export const transformPagination = (pagination: any): PaginationDTO => {
  return {
    page: pagination.page || 0,
    size: pagination.size || 5,
    totalItems: pagination.totalItems || 0,
    totalPages: pagination.totalPages || 0,
  };
};

export const transformMoviesListResponse = (response: any): MoviesListDTO => {
  return {
    items: (response.data?.items || []).map(transformMovie),
    pagination: transformPagination(response.data?.pagination || {}),
  };
};
