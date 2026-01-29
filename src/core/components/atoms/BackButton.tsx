/**
 * BackButton Atom Component
 * 
 * Reusable back button with arrow icon
 */

import './BackButton.css';

const BackButton = ({ onClick, children = '    Go Back' }) => {
    return (
        <button
            onClick={onClick}
            className="back-button"
            type="button"
        >
            <svg
                className="back-button__icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
            >
                <path
                    d="M19 12H5M5 12L12 19M5 12L12 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <span className="back-button__text text-body-4">{children}</span>
        </button>
    );
};

export default BackButton;
