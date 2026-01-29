/**
 * Sidebar Component
 * Main navigation sidebar for admin dashboard
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../atoms/Logo';
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
            path: '/dashboard',
        },
        {
            id: 'user-management',
            label: 'User Management',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            path: '/users',
            hasSubmenu: true,
            submenu: [
                { label: 'Rider', path: '/users/rider' },
                { label: 'Parent', path: '/users/parent' },
                { label: 'Admin', path: '/users/admin' },
            ],
        },
        {
            id: 'roles',
            label: 'Roles And Permissions',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            path: '/roles',
        },
        {
            id: 'drivers',
            label: 'Drivers',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 17h14v-5H5v5z" />
                    <path d="M5 12L2 7h20l-3 5" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                </svg>
            ),
            path: '/drivers',
        },
        {
            id: 'school-shuttle',
            label: 'School Shuttle',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="6" width="18" height="11" rx="2" />
                    <path d="M3 10h18" />
                    <circle cx="7" cy="17" r="1" />
                    <circle cx="17" cy="17" r="1" />
                    <path d="M8 6V4" />
                    <path d="M16 6V4" />
                </svg>
            ),
            path: '/school-shuttle',
        },
        {
            id: 'booking',
            label: 'Booking Request',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="6" width="18" height="11" rx="2" />
                    <path d="M7 10h10" />
                    <path d="M7 14h6" />
                </svg>
            ),
            path: '/booking',
        },
        {
            id: 'trip',
            label: 'Trip Management',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="10" r="3" />
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                </svg>
            ),
            path: '/trips',
        },
        {
            id: 'vehicle',
            label: 'Vehicle Management',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 17h14v-5H5v5z" />
                    <path d="M5 12L2 7h20l-3 5" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                </svg>
            ),
            path: '/vehicles',
        },
        {
            id: 'financials',
            label: 'Financials',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v12" />
                    <path d="M15 9h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9" />
                </svg>
            ),
            path: '/financials',
        },
        {
            id: 'analytics',
            label: 'Analytics & Reports',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 9h6" />
                    <path d="M9 15h6" />
                    <path d="M9 12h6" />
                </svg>
            ),
            path: '/analytics',
        },
        {
            id: 'support',
            label: 'Help & Support',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 17h.01" />
                </svg>
            ),
            path: '/support',
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
            </aside>
        </>
    );
};

export default Sidebar;
