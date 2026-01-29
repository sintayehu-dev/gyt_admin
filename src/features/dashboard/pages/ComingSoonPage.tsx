/**
 * ComingSoonPage Component
 * 
 * Placeholder page for features under development
 * 
 * @component
 * @returns {JSX.Element} The coming soon page
 */

import './ComingSoonPage.css';

const ComingSoonPage = ({ pageName = "This Feature" }) => {
    return (
        <div className="coming-soon-page">
            <div className="coming-soon-content">
                <div className="coming-soon-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                    </svg>
                </div>

                <h1 className="coming-soon-title text-h5">
                    Coming Soon
                </h1>

                <p className="coming-soon-message text-body-4">
                    {pageName} is currently under development and will be available soon.
                </p>

                <p className="coming-soon-submessage text-body-4 color-text-secondary">
                    We're working hard to bring you this feature. Stay tuned for updates!
                </p>

                <div className="coming-soon-actions">
                    <button
                        className="coming-soon-btn"
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComingSoonPage;