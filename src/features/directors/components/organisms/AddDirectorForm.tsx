import { useState, FormEvent } from 'react';
import Button from '../../../../core/components/atoms/Button';
import Input from '../../../../core/components/atoms/Input';
import Label from '../../../../core/components/atoms/Label';
import LoadingSpinner from '../../../../core/components/atoms/LoadingSpinner';
import './DirectorForm.css';

interface AddDirectorFormProps {
  onSubmit: (directorData: DirectorFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface DirectorFormData {
  name: string;
  biography: string;
}

const AddDirectorForm = ({ onSubmit, onCancel, isLoading = false }: AddDirectorFormProps) => {
  const [formData, setFormData] = useState<DirectorFormData>({
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
    <form className="director-form" onSubmit={handleSubmit}>
      <div className="director-form__fields">
        <div className="director-form__field">
          <Label htmlFor="name">Director Name *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Christopher Nolan"
            required
            disabled={isLoading}
          />
        </div>

        <div className="director-form__field">
          <Label htmlFor="biography">Biography</Label>
          <textarea
            id="biography"
            name="biography"
            className="director-form__textarea"
            value={formData.biography}
            onChange={handleInputChange}
            placeholder="Brief biography of the director"
            rows={4}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="director-form__actions">
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
            'Create Director'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddDirectorForm;
