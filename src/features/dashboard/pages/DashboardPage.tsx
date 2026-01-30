import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../core/components/atoms/LoadingSpinner';
import { ROUTE_PATHS } from '../../../core/routes/routeNames';
import useDashboard from '../hooks/useDashboard';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useDashboard();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const statCards = [
    {
      title: 'Weekly Revenue',
      value: data ? formatCurrency(data.stats.weeklyRevenue) : '$0',
      change: '+12.5%',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
      bgColor: '#D1FAE5',
      iconColor: '#10B981',
      changeColor: '#10B981'
    },
    {
      title: 'Tickets Sold',
      value: data ? data.stats.ticketsSold.toLocaleString() : '0',
      change: '+8%',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 1 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 1 1 0-4V7a2 2 0 0 0-2-2H5z" />
        </svg>
      ),
      bgColor: '#E9D5FF',
      iconColor: '#8B5CF6',
      changeColor: '#8B5CF6'
    },
    {
      title: 'Active Movies',
      value: data ? data.stats.activeMovies.toString() : '0',
      change: '0%',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          <line x1="7" y1="2" x2="7" y2="22" />
          <line x1="17" y1="2" x2="17" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
      ),
      bgColor: '#DBEAFE',
      iconColor: '#3B82F6',
      changeColor: '#6B7280'
    },
    {
      title: 'Total Halls',
      value: data ? data.stats.totalHalls.toString() : '0',
      change: '-2%',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      bgColor: '#FED7AA',
      iconColor: '#F97316',
      changeColor: '#EF4444'
    },
  ];

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S'];

  const handleCreateSchedule = () => {
    navigate(ROUTE_PATHS.SCHEDULES);
  };

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ color: '#DC2626', marginBottom: '1rem', fontSize: '1rem' }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-stats">
        {statCards.map((card, index) => (
          <div key={index} className="dashboard-stat-card">
            <div className="dashboard-stat-card__icon" style={{ backgroundColor: card.bgColor }}>
              <div style={{ color: card.iconColor }}>
                {card.icon}
              </div>
            </div>
            <div className="dashboard-stat-card__content">
              <p className="dashboard-stat-card__label">{card.title}</p>
              <h3 className="dashboard-stat-card__value">{card.value}</h3>
            </div>
            <div className="dashboard-stat-card__change" style={{ color: card.changeColor }}>
              {card.change}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card dashboard-card--large">
          <div className="dashboard-card__header">
            <h3 className="dashboard-card__title">Recent Bookings</h3>
            <button className="dashboard-export-btn">Export Data</button>
          </div>
          
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>CUSTOMER</th>
                  <th>MOVIE</th>
                  <th>TIME</th>
                  <th>SEATS</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {data && data.recentBookings.length > 0 ? (
                  data.recentBookings.map((booking) => (
                    <tr key={booking.uuid}>
                      <td>
                        <div className="dashboard-customer">
                          <div className="dashboard-avatar">
                            {booking.customerName.charAt(0).toUpperCase()}
                          </div>
                          <span>{booking.customerName}</span>
                        </div>
                      </td>
                      <td>{booking.movieTitle}</td>
                      <td className="dashboard-time">{formatTimeAgo(booking.createdAt)}</td>
                      <td>{booking.seatsBooked.toString().padStart(2, '0')}</td>
                      <td>
                        <span className={`dashboard-status dashboard-status--${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                      No recent bookings
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-sidebar">
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h3 className="dashboard-card__title">Occupancy Rate</h3>
              <button className="dashboard-menu-btn">⋮</button>
            </div>
            <div className="dashboard-calendar">
              {weekDays.map((day, index) => (
                <div key={index} className="dashboard-calendar__day">
                  {day}
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-schedule-card">
            <h3 className="dashboard-schedule-card__title">New Schedule</h3>
            <p className="dashboard-schedule-card__text">
              Easily plan upcoming movie screenings for the next week.
            </p>
            <button className="dashboard-schedule-card__btn">
              Create Now
            </button>
          </div>
        </div>
      </div>

      <button className="dashboard-fab" aria-label="Add new">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
};

export default DashboardPage;
