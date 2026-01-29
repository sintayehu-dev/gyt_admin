import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TablePageTemplate from '../../../core/components/templates/TablePageTemplate';
import SearchInput from '../../../core/components/atoms/SearchInput';
import Button from '../../../core/components/atoms/Button';
import DataTable from '../../../core/components/organisms/DataTable';
import ActionButtons from '../../../core/components/molecules/ActionButtons';
import useMovies from '../hooks/useMovies';
import { MovieDTO } from '../api/movies.dto';
import { ROUTE_PATHS } from '../../../core/routes/routeNames';
import './MoviesPage.css';

const MoviesPage = () => {
  const navigate = useNavigate();
  const { 
    movies, 
    pagination, 
    isLoading, 
    error, 
    updateSearch, 
    updatePage, 
    updatePageSize 
  } = useMovies();

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    updateSearch(value);
  }, [updateSearch]);

  const handlePageChange = useCallback((page: number) => {
    updatePage(page);
  }, [updatePage]);

  const handlePageSizeChange = useCallback((size: number) => {
    updatePageSize(size);
  }, [updatePageSize]);

  const handleAddNew = useCallback(() => {
    console.log('Add new movie');
  }, []);

  const handleView = useCallback((movie: MovieDTO) => {
    navigate(ROUTE_PATHS.MOVIE_DETAIL.replace(':id', movie.uuid));
  }, [navigate]);

  const handleEdit = useCallback((movie: MovieDTO) => {
    console.log('Edit movie:', movie);
  }, []);

  const handleDelete = useCallback((movie: MovieDTO) => {
    console.log('Delete movie:', movie);
  }, []);

  const columns = useMemo(() => [
    {
      key: 'posterUrl',
      label: 'POSTER',
      render: (movie: MovieDTO) => (
        <div className="movies-page__poster">
          <img src={movie.posterUrl} alt={movie.title} />
        </div>
      ),
    },
    {
      key: 'title',
      label: 'TITLE',
      render: (movie: MovieDTO) => (
        <div className="movies-page__title-cell">
          <div className="movies-page__title">{movie.title}</div>
          <div className="movies-page__language">{movie.language}</div>
        </div>
      ),
    },
    {
      key: 'genres',
      label: 'GENRES',
      render: (movie: MovieDTO) => (
        <div className="movies-page__genres">
          {movie.genres.slice(0, 2).map((genre, index) => (
            <span key={index} className="movies-page__genre-badge">
              {genre}
            </span>
          ))}
          {movie.genres.length > 2 && (
            <span className="movies-page__genre-more">+{movie.genres.length - 2}</span>
          )}
        </div>
      ),
    },
    {
      key: 'releaseDate',
      label: 'RELEASE DATE',
      render: (movie: MovieDTO) => movie.formattedReleaseDate,
    },
    {
      key: 'directors',
      label: 'DIRECTOR',
      render: (movie: MovieDTO) => movie.directors[0] || '-',
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (movie: MovieDTO) => (
        <span className={`movies-page__status movies-page__status--${movie.isActive ? 'active' : 'inactive'}`}>
          {movie.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (movie: MovieDTO) => (
        <ActionButtons
          onView={() => handleView(movie)}
          onEdit={() => handleEdit(movie)}
          onDelete={() => handleDelete(movie)}
        />
      ),
    },
  ], [handleView, handleEdit, handleDelete]);

  const paginationData = useMemo(() => {
    if (!pagination) return null;
    
    return {
      page: pagination.page + 1,
      size: pagination.size,
      totalItems: pagination.totalItems,
      totalPages: pagination.totalPages,
    };
  }, [pagination]);

  const pageControls = useMemo(() => (
    <div className="movies-page__controls">
      <SearchInput
        placeholder="Search movies..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <Button variant="primary" onClick={handleAddNew}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span className="text-body-3">Add Movie</span>
      </Button>
    </div>
  ), [searchTerm, handleSearch, handleAddNew]);

  return (
    <TablePageTemplate
      title="Movies"
      pageControls={pageControls}
      table={
        <DataTable
          columns={columns}
          data={movies}
          isLoading={isLoading}
          error={error}
          pagination={paginationData}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No movies found"
        />
      }
    />
  );
};

export default MoviesPage;
