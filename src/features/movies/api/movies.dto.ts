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

// Helper function to extract names from array (handles both string[] and object[] formats)
const extractNames = (items: any[]): string[] => {
  if (!items || !Array.isArray(items)) return [];
  
  return items.map(item => {
    // If item is already a string, return it
    if (typeof item === 'string') return item;
    // If item is an object with a name property, extract the name
    if (item && typeof item === 'object' && item.name) return item.name;
    // Fallback
    return '';
  }).filter(name => name !== '');
};

export const transformMovie = (movie: any): MovieDTO => {
  console.log('[DTO] Input movie:', movie);
  console.log('[DTO] genres:', movie.genres);
  console.log('[DTO] directors:', movie.directors);
  console.log('[DTO] stars:', movie.stars);
  
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
    genres: extractNames(movie.genres || []),
    directors: extractNames(movie.directors || []),
    stars: extractNames(movie.stars || []),
    createdAt: movie.createdAt || '',
    updatedAt: movie.updatedAt || '',
    formattedReleaseDate: formatDate(movie.releaseDate),
    formattedDuration: formatDuration(movie.durationMinutes),
  };
  
  console.log('[DTO] Formatted movie:', formatted);
  console.log('[DTO] Extracted genres:', formatted.genres);
  console.log('[DTO] Extracted directors:', formatted.directors);
  console.log('[DTO] Extracted stars:', formatted.stars);
  
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
