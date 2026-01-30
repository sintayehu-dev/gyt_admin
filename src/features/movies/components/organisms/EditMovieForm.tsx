import { useState, FormEvent, useEffect } from 'react';
import Button from '../../../../core/components/atoms/Button';
import Input from '../../../../core/components/atoms/Input';
import Label from '../../../../core/components/atoms/Label';
import LoadingSpinner from '../../../../core/components/atoms/LoadingSpinner';
import InfiniteMultiSelect from '../../../../core/components/atoms/InfiniteMultiSelect';
import { MovieDTO } from '../../api/movies.dto';
import useGenresForDropdown from '../../../genres/hooks/useGenresForDropdown';
import useDirectorsForDropdown from '../../../directors/hooks/useDirectorsForDropdown';
import useStarsForDropdown from '../../../stars/hooks/useStarsForDropdown';
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
  const { genres, isLoading: loadingGenres, fetchNextPage: fetchNextGenres, hasNextPage: hasNextGenres, isFetchingNextPage: isFetchingNextGenres } = useGenresForDropdown();
  const { directors, isLoading: loadingDirectors, fetchNextPage: fetchNextDirectors, hasNextPage: hasNextDirectors, isFetchingNextPage: isFetchingNextDirectors } = useDirectorsForDropdown();
  const { stars, isLoading: loadingStars, fetchNextPage: fetchNextStars, hasNextPage: hasNextStars, isFetchingNextPage: isFetchingNextStars } = useStarsForDropdown();
  
  // Helper function to convert names to UUIDs or keep UUIDs as is
  const getUuidsFromNamesOrUuids = (items: string[], allItems: Array<{ uuid: string; name: string }>) => {
    return items.map(item => {
      // Check if item is already a UUID (contains hyphens)
      if (item.includes('-')) {
        return item;
      }
      // Otherwise, find the UUID by name
      const found = allItems.find(i => i.name === item);
      return found ? found.uuid : item;
    }).filter(Boolean);
  };

  const [formData, setFormData] = useState<UpdateMovieFormData>({
    title: movie.title,
    description: movie.description,
    durationMinutes: movie.durationMinutes,
    releaseDate: movie.releaseDate,
    posterUrl: movie.posterUrl,
    trailerUrl: movie.trailerUrl,
    language: movie.language,
    isActive: movie.isActive,
    genres: getUuidsFromNamesOrUuids(movie.genres, genres),
    directors: getUuidsFromNamesOrUuids(movie.directors, directors),
    stars: getUuidsFromNamesOrUuids(movie.stars, stars),
  });

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
      genres: getUuidsFromNamesOrUuids(movie.genres, genres),
      directors: getUuidsFromNamesOrUuids(movie.directors, directors),
      stars: getUuidsFromNamesOrUuids(movie.stars, stars),
    });
  }, [movie, genres, directors, stars]);

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

  const handleGenresChange = (selectedValues: string[]) => {
    setFormData(prev => ({ ...prev, genres: selectedValues }));
  };

  const handleDirectorsChange = (selectedValues: string[]) => {
    setFormData(prev => ({ ...prev, directors: selectedValues }));
  };

  const handleStarsChange = (selectedValues: string[]) => {
    setFormData(prev => ({ ...prev, stars: selectedValues }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const genreOptions = genres.map(genre => ({
    value: genre.uuid,
    label: genre.name,
  }));

  const directorOptions = directors.map(director => ({
    value: director.uuid,
    label: director.name,
  }));

  const starOptions = stars.map(star => ({
    value: star.uuid,
    label: star.name,
  }));

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
            placeholder=""
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
          <InfiniteMultiSelect
            id="genres"
            name="genres"
            selectedValues={formData.genres}
            onChange={handleGenresChange}
            options={genreOptions}
            placeholder="Select genres"
            onScrollEnd={() => hasNextGenres && fetchNextGenres()}
            isLoadingMore={isFetchingNextGenres}
            hasMore={hasNextGenres}
            disabled={isLoading || loadingGenres}
          />
        </div>

        <div className="add-movie-form__field add-movie-form__field--full">
          <Label htmlFor="directors">Directors</Label>
          <InfiniteMultiSelect
            id="directors"
            name="directors"
            selectedValues={formData.directors}
            onChange={handleDirectorsChange}
            options={directorOptions}
            placeholder="Select directors"
            onScrollEnd={() => hasNextDirectors && fetchNextDirectors()}
            isLoadingMore={isFetchingNextDirectors}
            hasMore={hasNextDirectors}
            disabled={isLoading || loadingDirectors}
          />
        </div>

        <div className="add-movie-form__field add-movie-form__field--full">
          <Label htmlFor="stars">Stars</Label>
          <InfiniteMultiSelect
            id="stars"
            name="stars"
            selectedValues={formData.stars}
            onChange={handleStarsChange}
            options={starOptions}
            placeholder="Select stars"
            onScrollEnd={() => hasNextStars && fetchNextStars()}
            isLoadingMore={isFetchingNextStars}
            hasMore={hasNextStars}
            disabled={isLoading || loadingStars}
          />
        </div>
      </div>

      <div className="add-movie-form__actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading || loadingGenres || loadingDirectors || loadingStars}>
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
