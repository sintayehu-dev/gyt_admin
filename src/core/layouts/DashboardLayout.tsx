/**
 * DashboardLayout Component
 * Main layout wrapper for dashboard pages with sidebar and navbar
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/organisms/Sidebar';
import Navbar from '../components/organisms/Navbar';
import './DashboardLayout.css';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const toggleCollapse = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className={`dashboard-layout ${sidebarCollapsed ? 'dashboard-layout--collapsed' : ''}`}>
            <Sidebar
                isOpen={sidebarOpen}
                onClose={closeSidebar}
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={toggleCollapse}
            />
            <Navbar onMenuClick={toggleSidebar} isCollapsed={sidebarCollapsed} />

            <main className="dashboard-layout__content">
                <div className="dashboard-layout__content-inner">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
