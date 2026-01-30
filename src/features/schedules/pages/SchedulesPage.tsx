import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TablePageTemplate from '../../../core/components/templates/TablePageTemplate';
import SearchInput from '../../../core/components/atoms/SearchInput';
import Button from '../../../core/components/atoms/Button';
import DataTable from '../../../core/components/organisms/DataTable';
import ActionButtons from '../../../core/components/molecules/ActionButtons';
import Modal from '../../../core/components/molecules/Modal';
import ConfirmDialog from '../../../core/components/molecules/ConfirmDialog';
import AddScheduleForm, { ScheduleFormData } from '../components/organisms/AddScheduleForm';
import EditScheduleForm, { UpdateScheduleFormData } from '../components/organisms/EditScheduleForm';
import useSchedules from '../hooks/useSchedules';
import { ScheduleDTO } from '../api/schedules.dto';
import { useToast } from '../../../core/context/ToastContext';
import './SchedulesPage.css';

const SchedulesPage = () => {
  const navigate = useNavigate();
  const { 
    schedules, 
    pagination, 
    isLoading, 
    error, 
    updateSearch, 
    updatePage, 
    updatePageSize,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    isCreating,
    isUpdating,
    isDeleting,
  } = useSchedules();

  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleDTO | null>(null);

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
    setSelectedSchedule(null);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedSchedule(null);
  }, []);

  const handleSubmitSchedule = useCallback(async (scheduleData: ScheduleFormData) => {
    const result = await createSchedule(scheduleData);
    
    if (result.success) {
      setIsAddModalOpen(false);
      showToast('Schedule created successfully', 'success');
    } else {
      showToast(`Failed to create schedule: ${result.error}`, 'error');
    }
  }, [createSchedule, showToast]);

  const handleSubmitEditSchedule = useCallback(async (scheduleData: UpdateScheduleFormData) => {
    if (!selectedSchedule) return;
    
    const result = await updateSchedule(selectedSchedule.uuid, scheduleData);
    
    if (result.success) {
      setIsEditModalOpen(false);
      setSelectedSchedule(null);
      showToast('Schedule updated successfully', 'success');
    } else {
      showToast(`Failed to update schedule: ${result.error}`, 'error');
    }
  }, [selectedSchedule, updateSchedule, showToast]);

  const handleView = useCallback((schedule: ScheduleDTO) => {
    navigate(`/schedules/${schedule.uuid}`);
  }, [navigate]);

  const handleEdit = useCallback((schedule: ScheduleDTO) => {
    setSelectedSchedule(schedule);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((schedule: ScheduleDTO) => {
    setSelectedSchedule(schedule);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedSchedule) return;
    
    const result = await deleteSchedule(selectedSchedule.uuid);
    
    if (result.success) {
      setIsDeleteDialogOpen(false);
      setSelectedSchedule(null);
      showToast('Schedule deleted successfully', 'success');
    } else {
      showToast(`Failed to delete schedule: ${result.error}`, 'error');
    }
  }, [selectedSchedule, deleteSchedule, showToast]);

  const columns = useMemo(() => [
    {
      key: 'movie',
      label: 'MOVIE',
      render: (schedule: ScheduleDTO) => (
        <div className="schedules-page__hall">
          {schedule.movie.title}
        </div>
      ),
    },
    {
      key: 'cinemaHall',
      label: 'CINEMA HALL',
      render: (schedule: ScheduleDTO) => (
        <div className="schedules-page__hall">
          {schedule.cinemaHall}
        </div>
      ),
    },
    {
      key: 'showDate',
      label: 'DATE & TIME',
      render: (schedule: ScheduleDTO) => (
        <div className="schedules-page__date-time">
          <span className="schedules-page__date">{schedule.formattedShowDate}</span>
          <span className="schedules-page__time">
            {schedule.formattedShowTime} - {schedule.formattedEndTime}
          </span>
        </div>
      ),
    },
    {
      key: 'seats',
      label: 'SEATS',
      render: (schedule: ScheduleDTO) => (
        <div className="schedules-page__seats">
          <span className="schedules-page__seats-available">
            {schedule.availableSeats} available
          </span>
          <span className="schedules-page__seats-total">
            of {schedule.totalSeats} total
          </span>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'PRICE',
      render: (schedule: ScheduleDTO) => (
        <div className="schedules-page__price">
          ${schedule.price.toFixed(2)}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'CREATED AT',
      render: (schedule: ScheduleDTO) => schedule.formattedCreatedAt,
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (schedule: ScheduleDTO) => (
        <ActionButtons
          onView={() => handleView(schedule)}
          onEdit={() => handleEdit(schedule)}
          onDelete={() => handleDelete(schedule)}
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
    <div className="schedules-page__controls">
      <SearchInput
        placeholder="Search schedules..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <Button variant="primary" onClick={handleAddNew}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span className="text-body-3">Add Schedule</span>
      </Button>
    </div>
  ), [searchTerm, handleSearch, handleAddNew]);

  return (
    <>
      <TablePageTemplate
        title="Schedules"
        pageControls={pageControls}
        table={
          <DataTable
            columns={columns}
            data={schedules}
            isLoading={isLoading}
            error={error}
            pagination={paginationData}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onView={handleView}
            emptyMessage="No schedules found"
          />
        }
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Add New Schedule"
        size="medium"
      >
        <AddScheduleForm
          onSubmit={handleSubmitSchedule}
          onCancel={handleCloseAddModal}
          isLoading={isCreating}
        />
      </Modal>

      {selectedSchedule && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          title="Edit Schedule"
          size="medium"
        >
          <EditScheduleForm
            schedule={selectedSchedule}
            onSubmit={handleSubmitEditSchedule}
            onCancel={handleCloseEditModal}
            isLoading={isUpdating}
          />
        </Modal>
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Schedule"
        message={
          selectedSchedule ? (
            <>
              Are you sure you want to delete the schedule for <strong>"{selectedSchedule.cinemaHall}"</strong> on <strong>{selectedSchedule.formattedShowDate}</strong>?
              <br />
              This action cannot be undone.
            </>
          ) : (
            'Are you sure you want to delete this schedule?'
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

export default SchedulesPage;
