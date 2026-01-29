import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TablePageTemplate from '../../../core/components/templates/TablePageTemplate';
import SearchInput from '../../../core/components/atoms/SearchInput';
import Button from '../../../core/components/atoms/Button';
import DataTable from '../../../core/components/organisms/DataTable';
import ActionButtons from '../../../core/components/molecules/ActionButtons';
import Modal from '../../../core/components/molecules/Modal';
import ConfirmDialog from '../../../core/components/molecules/ConfirmDialog';
import AddMovieForm, { MovieFormData } from '../components/organisms/AddMovieForm';
import EditMovieForm, { UpdateMovieFormData } from '../components/organisms/EditMovieForm';
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
    updatePageSize,
    createMovie,
    updateMovie,
    deleteMovie,
    isCreating,
    isUpdating,
    isDeleting,
  } = useMovies();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieDTO | null>(null);

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
    setIsAddModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedMovie(null);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedMovie(null);
  }, []);

  const handleSubmitMovie = useCallback(async (movieData: MovieFormData) => {
    const result = await createMovie(movieData);
    
    if (result.success) {
      setIsAddModalOpen(false);
      console.log('Movie created successfully:', result.data);
    } else {
      console.error('Failed to create movie:', result.error);
      alert(`Failed to create movie: ${result.error}`);
    }
  }, [createMovie]);

  const handleSubmitEditMovie = useCallback(async (movieData: UpdateMovieFormData) => {
    if (!selectedMovie) return;
    
    const result = await updateMovie(selectedMovie.uuid, movieData);
    
    if (result.success) {
      setIsEditModalOpen(false);
      setSelectedMovie(null);
      console.log('Movie updated successfully:', result.data);
    } else {
      console.error('Failed to update movie:', result.error);
      alert(`Failed to update movie: ${result.error}`);
    }
  }, [selectedMovie, updateMovie]);

  const handleView = useCallback((movie: MovieDTO) => {
    navigate(ROUTE_PATHS.MOVIE_DETAIL.replace(':id', movie.uuid));
  }, [navigate]);

  const handleEdit = useCallback((movie: MovieDTO) => {
    setSelectedMovie(movie);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((movie: MovieDTO) => {
    setSelectedMovie(movie);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedMovie) return;
    
    const result = await deleteMovie(selectedMovie.uuid);
    
    if (result.success) {
      setIsDeleteDialogOpen(false);
      setSelectedMovie(null);
      console.log('Movie deleted successfully');
    } else {
      console.error('Failed to delete movie:', result.error);
      alert(`Failed to delete movie: ${result.error}`);
    }
  }, [selectedMovie, deleteMovie]);

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
    <>
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

      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Add New Movie"
        size="large"
      >
        <AddMovieForm
          onSubmit={handleSubmitMovie}
          onCancel={handleCloseAddModal}
          isLoading={isCreating}
        />
      </Modal>

      {selectedMovie && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          title="Edit Movie"
          size="large"
        >
          <EditMovieForm
            movie={selectedMovie}
            onSubmit={handleSubmitEditMovie}
            onCancel={handleCloseEditModal}
            isLoading={isUpdating}
          />
        </Modal>
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Movie"
        message={
          selectedMovie ? (
            <>
              Are you sure you want to delete <strong>"{selectedMovie.title}"</strong>?
              <br />
              This action cannot be undone.
            </>
          ) : (
            'Are you sure you want to delete this movie?'
          )
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
};

export default MoviesPage;
