import { useState, FormEvent, useEffect } from 'react';
import Button from '../../../../core/components/atoms/Button';
import Input from '../../../../core/components/atoms/Input';
import Label from '../../../../core/components/atoms/Label';
import LoadingSpinner from '../../../../core/components/atoms/LoadingSpinner';
import { DirectorDTO } from '../../api/directors.dto';
import './DirectorForm.css';

interface EditDirectorFormProps {
  director: DirectorDTO;
  onSubmit: (directorData: UpdateDirectorFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface UpdateDirectorFormData {
  name: string;
  biography: string;
}

const EditDirectorForm = ({ director, onSubmit, onCancel, isLoading = false }: EditDirectorFormProps) => {
  const [formData, setFormData] = useState<UpdateDirectorFormData>({
    name: director.name,
    biography: director.biography,
  });

  useEffect(() => {
    setFormData({
      name: director.name,
      biography: director.biography,
    });
  }, [director]);

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
              <span>Updating...</span>
            </>
          ) : (
            'Update Director'
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditDirectorForm;
