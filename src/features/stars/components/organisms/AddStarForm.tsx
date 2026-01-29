import { useState, FormEvent } from 'react';
import Button from '../../../../core/components/atoms/Button';
import Input from '../../../../core/components/atoms/Input';
import Label from '../../../../core/components/atoms/Label';
import LoadingSpinner from '../../../../core/components/atoms/LoadingSpinner';
import './StarForm.css';

interface AddStarFormProps {
  onSubmit: (starData: StarFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface StarFormData {
  name: string;
  biography: string;
}

const AddStarForm = ({ onSubmit, onCancel, isLoading = false }: AddStarFormProps) => {
  const [formData, setFormData] = useState<StarFormData>({
    name: '',
    biography: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form className="star-form" onSubmit={handleSubmit}>
      <div className="star-form__fields">
        <div className="star-form__field">
          <Label htmlFor="name">Star Name *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Leonardo DiCaprio"
            required
            disabled={isLoading}
          />
        </div>

        <div className="star-form__field">
          <Label htmlFor="biography">Biography</Label>
          <textarea
            id="biography"
            name="biography"
            className="star-form__textarea"
            value={formData.biography}
            onChange={handleInputChange}
            placeholder="Brief biography of the star"
            rows={4}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="star-form__actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <LoadingSpinner size="small" />
              <span>Creating...</span>
            </>
          ) : (
            'Create Star'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddStarForm;
