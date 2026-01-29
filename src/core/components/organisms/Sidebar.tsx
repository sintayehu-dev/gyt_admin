/**
 * Sidebar Component
 * Main navigation sidebar for admin dashboard
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../atoms/Logo';
import { ROUTE_PATHS } from '../../routes/routeNames';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
    const location = useLocation();
    const [expandedMenus, setExpandedMenus] = useState({});

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
            ),
            path: ROUTE_PATHS.DASHBOARD,
        },
        {
            id: 'movies',
            label: 'Movies',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                    <line x1="7" y1="2" x2="7" y2="22" />
                    <line x1="17" y1="2" x2="17" y2="22" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <line x1="2" y1="7" x2="7" y2="7" />
                    <line x1="2" y1="17" x2="7" y2="17" />
                    <line x1="17" y1="17" x2="22" y2="17" />
                    <line x1="17" y1="7" x2="22" y2="7" />
                </svg>
            ),
            path: ROUTE_PATHS.MOVIES,
        },
        {
            id: 'genres',
            label: 'Genres',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m18.2 5.2l-4.2-4.2m0-6l4.2-4.2" />
                </svg>
            ),
            path: ROUTE_PATHS.GENRES,
        },
        {
            id: 'directors',
            label: 'Directors',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            ),
            path: ROUTE_PATHS.DIRECTORS,
        },
        {
            id: 'stars',
            label: 'Stars',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ),
            path: ROUTE_PATHS.STARS,
        },
        {
            id: 'schedules',
            label: 'Schedules',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            ),
            path: ROUTE_PATHS.SCHEDULES,
        },
        {
            id: 'tickets',
            label: 'Tickets',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 1 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 1 1 0-4V7a2 2 0 0 0-2-2H5z" />
                </svg>
            ),
            path: ROUTE_PATHS.TICKETS,
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
            ),
            path: ROUTE_PATHS.SETTINGS,
        },
    ];

    const toggleSubmenu = (menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''} ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
                {/* Logo Section */}
                <div className="sidebar__header">
                    <div className="sidebar__brand">
                        <Logo size={isCollapsed ? 'mini' : 'small'} />
                    </div>
                    <div className="sidebar__actions">
                        <button
                            className="sidebar__toggle"
                            onClick={onToggleCollapse}
                            aria-label="Toggle sidebar"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points={isCollapsed ? "9 18 15 12 9 6" : "15 18 9 12 15 6"} />
                            </svg>
                        </button>
                        <button
                            className="sidebar__close-mobile"
                            onClick={onClose}
                            aria-label="Close sidebar"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="sidebar__nav">
                    <ul className="sidebar__menu">
                        {menuItems.map((item) => (
                            <li key={item.id} className="sidebar__menu-item">
                                {item.hasSubmenu ? (
                                    <>
                                        <button
                                            className={`sidebar__link text-body-3`}
                                            onClick={() => toggleSubmenu(item.id)}
                                            data-tooltip={item.label}
                                        >
                                            <span className="sidebar__icon">{item.icon}</span>
                                            <span className="sidebar__label">{item.label}</span>
                                            <span className={`sidebar__arrow ${expandedMenus[item.id] ? 'sidebar__arrow--open' : ''}`}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="6 9 12 15 18 9" />
                                                </svg>
                                            </span>
                                        </button>
                                        {expandedMenus[item.id] && (
                                            <ul className="sidebar__submenu">
                                                {item.submenu.map((subItem, index) => (
                                                    <li key={index}>
                                                        <Link
                                                            to={subItem.path}
                                                            className={`sidebar__sublink text-body-3 ${isActive(subItem.path) ? 'sidebar__sublink--active' : ''}`}
                                                        >
                                                            {subItem.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        to={item.path}
                                        className={`sidebar__link text-body-3 ${isActive(item.path) ? 'sidebar__link--active' : ''}`}
                                        data-tooltip={item.label}
                                    >
                                        <span className="sidebar__icon">{item.icon}</span>
                                        <span className="sidebar__label">{item.label}</span>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Support Section */}
                <div className="sidebar__support">
                    <div className="sidebar__support-card">
                        <p className="sidebar__support-label">SUPPORT</p>
                        <p className="sidebar__support-text">Need help managing your cinema?</p>
                        <button className="sidebar__support-btn">
                            Contact Us
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
