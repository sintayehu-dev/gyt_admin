import { useState, FormEvent, useEffect } from 'react';
import Button from '../../../../core/components/atoms/Button';
import Input from '../../../../core/components/atoms/Input';
import Label from '../../../../core/components/atoms/Label';
import LoadingSpinner from '../../../../core/components/atoms/LoadingSpinner';
import { MovieDTO } from '../../api/movies.dto';
import './AddMovieForm.css';

interface EditMovieFormProps {
  movie: MovieDTO;
  onSubmit: (movieData: UpdateMovieFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface UpdateMovieFormData {
  title: string;
  description: string;
  durationMinutes: number;
  releaseDate: string;
  posterUrl: string;
  trailerUrl: string;
  language: string;
  isActive: boolean;
  genres: string[];
  directors: string[];
  stars: string[];
}

const EditMovieForm = ({ movie, onSubmit, onCancel, isLoading = false }: EditMovieFormProps) => {
  const [formData, setFormData] = useState<UpdateMovieFormData>({
    title: movie.title,
    description: movie.description,
    durationMinutes: movie.durationMinutes,
    releaseDate: movie.releaseDate,
    posterUrl: movie.posterUrl,
    trailerUrl: movie.trailerUrl,
    language: movie.language,
    isActive: movie.isActive,
    genres: [...movie.genres],
    directors: [...movie.directors],
    stars: [...movie.stars],
  });

  const [genreInput, setGenreInput] = useState('');
  const [directorInput, setDirectorInput] = useState('');
  const [starInput, setStarInput] = useState('');

  useEffect(() => {
    setFormData({
      title: movie.title,
      description: movie.description,
      durationMinutes: movie.durationMinutes,
      releaseDate: movie.releaseDate,
      posterUrl: movie.posterUrl,
      trailerUrl: movie.trailerUrl,
      language: movie.language,
      isActive: movie.isActive,
      genres: [...movie.genres],
      directors: [...movie.directors],
      stars: [...movie.stars],
    });
  }, [movie]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'durationMinutes' ? parseInt(value) || 0 : value,
      }));
    }
  };

  const handleAddGenre = () => {
    if (genreInput.trim() && !formData.genres.includes(genreInput.trim())) {
      setFormData(prev => ({
        ...prev,
        genres: [...prev.genres, genreInput.trim()],
      }));
      setGenreInput('');
    }
  };

  const handleRemoveGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.filter(g => g !== genre),
    }));
  };

  const handleAddDirector = () => {
    if (directorInput.trim() && !formData.directors.includes(directorInput.trim())) {
      setFormData(prev => ({
        ...prev,
        directors: [...prev.directors, directorInput.trim()],
      }));
      setDirectorInput('');
    }
  };

  const handleRemoveDirector = (director: string) => {
    setFormData(prev => ({
      ...prev,
      directors: prev.directors.filter(d => d !== director),
    }));
  };

  const handleAddStar = () => {
    if (starInput.trim() && !formData.stars.includes(starInput.trim())) {
      setFormData(prev => ({
        ...prev,
        stars: [...prev.stars, starInput.trim()],
      }));
      setStarInput('');
    }
  };

  const handleRemoveStar = (star: string) => {
    setFormData(prev => ({
      ...prev,
      stars: prev.stars.filter(s => s !== star),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form className="add-movie-form" onSubmit={handleSubmit}>
      <div className="add-movie-form__grid">
        <div className="add-movie-form__field">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter movie title"
            required
            disabled={isLoading}
          />
        </div>

        <div className="add-movie-form__field">
          <Label htmlFor="language">Language *</Label>
          <Input
            id="language"
            name="language"
            type="text"
            value={formData.language}
            onChange={handleInputChange}
            placeholder="e.g., English"
            required
            disabled={isLoading}
          />
        </div>

        <div className="add-movie-form__field">
          <Label htmlFor="durationMinutes">Duration (minutes) *</Label>
          <Input
            id="durationMinutes"
            name="durationMinutes"
            type="number"
            value={formData.durationMinutes}
            onChange={handleInputChange}
            placeholder="e.g., 120"
            required
            min="1"
            disabled={isLoading}
          />
        </div>

        <div className="add-movie-form__field">
          <Label htmlFor="releaseDate">Release Date *</Label>
          <Input
            id="releaseDate"
            name="releaseDate"
            type="date"
            value={formData.releaseDate}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="add-movie-form__field">
          <Label htmlFor="isActive">Status</Label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleInputChange}
              disabled={isLoading}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="isActive" style={{ cursor: 'pointer', fontSize: '0.875rem' }}>
              Active
            </label>
          </div>
        </div>

        <div className="add-movie-form__field add-movie-form__field--full">
          <Label htmlFor="description">Description *</Label>
          <textarea
            id="description"
            name="description"
            className="add-movie-form__textarea"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter movie description"
            rows={3}
            required
            disabled={isLoading}
          />
        </div>

        <div className="add-movie-form__field add-movie-form__field--full">
          <Label htmlFor="posterUrl">Poster URL</Label>
          <Input
            id="posterUrl"
            name="posterUrl"
            type="url"
            value={formData.posterUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/poster.jpg"
            disabled={isLoading}
          />
        </div>

        <div className="add-movie-form__field add-movie-form__field--full">
          <Label htmlFor="trailerUrl">Trailer URL</Label>
          <Input
            id="trailerUrl"
            name="trailerUrl"
            type="url"
            value={formData.trailerUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/trailer.mp4"
            disabled={isLoading}
          />
        </div>

        <div className="add-movie-form__field add-movie-form__field--full">
          <Label htmlFor="genres">Genres</Label>
          <div className="add-movie-form__tag-input">
            <Input
              id="genres"
              type="text"
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGenre())}
              placeholder="Add genre and press Enter"
              disabled={isLoading}
            />
            <Button type="button" variant="secondary" onClick={handleAddGenre} disabled={isLoading}>
              Add
            </Button>
          </div>
          <div className="add-movie-form__tags">
            {formData.genres.map((genre, index) => (
              <span key={index} className="add-movie-form__tag">
                {genre}
                <button
                  type="button"
                  className="add-movie-form__tag-remove"
                  onClick={() => handleRemoveGenre(genre)}
                  disabled={isLoading}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="add-movie-form__field add-movie-form__field--full">
          <Label htmlFor="directors">Directors</Label>
          <div className="add-movie-form__tag-input">
            <Input
              id="directors"
              type="text"
              value={directorInput}
              onChange={(e) => setDirectorInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDirector())}
              placeholder="Add director and press Enter"
              disabled={isLoading}
            />
            <Button type="button" variant="secondary" onClick={handleAddDirector} disabled={isLoading}>
              Add
            </Button>
          </div>
          <div className="add-movie-form__tags">
            {formData.directors.map((director, index) => (
              <span key={index} className="add-movie-form__tag">
                {director}
                <button
                  type="button"
                  className="add-movie-form__tag-remove"
                  onClick={() => handleRemoveDirector(director)}
                  disabled={isLoading}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="add-movie-form__field add-movie-form__field--full">
          <Label htmlFor="stars">Stars</Label>
          <div className="add-movie-form__tag-input">
            <Input
              id="stars"
              type="text"
              value={starInput}
              onChange={(e) => setStarInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddStar())}
              placeholder="Add star and press Enter"
              disabled={isLoading}
            />
            <Button type="button" variant="secondary" onClick={handleAddStar} disabled={isLoading}>
              Add
            </Button>
          </div>
          <div className="add-movie-form__tags">
            {formData.stars.map((star, index) => (
              <span key={index} className="add-movie-form__tag">
                {star}
                <button
                  type="button"
                  className="add-movie-form__tag-remove"
                  onClick={() => handleRemoveStar(star)}
                  disabled={isLoading}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="add-movie-form__actions">
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
            'Update Movie'
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditMovieForm;
