import { useState, useMemo, useCallback } from 'react';
import TablePageTemplate from '../../../core/components/templates/TablePageTemplate';
import SearchInput from '../../../core/components/atoms/SearchInput';
import Button from '../../../core/components/atoms/Button';
import DataTable from '../../../core/components/organisms/DataTable';
import ActionButtons from '../../../core/components/molecules/ActionButtons';
import Modal from '../../../core/components/molecules/Modal';
import ConfirmDialog from '../../../core/components/molecules/ConfirmDialog';
import AddDirectorForm, { DirectorFormData } from '../components/organisms/AddDirectorForm';
import EditDirectorForm, { UpdateDirectorFormData } from '../components/organisms/EditDirectorForm';
import useDirectors from '../hooks/useDirectors';
import { DirectorDTO } from '../api/directors.dto';
import './DirectorsPage.css';

const DirectorsPage = () => {
  const { 
    directors, 
    pagination, 
    isLoading, 
    error, 
    updateSearch, 
    updatePage, 
    updatePageSize,
    createDirector,
    updateDirector,
    deleteDirector,
    isCreating,
    isUpdating,
    isDeleting,
  } = useDirectors();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDirector, setSelectedDirector] = useState<DirectorDTO | null>(null);

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
    setSelectedDirector(null);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedDirector(null);
  }, []);

  const handleSubmitDirector = useCallback(async (directorData: DirectorFormData) => {
    const result = await createDirector(directorData);
    
    if (result.success) {
      setIsAddModalOpen(false);
    } else {
      alert(`Failed to create director: ${result.error}`);
    }
  }, [createDirector]);

  const handleSubmitEditDirector = useCallback(async (directorData: UpdateDirectorFormData) => {
    if (!selectedDirector) return;
    
    const result = await updateDirector(selectedDirector.uuid, directorData);
    
    if (result.success) {
      setIsEditModalOpen(false);
      setSelectedDirector(null);
    } else {
      alert(`Failed to update director: ${result.error}`);
    }
  }, [selectedDirector, updateDirector]);

  const handleView = useCallback((director: DirectorDTO) => {
    setSelectedDirector(director);
    setIsEditModalOpen(true);
  }, []);

  const handleEdit = useCallback((director: DirectorDTO) => {
    setSelectedDirector(director);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((director: DirectorDTO) => {
    setSelectedDirector(director);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedDirector) return;
    
    const result = await deleteDirector(selectedDirector.uuid);
    
    if (result.success) {
      setIsDeleteDialogOpen(false);
      setSelectedDirector(null);
    } else {
      alert(`Failed to delete director: ${result.error}`);
    }
  }, [selectedDirector, deleteDirector]);

  const columns = useMemo(() => [
    {
      key: 'name',
      label: 'NAME',
      render: (director: DirectorDTO) => (
        <div className="directors-page__name">
          {director.name}
        </div>
      ),
    },
    {
      key: 'biography',
      label: 'BIOGRAPHY',
      render: (director: DirectorDTO) => (
        <div className="directors-page__biography">
          {director.biography || '-'}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'CREATED AT',
      render: (director: DirectorDTO) => director.formattedCreatedAt,
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (director: DirectorDTO) => (
        <ActionButtons
          onView={() => handleView(director)}
          onEdit={() => handleEdit(director)}
          onDelete={() => handleDelete(director)}
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
    <div className="directors-page__controls">
      <SearchInput
        placeholder="Search directors..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <Button variant="primary" onClick={handleAddNew}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span className="text-body-3">Add Director</span>
      </Button>
    </div>
  ), [searchTerm, handleSearch, handleAddNew]);

  return (
    <>
      <TablePageTemplate
        title="Directors"
        pageControls={pageControls}
        table={
          <DataTable
            columns={columns}
            data={directors}
            isLoading={isLoading}
            error={error}
            pagination={paginationData}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No directors found"
          />
        }
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Add New Director"
        size="medium"
      >
        <AddDirectorForm
          onSubmit={handleSubmitDirector}
          onCancel={handleCloseAddModal}
          isLoading={isCreating}
        />
      </Modal>

      {selectedDirector && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          title="Edit Director"
          size="medium"
        >
          <EditDirectorForm
            director={selectedDirector}
            onSubmit={handleSubmitEditDirector}
            onCancel={handleCloseEditModal}
            isLoading={isUpdating}
          />
        </Modal>
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Director"
        message={
          selectedDirector ? (
            <>
              Are you sure you want to delete <strong>"{selectedDirector.name}"</strong>?
              <br />
              This action cannot be undone.
            </>
          ) : (
            'Are you sure you want to delete this director?'
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

export default DirectorsPage;
