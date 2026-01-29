import { useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../../core/components/atoms/LoadingSpinner';
import Button from '../../../core/components/atoms/Button';
import Modal from '../../../core/components/molecules/Modal';
import ConfirmDialog from '../../../core/components/molecules/ConfirmDialog';
import EditScheduleForm, { UpdateScheduleFormData } from '../components/organisms/EditScheduleForm';
import { ROUTE_PATHS } from '../../../core/routes/routeNames';
import useScheduleDetail from '../hooks/useScheduleDetail';
import useSchedules from '../hooks/useSchedules';
import { useToast } from '../../../core/context/ToastContext';
import './ScheduleDetailPage.css';

const ScheduleDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { schedule: scheduleData, isLoading, error, refetch } = useScheduleDetail(id || '');
  const { updateSchedule, deleteSchedule, isUpdating, isDeleting } = useSchedules();
  const { showToast } = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleBack = () => {
    navigate(ROUTE_PATHS.SCHEDULES);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const handleSubmitEditSchedule = useCallback(async (formData: UpdateScheduleFormData) => {
    if (!id) return;
    
    const result = await updateSchedule(id, formData);
    
    if (result.success) {
      setIsEditModalOpen(false);
      refetch();
      showToast('Schedule updated successfully', 'success');
    } else {
      showToast(`Failed to update schedule: ${result.error}`, 'error');
    }
  }, [id, updateSchedule, refetch, showToast]);

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!id) return;
    
    const result = await deleteSchedule(id);
    
    if (result.success) {
      showToast('Schedule deleted successfully', 'success');
      navigate(ROUTE_PATHS.SCHEDULES);
    } else {
      showToast(`Failed to delete schedule: ${result.error}`, 'error');
      setIsDeleteDialogOpen(false);
    }
  }, [id, deleteSchedule, navigate, showToast]);

  const transformedScheduleData = useMemo(() => {
    if (!scheduleData) {
      return null;
    }

    const availablePercentage = scheduleData.totalSeats > 0 
      ? (scheduleData.availableSeats / scheduleData.totalSeats) * 100 
      : 0;

    return {
      uuid: scheduleData.uuid || '',
      movieUuid: scheduleData.movieUuid || 'N/A',
      cinemaHall: scheduleData.cinemaHall || 'N/A',
      showDate: scheduleData.formattedShowDate || 'N/A',
      showTime: scheduleData.formattedShowTime || 'N/A',
      endTime: scheduleData.formattedEndTime || 'N/A',
      totalSeats: scheduleData.totalSeats || 0,
      availableSeats: scheduleData.availableSeats || 0,
      bookedSeats: (scheduleData.totalSeats || 0) - (scheduleData.availableSeats || 0),
      availablePercentage,
      price: scheduleData.price || 0,
      isActive: scheduleData.isActive ?? false,
      createdAt: scheduleData.formattedCreatedAt || 'N/A',
    };
  }, [scheduleData]);

  if (isLoading) {
    return (
      <div className="schedule-detail-page">
        <div className="schedule-detail-page__header">
          <div className="schedule-detail-page__header-left">
            <button className="schedule-detail-page__back-btn" onClick={handleBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="schedule-detail-page__header-info">
              <h1 className="schedule-detail-page__title text-h5">Schedule Details</h1>
            </div>
          </div>
        </div>
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="schedule-detail-page">
        <div className="schedule-detail-page__header">
          <div className="schedule-detail-page__header-left">
            <button className="schedule-detail-page__back-btn" onClick={handleBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="schedule-detail-page__header-info">
              <h1 className="schedule-detail-page__title text-h5">Schedule Details</h1>
            </div>
          </div>
        </div>
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ color: '#DC2626', marginBottom: '1rem', fontSize: '1rem' }}>
            {error}
          </div>
          <Button variant="primary" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!transformedScheduleData) {
    return (
      <div className="schedule-detail-page">
        <div className="schedule-detail-page__header">
          <div className="schedule-detail-page__header-left">
            <button className="schedule-detail-page__back-btn" onClick={handleBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="schedule-detail-page__header-info">
              <h1 className="schedule-detail-page__title text-h5">Schedule Details</h1>
            </div>
          </div>
        </div>
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ color: '#6B7280', fontSize: '1rem' }}>No schedule data found</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="schedule-detail-page">
        {/* Header */}
        <div className="schedule-detail-page__header">
          <div className="schedule-detail-page__header-left">
            <button className="schedule-detail-page__back-btn" onClick={handleBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="schedule-detail-page__header-info">
              <h1 className="schedule-detail-page__title text-h5">Schedule Details</h1>
              <div className="schedule-detail-page__breadcrumb">
                <span className="schedule-detail-page__breadcrumb-item text-body-3">Schedules</span>
                <span className="schedule-detail-page__breadcrumb-separator">›</span>
                <span className="schedule-detail-page__breadcrumb-item schedule-detail-page__breadcrumb-item--active text-body-3">
                  {transformedScheduleData.cinemaHall} - {transformedScheduleData.showDate}
                </span>
              </div>
            </div>
          </div>
          <div className="schedule-detail-page__header-actions">
            <Button variant="secondary" onClick={handleEdit} disabled={isDeleting}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span className="text-body-3">Edit</span>
            </Button>
            <Button variant="secondary" onClick={handleDelete} disabled={isDeleting}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span className="text-body-3">Delete</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="schedule-detail-page__content">
          <div className="schedule-detail-page__main">
            <div className="schedule-detail-page__info-card">
              <h2 className="schedule-detail-page__section-title text-h6">Schedule Information</h2>
              
              <div className="schedule-detail-page__info-grid">
                <div className="schedule-detail-page__info-item">
                  <span className="schedule-detail-page__info-label text-body-4">Cinema Hall</span>
                  <span className="schedule-detail-page__info-value text-body-3">{transformedScheduleData.cinemaHall}</span>
                </div>

                <div className="schedule-detail-page__info-item">
                  <span className="schedule-detail-page__info-label text-body-4">Status</span>
                  <span className={`schedule-detail-page__status schedule-detail-page__status--${transformedScheduleData.isActive ? 'active' : 'inactive'}`}>
                    {transformedScheduleData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="schedule-detail-page__info-item">
                  <span className="schedule-detail-page__info-label text-body-4">Show Date</span>
                  <span className="schedule-detail-page__info-value text-body-3">{transformedScheduleData.showDate}</span>
                </div>

                <div className="schedule-detail-page__info-item">
                  <span className="schedule-detail-page__info-label text-body-4">Show Time</span>
                  <span className="schedule-detail-page__info-value text-body-3">
                    {transformedScheduleData.showTime} - {transformedScheduleData.endTime}
                  </span>
                </div>

                <div className="schedule-detail-page__info-item">
                  <span className="schedule-detail-page__info-label text-body-4">Price</span>
                  <span className="schedule-detail-page__price">${transformedScheduleData.price.toFixed(2)}</span>
                </div>

                <div className="schedule-detail-page__info-item">
                  <span className="schedule-detail-page__info-label text-body-4">Created At</span>
                  <span className="schedule-detail-page__info-value text-body-3">{transformedScheduleData.createdAt}</span>
                </div>
              </div>
            </div>

            <div className="schedule-detail-page__info-card">
              <h2 className="schedule-detail-page__section-title text-h6">Seat Availability</h2>
              
              <div className="schedule-detail-page__seats">
                <div className="schedule-detail-page__seats-bar">
                  <div 
                    className="schedule-detail-page__seats-fill" 
                    style={{ width: `${transformedScheduleData.availablePercentage}%` }}
                  />
                </div>
                <div className="schedule-detail-page__info-grid">
                  <div className="schedule-detail-page__info-item">
                    <span className="schedule-detail-page__info-label text-body-4">Available Seats</span>
                    <span className="schedule-detail-page__info-value text-body-3" style={{ color: 'var(--color-success)' }}>
                      {transformedScheduleData.availableSeats}
                    </span>
                  </div>

                  <div className="schedule-detail-page__info-item">
                    <span className="schedule-detail-page__info-label text-body-4">Booked Seats</span>
                    <span className="schedule-detail-page__info-value text-body-3" style={{ color: '#EF4444' }}>
                      {transformedScheduleData.bookedSeats}
                    </span>
                  </div>

                  <div className="schedule-detail-page__info-item">
                    <span className="schedule-detail-page__info-label text-body-4">Total Seats</span>
                    <span className="schedule-detail-page__info-value text-body-3">
                      {transformedScheduleData.totalSeats}
                    </span>
                  </div>

                  <div className="schedule-detail-page__info-item">
                    <span className="schedule-detail-page__info-label text-body-4">Occupancy Rate</span>
                    <span className="schedule-detail-page__info-value text-body-3">
                      {(100 - transformedScheduleData.availablePercentage).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {scheduleData && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          title="Edit Schedule"
          size="medium"
        >
          <EditScheduleForm
            schedule={scheduleData}
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
          <>
            Are you sure you want to delete the schedule for <strong>"{transformedScheduleData.cinemaHall}"</strong> on <strong>{transformedScheduleData.showDate}</strong>?
            <br />
            This action cannot be undone and you will be redirected to the schedules list.
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
};

export default ScheduleDetailPage;
