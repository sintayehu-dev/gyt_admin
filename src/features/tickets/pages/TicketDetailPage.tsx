import { useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../../core/components/atoms/LoadingSpinner';
import Button from '../../../core/components/atoms/Button';
import { ROUTE_PATHS } from '../../../core/routes/routeNames';
import useTicketDetail from '../hooks/useTicketDetail';
import './TicketDetailPage.css';

const TicketDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: ticketData, isLoading, error, refetch } = useTicketDetail(id);

  const handleBack = useCallback(() => {
    navigate(ROUTE_PATHS.TICKETS);
  }, [navigate]);

  const transformedTicketData = useMemo(() => {
    if (!ticketData) return null;

    return {
      uuid: ticketData.uuid || '',
      seatNumber: ticketData.seatNumber || 'N/A',
      price: ticketData.price || 0,
      status: ticketData.status || 'PENDING',
      bookingTime: ticketData.formattedBookingDate || 'N/A',
      paymentTime: ticketData.formattedPaymentDate || 'N/A',
      paymentId: ticketData.paymentId || 'N/A',
      user: {
        name: ticketData.user?.name || 'N/A',
        email: ticketData.user?.email || 'N/A',
        uuid: ticketData.user?.uuid || '',
      },
      schedule: {
        cinemaHall: ticketData.schedule?.cinemaHall || 'N/A',
        showDate: ticketData.schedule?.showDate || 'N/A',
        showTime: ticketData.schedule?.showTime || 'N/A',
        endTime: ticketData.schedule?.endTime || 'N/A',
        totalSeats: ticketData.schedule?.totalSeats || 0,
        availableSeats: ticketData.schedule?.availableSeats || 0,
      },
      movie: {
        title: ticketData.schedule?.movie?.title || 'N/A',
        description: ticketData.schedule?.movie?.description || 'N/A',
        language: ticketData.schedule?.movie?.language || 'N/A',
        posterUrl: ticketData.schedule?.movie?.posterUrl || '',
        trailerUrl: ticketData.schedule?.movie?.trailerUrl || '',
      },
    };
  }, [ticketData]);

  if (isLoading) {
    return (
      <div className="ticket-detail-page">
        <div className="ticket-detail-page__header">
          <div className="ticket-detail-page__header-left">
            <button className="ticket-detail-page__back-btn" onClick={handleBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h1 className="ticket-detail-page__title text-h5">Ticket Details</h1>
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
      <div className="ticket-detail-page">
        <div className="ticket-detail-page__header">
          <div className="ticket-detail-page__header-left">
            <button className="ticket-detail-page__back-btn" onClick={handleBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h1 className="ticket-detail-page__title text-h5">Ticket Details</h1>
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

  if (!transformedTicketData) {
    return (
      <div className="ticket-detail-page">
        <div className="ticket-detail-page__header">
          <div className="ticket-detail-page__header-left">
            <button className="ticket-detail-page__back-btn" onClick={handleBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h1 className="ticket-detail-page__title text-h5">Ticket Details</h1>
          </div>
        </div>
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ color: '#6B7280', fontSize: '1rem' }}>No ticket data found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-detail-page">
      {/* Header */}
      <div className="ticket-detail-page__header">
        <div className="ticket-detail-page__header-left">
          <button className="ticket-detail-page__back-btn" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="ticket-detail-page__header-info">
            <h1 className="ticket-detail-page__title text-h5">Ticket Details</h1>
            <div className="ticket-detail-page__breadcrumb">
              <span className="ticket-detail-page__breadcrumb-item text-body-3">Tickets</span>
              <span className="ticket-detail-page__breadcrumb-separator">›</span>
              <span className="ticket-detail-page__breadcrumb-item ticket-detail-page__breadcrumb-item--active text-body-3">
                Seat {transformedTicketData.seatNumber}
              </span>
            </div>
          </div>
        </div>
        <div className="ticket-detail-page__header-status">
          <span className={`ticket-detail-page__status-badge ticket-detail-page__status-badge--${transformedTicketData.status.toLowerCase()}`}>
            {transformedTicketData.status}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="ticket-detail-page__content">
        <div className="ticket-detail-page__main">
          {/* Movie Poster */}
          <div className="ticket-detail-page__poster-section">
            {transformedTicketData.movie.posterUrl ? (
              <img
                src={transformedTicketData.movie.posterUrl}
                alt={transformedTicketData.movie.title}
                className="ticket-detail-page__poster"
              />
            ) : (
              <div className="ticket-detail-page__poster-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
          </div>

          {/* Ticket Information */}
          <div className="ticket-detail-page__info-section">
            {/* Ticket Info Card */}
            <div className="ticket-detail-page__info-card">
              <h2 className="ticket-detail-page__section-title text-h6">Ticket Information</h2>
              
              <div className="ticket-detail-page__info-grid">
                <div className="ticket-detail-page__info-item">
                  <span className="ticket-detail-page__info-label text-body-4">Seat Number</span>
                  <span className="ticket-detail-page__info-value ticket-detail-page__seat-number">{transformedTicketData.seatNumber}</span>
                </div>

                <div className="ticket-detail-page__info-item">
                  <span className="ticket-detail-page__info-label text-body-4">Price</span>
                  <span className="ticket-detail-page__info-value ticket-detail-page__price">${transformedTicketData.price.toFixed(2)}</span>
                </div>

                <div className="ticket-detail-page__info-item">
                  <span className="ticket-detail-page__info-label text-body-4">Booking Time</span>
                  <span className="ticket-detail-page__info-value text-body-3">{transformedTicketData.bookingTime}</span>
                </div>

                <div className="ticket-detail-page__info-item">
                  <span className="ticket-detail-page__info-label text-body-4">Payment Time</span>
                  <span className="ticket-detail-page__info-value text-body-3">{transformedTicketData.paymentTime}</span>
                </div>

                {transformedTicketData.paymentId !== 'N/A' && (
                  <div className="ticket-detail-page__info-item ticket-detail-page__info-item--full">
                    <span className="ticket-detail-page__info-label text-body-4">Payment ID</span>
                    <span className="ticket-detail-page__info-value text-body-3">{transformedTicketData.paymentId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Info Card */}
            <div className="ticket-detail-page__info-card">
              <h2 className="ticket-detail-page__section-title text-h6">Customer Information</h2>
              
              <div className="ticket-detail-page__info-grid">
                <div className="ticket-detail-page__info-item">
                  <span className="ticket-detail-page__info-label text-body-4">Name</span>
                  <span className="ticket-detail-page__info-value text-body-3">{transformedTicketData.user.name}</span>
                </div>

                <div className="ticket-detail-page__info-item">
                  <span className="ticket-detail-page__info-label text-body-4">Email</span>
                  <span className="ticket-detail-page__info-value text-body-3">{transformedTicketData.user.email}</span>
                </div>
              </div>
            </div>

            {/* Movie Info Card */}
            <div className="ticket-detail-page__info-card">
              <h2 className="ticket-detail-page__section-title text-h6">Movie Information</h2>
              
              <div className="ticket-detail-page__info-grid">
                <div className="ticket-detail-page__info-item ticket-detail-page__info-item--full">
                  <span className="ticket-detail-page__info-label text-body-4">Title</span>
                  <span className="ticket-detail-page__info-value text-body-3">{transformedTicketData.movie.title}</span>
                </div>

                <div className="ticket-detail-page__info-item ticket-detail-page__info-item--full">
                  <span className="ticket-detail-page__info-label text-body-4">Description</span>
                  <p className="ticket-detail-page__description text-body-3">{transformedTicketData.movie.description}</p>
                </div>

                <div className="ticket-detail-page__info-item">
                  <span className="ticket-detail-page__info-label text-body-4">Language</span>
                  <span className="ticket-detail-page__info-value text-body-3">{transformedTicketData.movie.language}</span>
                </div>
              </div>
            </div>

            {/* Schedule Info Card */}
            <div className="ticket-detail-page__info-card">
              <h2 className="ticket-detail-page__section-title text-h6">Schedule Information</h2>
              
              <div className="ticket-detail-page__info-grid">
                <div className="ticket-detail-page__info-item">
                  <span className="ticket-detail-page__info-label text-body-4">Cinema Hall</span>
                  <span className="ticket-detail-page__info-value text-body-3">{transformedTicketData.schedule.cinemaHall}</span>
                </div>

                <div className="ticket-detail-page__info-item">
                  <span className="ticket-detail-page__info-label text-body-4">Show Date</span>
                  <span className="ticket-detail-page__info-value text-body-3">{transformedTicketData.schedule.showDate}</span>
                </div>

                <div className="ticket-detail-page__info-item">
                  <span className="ticket-detail-page__info-label text-body-4">Show Time</span>
                  <span className="ticket-detail-page__info-value text-body-3">{transformedTicketData.schedule.showTime}</span>
                </div>

                <div className="ticket-detail-page__info-item">
                  <span className="ticket-detail-page__info-label text-body-4">End Time</span>
                  <span className="ticket-detail-page__info-value text-body-3">{transformedTicketData.schedule.endTime}</span>
                </div>

                <div className="ticket-detail-page__info-item">
                  <span className="ticket-detail-page__info-label text-body-4">Total Seats</span>
                  <span className="ticket-detail-page__info-value text-body-3">{transformedTicketData.schedule.totalSeats}</span>
                </div>

                <div className="ticket-detail-page__info-item">
                  <span className="ticket-detail-page__info-label text-body-4">Available Seats</span>
                  <span className="ticket-detail-page__info-value text-body-3">{transformedTicketData.schedule.availableSeats}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
