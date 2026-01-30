import { useState, FormEvent } from 'react';
import Button from '../../../../core/components/atoms/Button';
import Input from '../../../../core/components/atoms/Input';
import Label from '../../../../core/components/atoms/Label';
import InfiniteSelect from '../../../../core/components/atoms/InfiniteSelect';
import LoadingSpinner from '../../../../core/components/atoms/LoadingSpinner';
import useMoviesForDropdown from '../../../movies/hooks/useMoviesForDropdown';
import './ScheduleForm.css';

interface AddScheduleFormProps {
  onSubmit: (scheduleData: ScheduleFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface ScheduleFormData {
  movieUuid: string;
  cinemaHall: string;
  showDate: string;
  showTime: string;
  endTime: string;
  totalSeats: number;
  price: number;
}

const AddScheduleForm = ({ onSubmit, onCancel, isLoading = false }: AddScheduleFormProps) => {
  const { movies, isLoading: loadingMovies, fetchNextPage, hasNextPage, isFetchingNextPage } = useMoviesForDropdown();
  
  const [formData, setFormData] = useState<ScheduleFormData>({
    movieUuid: '',
    cinemaHall: '',
    showDate: '',
    showTime: '',
    endTime: '',
    totalSeats: 0,
    price: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalSeats' || name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const movieOptions = movies.map(movie => ({
    value: movie.uuid,
    label: movie.title,
  }));

  return (
    <form className="schedule-form" onSubmit={handleSubmit}>
      <div className="schedule-form__fields">
        <div className="schedule-form__field">
          <Label htmlFor="movieUuid">Movie *</Label>
          <InfiniteSelect
            id="movieUuid"
            name="movieUuid"
            value={formData.movieUuid}
            onChange={handleInputChange}
            placeholder="Select a movie"
            options={movieOptions as any}
            onScrollEnd={() => hasNextPage && fetchNextPage()}
            isLoadingMore={isFetchingNextPage}
            hasMore={hasNextPage}
            required
            disabled={isLoading || loadingMovies}
          />
        </div>

        <div className="schedule-form__field">
          <Label htmlFor="cinemaHall">Cinema Hall *</Label>
          <Input
            id="cinemaHall"
            name="cinemaHall"
            type="text"
            value={formData.cinemaHall}
            onChange={handleInputChange}
            placeholder="e.g., Hall 1, IMAX Theater, VIP Hall"
            required
            disabled={isLoading}
          />
        </div>

        <div className="schedule-form__field">
          <Label htmlFor="showDate">Show Date *</Label>
          <Input
            id="showDate"
            name="showDate"
            type="date"
            value={formData.showDate}
            onChange={handleInputChange}
            placeholder=""
            required
            disabled={isLoading}
          />
        </div>

        <div className="schedule-form__row">
          <div className="schedule-form__field">
            <Label htmlFor="showTime">Show Time *</Label>
            <Input
              id="showTime"
              name="showTime"
              type="time"
              value={formData.showTime}
              onChange={handleInputChange}
              placeholder=""
              required
              disabled={isLoading}
            />
          </div>

          <div className="schedule-form__field">
            <Label htmlFor="endTime">End Time *</Label>
            <Input
              id="endTime"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleInputChange}
              placeholder=""
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="schedule-form__row">
          <div className="schedule-form__field">
            <Label htmlFor="totalSeats">Total Seats *</Label>
            <Input
              id="totalSeats"
              name="totalSeats"
              type="number"
              value={formData.totalSeats}
              onChange={handleInputChange}
              placeholder="e.g., 150"
              min="1"
              required
              disabled={isLoading}
            />
          </div>

          <div className="schedule-form__field">
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g., 12.50"
              min="0.01"
              required
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="schedule-form__actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading || loadingMovies}>
          {isLoading ? (
            <>
              <LoadingSpinner size="small" />
              <span>Creating...</span>
            </>
          ) : (
            'Create Schedule'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddScheduleForm;
