import ActionButton from '../atoms/ActionButton';
import './ActionButtons.css';

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ActionButtons = ({ onView, onEdit, onDelete }: ActionButtonsProps) => {
  return (
    <div className="action-buttons">
      {onView && <ActionButton type="view" onClick={onView} />}
      {onEdit && <ActionButton type="edit" onClick={onEdit} />}
      {onDelete && <ActionButton type="delete" onClick={onDelete} />}
    </div>
  );
};

export default ActionButtons;
