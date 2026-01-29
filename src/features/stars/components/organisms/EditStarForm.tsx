import { useState, FormEvent, useEffect } from 'react';
import Button from '../../../../core/components/atoms/Button';
import Input from '../../../../core/components/atoms/Input';
import Label from '../../../../core/components/atoms/Label';
import LoadingSpinner from '../../../../core/components/atoms/LoadingSpinner';
import { StarDTO } from '../../api/stars.dto';
import './StarForm.css';

interface EditStarFormProps {
  star: StarDTO;
  onSubmit: (starData: UpdateStarFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface UpdateStarFormData {
  name: string;
  biography: string;
}

const EditStarForm = ({ star, onSubmit, onCancel, isLoading = false }: EditStarFormProps) => {
  const [formData, setFormData] = useState<UpdateStarFormData>({
    name: star.name,
    biography: star.biography,
  });

  useEffect(() => {
    setFormData({
      name: star.name,
      biography: star.biography,
    });
  }, [star]);

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
              <span>Updating...</span>
            </>
          ) : (
            'Update Star'
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditStarForm;
