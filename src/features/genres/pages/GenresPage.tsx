import { useState, useMemo, useCallback } from 'react';
import TablePageTemplate from '../../../core/components/templates/TablePageTemplate';
import SearchInput from '../../../core/components/atoms/SearchInput';
import Button from '../../../core/components/atoms/Button';
import DataTable from '../../../core/components/organisms/DataTable';
import ActionButtons from '../../../core/components/molecules/ActionButtons';
import Modal from '../../../core/components/molecules/Modal';
import ConfirmDialog from '../../../core/components/molecules/ConfirmDialog';
import AddGenreForm, { GenreFormData } from '../components/organisms/AddGenreForm';
import EditGenreForm, { UpdateGenreFormData } from '../components/organisms/EditGenreForm';
import useGenres from '../hooks/useGenres';
import { GenreDTO } from '../api/genres.dto';
import './GenresPage.css';

const GenresPage = () => {
  const { 
    genres, 
    pagination, 
    isLoading, 
    error, 
    updateSearch, 
    updatePage, 
    updatePageSize,
    createGenre,
    updateGenre,
    deleteGenre,
    isCreating,
    isUpdating,
    isDeleting,
  } = useGenres();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<GenreDTO | null>(null);

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
    setSelectedGenre(null);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedGenre(null);
  }, []);

  const handleSubmitGenre = useCallback(async (genreData: GenreFormData) => {
    const result = await createGenre(genreData);
    
    if (result.success) {
      setIsAddModalOpen(false);
    } else {
      alert(`Failed to create genre: ${result.error}`);
    }
  }, [createGenre]);

  const handleSubmitEditGenre = useCallback(async (genreData: UpdateGenreFormData) => {
    if (!selectedGenre) return;
    
    const result = await updateGenre(selectedGenre.uuid, genreData);
    
    if (result.success) {
      setIsEditModalOpen(false);
      setSelectedGenre(null);
    } else {
      alert(`Failed to update genre: ${result.error}`);
    }
  }, [selectedGenre, updateGenre]);

  const handleView = useCallback((genre: GenreDTO) => {
    setSelectedGenre(genre);
    setIsEditModalOpen(true);
  }, []);

  const handleEdit = useCallback((genre: GenreDTO) => {
    setSelectedGenre(genre);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((genre: GenreDTO) => {
    setSelectedGenre(genre);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedGenre) return;
    
    const result = await deleteGenre(selectedGenre.uuid);
    
    if (result.success) {
      setIsDeleteDialogOpen(false);
      setSelectedGenre(null);
    } else {
      alert(`Failed to delete genre: ${result.error}`);
    }
  }, [selectedGenre, deleteGenre]);

  const columns = useMemo(() => [
    {
      key: 'name',
      label: 'NAME',
      render: (genre: GenreDTO) => (
        <div className="genres-page__name">
          {genre.name}
        </div>
      ),
    },
    {
      key: 'description',
      label: 'DESCRIPTION',
      render: (genre: GenreDTO) => (
        <div className="genres-page__description">
          {genre.description || '-'}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'CREATED AT',
      render: (genre: GenreDTO) => genre.formattedCreatedAt,
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (genre: GenreDTO) => (
        <ActionButtons
          onView={() => handleView(genre)}
          onEdit={() => handleEdit(genre)}
          onDelete={() => handleDelete(genre)}
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
    <div className="genres-page__controls">
      <SearchInput
        placeholder="Search genres..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <Button variant="primary" onClick={handleAddNew}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span className="text-body-3">Add Genre</span>
      </Button>
    </div>
  ), [searchTerm, handleSearch, handleAddNew]);

  return (
    <>
      <TablePageTemplate
        title="Genres"
        pageControls={pageControls}
        table={
          <DataTable
            columns={columns}
            data={genres}
            isLoading={isLoading}
            error={error}
            pagination={paginationData}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No genres found"
          />
        }
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Add New Genre"
        size="medium"
      >
        <AddGenreForm
          onSubmit={handleSubmitGenre}
          onCancel={handleCloseAddModal}
          isLoading={isCreating}
        />
      </Modal>

      {selectedGenre && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          title="Edit Genre"
          size="medium"
        >
          <EditGenreForm
            genre={selectedGenre}
            onSubmit={handleSubmitEditGenre}
            onCancel={handleCloseEditModal}
            isLoading={isUpdating}
          />
        </Modal>
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Genre"
        message={
          selectedGenre ? (
            <>
              Are you sure you want to delete <strong>"{selectedGenre.name}"</strong>?
              <br />
              This action cannot be undone.
            </>
          ) : (
            'Are you sure you want to delete this genre?'
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

export default GenresPage;
