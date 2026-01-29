/**
 * DashboardPage Component
 * 
 * Main dashboard view for the admin panel.
 * 
 * @component
 * @returns {JSX.Element} The dashboard page
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './DashboardPage.css';

const DashboardPage = () => {

  const statCards = [
    {
      title: 'Ratings',
      value: '4.5/5',
      change: '8.5% Up from yesterday',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      bgColor: '#E8E7FF'
    },
    {
      title: 'Ratings',
      value: '4.5/5',
      change: '8.5% Up from yesterday',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      bgColor: '#FFE8E8'
    },
    {
      title: 'Ratings',
      value: '4.5/5',
      change: '8.5% Up from yesterday',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      bgColor: '#FFF4E0'
    },
    {
      title: 'Ratings',
      value: '4.5/5',
      change: '8.5% Up from yesterday',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      bgColor: '#E0FFF4'
    },
  ];

  const barChartData = [
    { name: '1 Aug', value: 65 },
    { name: '8 Aug', value: 85 },
    { name: '15 Aug', value: 120 },
    { name: '22 Aug', value: 90 },
    { name: '29 Aug', value: 110 },
    { name: '5 Sep', value: 140 },
  ];

  const pieChartData = [
    { name: 'Lorem', value: 60, color: '#10B981' },
    { name: 'Lorem', value: 15, color: '#EF4444' },
    { name: 'Lorem', value: 25, color: '#F59E0B' },
  ];

  const newUsers = [
    {
      name: 'Bonnie Tashiga',
      phone: '0965432167',
      role: 'Driver',
      dateJoined: '12-Oct-2025',
      status: 'Online',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      name: 'John Doe',
      phone: '0965432168',
      role: 'Driver',
      dateJoined: '13-Oct-2025',
      status: 'Offline',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      name: 'Jane Smith',
      phone: '0965432169',
      role: 'Admin',
      dateJoined: '14-Oct-2025',
      status: 'Online',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
  ];

  return (
    <div className="dashboard-page">
      {/* Page Title */}
      <h1 className="dashboard-title text-h3">Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card__content">
              <div className="stat-card__header">
                <div>
                  <p className="stat-card__label text-body-4">This Month</p>
                  <h3 className="stat-card__value text-h5">{card.value}</h3>
                </div>
                <div className="stat-card__icon" style={{ backgroundColor: card.bgColor }}>
                  {card.icon}
                </div>
              </div>
              <p className="stat-card__change text-body-5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
                {card.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Bar Chart */}
        <div className="chart-card chart-card--large">
          <div className="chart-card__header">
            <div>
              <h3 className="chart-card__title text-h5">Title</h3>
              <p className="chart-card__subtitle text-body-4">Lorem ipsum</p>
            </div>
            <button className="chart-card__filter text-body-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Today
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <Tooltip />
              <Bar dataKey="value" fill="#EF4444" radius={[8, 8, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <h3 className="chart-card__title text-h5">Lorem Ipsum</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={0}
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-chart-legend">
            {pieChartData.map((entry, index) => (
              <div key={index} className="legend-item">
                <div className="legend-color" style={{ backgroundColor: entry.color }}></div>
                <span className="legend-label text-body-4">{entry.value}% {entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Users Table */}
      <div className="table-card">
        <h3 className="table-card__title text-h5">New Users</h3>
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th className="text-body-5">NAME</th>
                <th className="text-body-5">PHONE NUMBER</th>
                <th className="text-body-5">ROLE</th>
                <th className="text-body-5">DATE JOINED</th>
                <th className="text-body-5">STATUS</th>
                <th className="text-body-5">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {newUsers.map((user, index) => (
                <tr key={index}>
                  <td className="text-body-3">
                    <div className="user-cell">
                      <img src={user.avatar} alt={user.name} className="user-avatar" />
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td className="text-body-3">{user.phone}</td>
                  <td>
                    <span className="role-badge text-body-5">{user.role}</span>
                  </td>
                  <td className="text-body-3">{user.dateJoined}</td>
                  <td>
                    <span className={`status-badge text-body-5 ${user.status === 'Online' ? 'status-badge--online' : 'status-badge--offline'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn action-btn--view">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button className="action-btn action-btn--edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button className="action-btn action-btn--delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
