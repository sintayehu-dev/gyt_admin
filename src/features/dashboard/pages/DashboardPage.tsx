/**
 * DashboardPage Component
 * 
 * Main dashboard view for the cinema admin panel.
 * 
 * @component
 * @returns {JSX.Element} The dashboard page
 */

import './DashboardPage.css';

const DashboardPage = () => {

  const statCards = [
    {
      title: 'Weekly Revenue',
      value: '$24,500',
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
      value: '1,200',
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
      value: '14',
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
      value: '8',
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

  const recentBookings = [
    {
      customer: 'John Doe',
      movie: 'Interstellar (IMAX)',
      time: '2m ago',
      seats: '03',
      status: 'CONFIRMED',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      customer: 'Sarah Wilson',
      movie: 'Dune: Part Two',
      time: '18m ago',
      seats: '01',
      status: 'CONFIRMED',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      customer: 'Michael Scott',
      movie: 'The Batman',
      time: '42m ago',
      seats: '02',
      status: 'PENDING',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
  ];

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="dashboard-page">
      {/* Stats Cards */}
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

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Bookings */}
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
                {recentBookings.map((booking, index) => (
                  <tr key={index}>
                    <td>
                      <div className="dashboard-customer">
                        <img src={booking.avatar} alt={booking.customer} className="dashboard-avatar" />
                        <span>{booking.customer}</span>
                      </div>
                    </td>
                    <td>{booking.movie}</td>
                    <td className="dashboard-time">{booking.time}</td>
                    <td>{booking.seats}</td>
                    <td>
                      <span className={`dashboard-status dashboard-status--${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-sidebar">
          {/* Occupancy Rate */}
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

          {/* New Schedule Card */}
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

      {/* Floating Action Button */}
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
