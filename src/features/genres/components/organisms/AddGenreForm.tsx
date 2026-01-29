import { useState, FormEvent } from 'react';
import Button from '../../../../core/components/atoms/Button';
import Input from '../../../../core/components/atoms/Input';
import Label from '../../../../core/components/atoms/Label';
import LoadingSpinner from '../../../../core/components/atoms/LoadingSpinner';
import './GenreForm.css';

interface AddGenreFormProps {
  onSubmit: (genreData: GenreFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface GenreFormData {
  name: string;
  description: string;
}

const AddGenreForm = ({ onSubmit, onCancel, isLoading = false }: AddGenreFormProps) => {
  const [formData, setFormData] = useState<GenreFormData>({
    name: '',
    description: '',
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
    <form className="genre-form" onSubmit={handleSubmit}>
      <div className="genre-form__fields">
        <div className="genre-form__field">
          <Label htmlFor="name">Genre Name *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Action, Comedy, Drama"
            required
            disabled={isLoading}
          />
        </div>

        <div className="genre-form__field">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            className="genre-form__textarea"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of the genre"
            rows={4}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="genre-form__actions">
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
            'Create Genre'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddGenreForm;
