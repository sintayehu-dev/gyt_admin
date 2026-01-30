import { useState, FormEvent } from 'react';
import Button from '../../../../core/components/atoms/Button';
import Input from '../../../../core/components/atoms/Input';
import Label from '../../../../core/components/atoms/Label';
import LoadingSpinner from '../../../../core/components/atoms/LoadingSpinner';
import InfiniteMultiSelect from '../../../../core/components/atoms/InfiniteMultiSelect';
import useGenresForDropdown from '../../../genres/hooks/useGenresForDropdown';
import useDirectorsForDropdown from '../../../directors/hooks/useDirectorsForDropdown';
import useStarsForDropdown from '../../../stars/hooks/useStarsForDropdown';
import './AddMovieForm.css';

interface AddMovieFormProps {
  onSubmit: (movieData: MovieFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface MovieFormData {
  title: string;
  description: string;
  durationMinutes: number;
  releaseDate: string;
  posterUrl: string;
  trailerUrl: string;
  language: string;
  genres: string[];
  directors: string[];
  stars: string[];
}

const AddMovieForm = ({ onSubmit, onCancel, isLoading = false }: AddMovieFormProps) => {
  const { genres, isLoading: loadingGenres, fetchNextPage: fetchNextGenres, hasNextPage: hasNextGenres, isFetchingNextPage: isFetchingNextGenres } = useGenresForDropdown();
  const { directors, isLoading: loadingDirectors, fetchNextPage: fetchNextDirectors, hasNextPage: hasNextDirectors, isFetchingNextPage: isFetchingNextDirectors } = useDirectorsForDropdown();
  const { stars, isLoading: loadingStars, fetchNextPage: fetchNextStars, hasNextPage: hasNextStars, isFetchingNextPage: isFetchingNextStars } = useStarsForDropdown();
  
  const [formData, setFormData] = useState<MovieFormData>({
    title: '',
    description: '',
    durationMinutes: 0,
    releaseDate: '',
    posterUrl: '',
    trailerUrl: '',
    language: '',
    genres: [],
    directors: [],
    stars: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'durationMinutes' ? parseInt(value) || 0 : value,
    }));
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
              <span>Creating...</span>
            </>
          ) : (
            'Create Movie'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddMovieForm;
