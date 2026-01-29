import { useState, useMemo, useCallback } from 'react';
import TablePageTemplate from '../../../core/components/templates/TablePageTemplate';
import SearchInput from '../../../core/components/atoms/SearchInput';
import Button from '../../../core/components/atoms/Button';
import DataTable from '../../../core/components/organisms/DataTable';
import ActionButtons from '../../../core/components/molecules/ActionButtons';
import Modal from '../../../core/components/molecules/Modal';
import ConfirmDialog from '../../../core/components/molecules/ConfirmDialog';
import AddStarForm, { StarFormData } from '../components/organisms/AddStarForm';
import EditStarForm, { UpdateStarFormData } from '../components/organisms/EditStarForm';
import useStars from '../hooks/useStars';
import { StarDTO } from '../api/stars.dto';
import { useToast } from '../../../core/context/ToastContext';
import './StarsPage.css';

const StarsPage = () => {
  const { 
    stars, 
    pagination, 
    isLoading, 
    error, 
    updateSearch, 
    updatePage, 
    updatePageSize,
    createStar,
    updateStar,
    deleteStar,
    isCreating,
    isUpdating,
    isDeleting,
  } = useStars();

  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStar, setSelectedStar] = useState<StarDTO | null>(null);

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
    setSelectedStar(null);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedStar(null);
  }, []);

  const handleSubmitStar = useCallback(async (starData: StarFormData) => {
    const result = await createStar(starData);
    
    if (result.success) {
      setIsAddModalOpen(false);
      showToast('Star created successfully', 'success');
    } else {
      showToast(`Failed to create star: ${result.error}`, 'error');
    }
  }, [createStar, showToast]);

  const handleSubmitEditStar = useCallback(async (starData: UpdateStarFormData) => {
    if (!selectedStar) return;
    
    const result = await updateStar(selectedStar.uuid, starData);
    
    if (result.success) {
      setIsEditModalOpen(false);
      setSelectedStar(null);
      showToast('Star updated successfully', 'success');
    } else {
      showToast(`Failed to update star: ${result.error}`, 'error');
    }
  }, [selectedStar, updateStar, showToast]);



  const handleEdit = useCallback((star: StarDTO) => {
    setSelectedStar(star);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((star: StarDTO) => {
    setSelectedStar(star);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedStar) return;
    
    const result = await deleteStar(selectedStar.uuid);
    
    if (result.success) {
      setIsDeleteDialogOpen(false);
      setSelectedStar(null);
      showToast('Star deleted successfully', 'success');
    } else {
      showToast(`Failed to delete star: ${result.error}`, 'error');
    }
  }, [selectedStar, deleteStar, showToast]);

  const columns = useMemo(() => [
    {
      key: 'name',
      label: 'NAME',
      render: (star: StarDTO) => (
        <div className="stars-page__name">
          {star.name}
        </div>
      ),
    },
    {
      key: 'biography',
      label: 'BIOGRAPHY',
      render: (star: StarDTO) => (
        <div className="stars-page__biography">
          {star.biography || '-'}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'CREATED AT',
      render: (star: StarDTO) => star.formattedCreatedAt,
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (star: StarDTO) => (
        <ActionButtons
          onEdit={() => handleEdit(star)}
          onDelete={() => handleDelete(star)}
        />
      ),
    },
  ], [handleEdit, handleDelete]);

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
    <div className="stars-page__controls">
      <SearchInput
        placeholder="Search stars..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <Button variant="primary" onClick={handleAddNew}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span className="text-body-3">Add Star</span>
      </Button>
    </div>
  ), [searchTerm, handleSearch, handleAddNew]);

  return (
    <>
      <TablePageTemplate
        title="Stars"
        pageControls={pageControls}
        table={
          <DataTable
            columns={columns}
            data={stars}
            isLoading={isLoading}
            error={error}
            pagination={paginationData}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            emptyMessage="No stars found"
          />
        }
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Add New Star"
        size="medium"
      >
        <AddStarForm
          onSubmit={handleSubmitStar}
          onCancel={handleCloseAddModal}
          isLoading={isCreating}
        />
      </Modal>

      {selectedStar && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          title="Edit Star"
          size="medium"
        >
          <EditStarForm
            star={selectedStar}
            onSubmit={handleSubmitEditStar}
            onCancel={handleCloseEditModal}
            isLoading={isUpdating}
          />
        </Modal>
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Star"
        message={
          selectedStar ? (
            <>
              Are you sure you want to delete <strong>"{selectedStar.name}"</strong>?
              <br />
              This action cannot be undone.
            </>
          ) : (
            'Are you sure you want to delete this star?'
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

export default StarsPage;
