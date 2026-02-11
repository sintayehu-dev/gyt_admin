import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../features/auth/context/AuthContext';
import { ROUTE_PATHS } from '../../routes/routeNames';
import './Navbar.css';

interface NavbarProps {
    onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
    const navigate = useNavigate();
    const { user, logout } = useAuthContext();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const notifications = [
        { id: 1, message: 'New user registered', time: '5 min ago' },
        { id: 2, message: 'Booking request received', time: '10 min ago' },
        { id: 3, message: 'Trip completed successfully', time: '1 hour ago' },
    ];

    const handleLogout = () => {
        logout();
        navigate(ROUTE_PATHS.LOGIN);
    };

    return (
        <header className="navbar">
            <div className="navbar__container">
                <div className="navbar__left">
                    <button
                        className="navbar__menu-btn"
                        onClick={onMenuClick}
                        aria-label="Toggle menu"
                    >
                        ☰
                    </button>
                </div>

                <div className="navbar__right">
                    <div className="navbar__item">
                        <button
                            className="navbar__icon-btn"
                            onClick={() => setShowNotifications(!showNotifications)}
                            aria-label="Notifications"
                        >
                            <span className="navbar__icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            </span>
                            <span className="navbar__badge">3</span>
                        </button>

                        {showNotifications && (
                            <div className="navbar__dropdown">
                                <div className="navbar__dropdown-header">
                                    <h3 className="text-body-4 color-text-primary">Notifications</h3>
                                </div>
                                <ul className="navbar__dropdown-list">
                                    {notifications.map((notif) => (
                                        <li key={notif.id} className="navbar__dropdown-item">
                                            <p className="text-body-4 color-text-primary">{notif.message}</p>
                                            <span className="text-body-5 color-text-secondary">{notif.time}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="navbar__dropdown-footer">
                                    <button className="navbar__dropdown-link">View all</button>
                                </div>
                            </div>
                        )}
                    </div>

                        <button
                            className="navbar__icon-btn"
                            aria-label="Settings"
                        >
                        <span className="navbar__icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                        </span>
                        </button>

                    <div className="navbar__profile">
                        <button
                            className="navbar__profile-btn"
                            onClick={() => setShowProfile(!showProfile)}
                            aria-label="User profile"
                        >
                            <span className="navbar__avatar">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <span className="navbar__username text-body-2">{user?.name || 'User'}</span>
                            <span className="navbar__arrow">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <polyline points="6 9 12 15 18 9" />
                            </svg>
                            </span>
                        </button>

                        {showProfile && (
                            <div className="navbar__dropdown navbar__dropdown--right">
                                <ul className="navbar__dropdown-list">
                                    <li className="navbar__dropdown-item">
                                        <button className="navbar__dropdown-link">Profile</button>
                                    </li>
                                    <li className="navbar__dropdown-item">
                                        <button className="navbar__dropdown-link">Settings</button>
                                    </li>
                                    <li className="navbar__dropdown-item">
                                        <button
                                            className="navbar__dropdown-link navbar__dropdown-link--danger"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
