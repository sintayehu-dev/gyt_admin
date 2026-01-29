import { useState, FormEvent, useEffect } from 'react';
import Button from '../../../../core/components/atoms/Button';
import Input from '../../../../core/components/atoms/Input';
import Label from '../../../../core/components/atoms/Label';
import Select from '../../../../core/components/atoms/Select';
import LoadingSpinner from '../../../../core/components/atoms/LoadingSpinner';
import { ScheduleDTO } from '../../api/schedules.dto';
import { moviesAPI } from '../../../movies/api/movies.api';
import './ScheduleForm.css';

interface EditScheduleFormProps {
  schedule: ScheduleDTO;
  onSubmit: (scheduleData: UpdateScheduleFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface UpdateScheduleFormData {
  movieUuid: string;
  cinemaHall: string;
  showDate: string;
  showTime: string;
  endTime: string;
  totalSeats: number;
  price: number;
}

const EditScheduleForm = ({ schedule, onSubmit, onCancel, isLoading = false }: EditScheduleFormProps) => {
  const [formData, setFormData] = useState<UpdateScheduleFormData>({
    movieUuid: schedule.movieUuid,
    cinemaHall: schedule.cinemaHall,
    showDate: schedule.showDate,
    showTime: schedule.showTime,
    endTime: schedule.endTime,
    totalSeats: schedule.totalSeats,
    price: schedule.price,
  });

  const [movies, setMovies] = useState<Array<{ uuid: string; title: string }>>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);

  useEffect(() => {
    setFormData({
      movieUuid: schedule.movieUuid,
      cinemaHall: schedule.cinemaHall,
      showDate: schedule.showDate,
      showTime: schedule.showTime,
      endTime: schedule.endTime,
      totalSeats: schedule.totalSeats,
      price: schedule.price,
    });
  }, [schedule]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoadingMovies(true);
      const result = await moviesAPI.getMovies({ page: 0, size: 100, isActive: true });
      if (result.success) {
        setMovies(result.data.items.map(movie => ({ uuid: movie.uuid, title: movie.title })));
      }
      setLoadingMovies(false);
    };
    fetchMovies();
  }, []);

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

  const cinemaHalls = ['Hall 1', 'Hall 2', 'Hall 3', 'Hall 4', 'Hall 5'];

  return (
    <form className="schedule-form" onSubmit={handleSubmit}>
      <div className="schedule-form__fields">
        <div className="schedule-form__field">
          <Label htmlFor="movieUuid">Movie *</Label>
          <Select
            id="movieUuid"
            name="movieUuid"
            value={formData.movieUuid}
            onChange={handleInputChange}
            placeholder="Select a movie"
            required
            disabled={isLoading || loadingMovies}
          >
            <option value="">Select a movie</option>
            {movies.map(movie => (
              <option key={movie.uuid} value={movie.uuid}>
                {movie.title}
              </option>
            ))}
          </Select>
        </div>

        <div className="schedule-form__field">
          <Label htmlFor="cinemaHall">Cinema Hall *</Label>
          <Select
            id="cinemaHall"
            name="cinemaHall"
            value={formData.cinemaHall}
            onChange={handleInputChange}
            placeholder="Select a hall"
            required
            disabled={isLoading}
          >
            <option value="">Select a hall</option>
            {cinemaHalls.map(hall => (
              <option key={hall} value={hall}>
                {hall}
              </option>
            ))}
          </Select>
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
              <span>Updating...</span>
            </>
          ) : (
            'Update Schedule'
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditScheduleForm;
