import './ActionButton.css';

type ActionType = 'view' | 'edit' | 'delete';

interface ActionButtonProps {
  type: ActionType;
  onClick: () => void;
  ariaLabel?: string;
}

const ActionButton = ({ type, onClick, ariaLabel }: ActionButtonProps) => {
  const icons = {
    view: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    edit: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    delete: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  };

  const defaultLabels = {
    view: 'View details',
    edit: 'Edit',
    delete: 'Delete',
  };

  return (
    <button
      className={`action-button action-button--${type}`}
      onClick={onClick}
      aria-label={ariaLabel || defaultLabels[type]}
    >
      {icons[type]}
    </button>
  );
};

export default ActionButton;
