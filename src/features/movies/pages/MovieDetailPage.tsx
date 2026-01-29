import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../../core/components/atoms/LoadingSpinner';
import Button from '../../../core/components/atoms/Button';
import { ROUTE_PATHS } from '../../../core/routes/routeNames';
import useMovieDetail from '../hooks/useMovieDetail';
import './MovieDetailPage.css';

const MovieDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: movieData, isLoading, error, refetch } = useMovieDetail(id);

  const handleBack = () => {
    navigate(ROUTE_PATHS.MOVIES);
  };

  const handleEdit = () => {
    console.log('Edit movie:', id);
  };

  const handleDelete = () => {
    console.log('Delete movie:', id);
  };

  const transformedMovieData = useMemo(() => {
    console.log('[Page] movieData:', movieData);
    
    if (!movieData) {
      console.log('[Page] No movieData, returning null');
      return null;
    }

    const transformed = {
      uuid: movieData.uuid || '',
      title: movieData.title || 'N/A',
      description: movieData.description || 'No description available',
      duration: movieData.formattedDuration || 'N/A',
      releaseDate: movieData.formattedReleaseDate || 'N/A',
      language: movieData.language || 'N/A',
      genres: movieData.genres || [],
      directors: movieData.directors || [],
      stars: movieData.stars || [],
      posterUrl: movieData.posterUrl || '',
      trailerUrl: movieData.trailerUrl || '',
      isActive: movieData.isActive ?? false,
    };
    
    console.log('[Page] Transformed data:', transformed);
    console.log('[Page] duration:', transformed.duration);
    console.log('[Page] releaseDate:', transformed.releaseDate);
    
    return transformed;
  }, [movieData]);

  if (isLoading) {
    return (
      <div className="movie-detail-page">
        <div className="movie-detail-page__header">
          <div className="movie-detail-page__header-left">
            <button className="movie-detail-page__back-btn" onClick={handleBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="movie-detail-page__header-info">
              <h1 className="movie-detail-page__title text-h5">Movie Details</h1>
            </div>
          </div>
        </div>
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-detail-page">
        <div className="movie-detail-page__header">
          <div className="movie-detail-page__header-left">
            <button className="movie-detail-page__back-btn" onClick={handleBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="movie-detail-page__header-info">
              <h1 className="movie-detail-page__title text-h5">Movie Details</h1>
            </div>
          </div>
        </div>
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ color: '#DC2626', marginBottom: '1rem', fontSize: '1rem' }}>
            {error}
          </div>
          <Button variant="primary" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!transformedMovieData) {
    return (
      <div className="movie-detail-page">
        <div className="movie-detail-page__header">
          <div className="movie-detail-page__header-left">
            <button className="movie-detail-page__back-btn" onClick={handleBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="movie-detail-page__header-info">
              <h1 className="movie-detail-page__title text-h5">Movie Details</h1>
            </div>
          </div>
        </div>
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ color: '#6B7280', fontSize: '1rem' }}>No movie data found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      {/* Header */}
      <div className="movie-detail-page__header">
        <div className="movie-detail-page__header-left">
          <button className="movie-detail-page__back-btn" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="movie-detail-page__header-info">
            <h1 className="movie-detail-page__title text-h5">Movie Details</h1>
            <div className="movie-detail-page__breadcrumb">
              <span className="movie-detail-page__breadcrumb-item text-body-3">Movies</span>
              <span className="movie-detail-page__breadcrumb-separator">›</span>
              <span className="movie-detail-page__breadcrumb-item movie-detail-page__breadcrumb-item--active text-body-3">
                {transformedMovieData.title}
              </span>
            </div>
          </div>
        </div>
        <div className="movie-detail-page__header-actions">
          <Button variant="secondary" onClick={handleEdit}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span className="text-body-3">Edit</span>
          </Button>
          <Button variant="secondary" onClick={handleDelete}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <span className="text-body-3">Delete</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="movie-detail-page__content">
        <div className="movie-detail-page__main">
          <div className="movie-detail-page__poster-section">
            {transformedMovieData.posterUrl ? (
              <img
                src={transformedMovieData.posterUrl}
                alt={transformedMovieData.title}
                className="movie-detail-page__poster"
              />
            ) : (
              <div className="movie-detail-page__poster-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
          </div>

          <div className="movie-detail-page__info-section">
            <div className="movie-detail-page__info-card">
              <h2 className="movie-detail-page__section-title text-h6">Basic Information</h2>
              
              <div className="movie-detail-page__info-grid">
                <div className="movie-detail-page__info-item">
                  <span className="movie-detail-page__info-label text-body-4">Title</span>
                  <span className="movie-detail-page__info-value text-body-3">{transformedMovieData.title}</span>
                </div>

                <div className="movie-detail-page__info-item">
                  <span className="movie-detail-page__info-label text-body-4">Language</span>
                  <span className="movie-detail-page__info-value text-body-3">{transformedMovieData.language}</span>
                </div>

                <div className="movie-detail-page__info-item">
                  <span className="movie-detail-page__info-label text-body-4">Duration</span>
                  <span className="movie-detail-page__info-value text-body-3">{transformedMovieData.duration}</span>
                </div>

                <div className="movie-detail-page__info-item">
                  <span className="movie-detail-page__info-label text-body-4">Release Date</span>
                  <span className="movie-detail-page__info-value text-body-3">{transformedMovieData.releaseDate}</span>
                </div>

                <div className="movie-detail-page__info-item">
                  <span className="movie-detail-page__info-label text-body-4">Status</span>
                  <span className={`movie-detail-page__status movie-detail-page__status--${transformedMovieData.isActive ? 'active' : 'inactive'}`}>
                    {transformedMovieData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="movie-detail-page__info-item movie-detail-page__info-item--full">
                <span className="movie-detail-page__info-label text-body-4">Description</span>
                <p className="movie-detail-page__description text-body-3">{transformedMovieData.description}</p>
              </div>
            </div>

            <div className="movie-detail-page__info-card">
              <h2 className="movie-detail-page__section-title text-h6">Genres</h2>
              <div className="movie-detail-page__tags">
                {transformedMovieData.genres && transformedMovieData.genres.length > 0 ? (
                  transformedMovieData.genres.map((genre, index) => (
                    <span key={index} className="movie-detail-page__tag text-body-3">
                      {genre}
                    </span>
                  ))
                ) : (
                  <span className="movie-detail-page__empty text-body-3">No genres specified</span>
                )}
              </div>
            </div>

            <div className="movie-detail-page__info-card">
              <h2 className="movie-detail-page__section-title text-h6">Directors</h2>
              <div className="movie-detail-page__list">
                {transformedMovieData.directors && transformedMovieData.directors.length > 0 ? (
                  transformedMovieData.directors.map((director, index) => (
                    <span key={index} className="movie-detail-page__list-item text-body-3">
                      {director}
                    </span>
                  ))
                ) : (
                  <span className="movie-detail-page__empty text-body-3">No directors specified</span>
                )}
              </div>
            </div>

            <div className="movie-detail-page__info-card">
              <h2 className="movie-detail-page__section-title text-h6">Stars</h2>
              <div className="movie-detail-page__list">
                {transformedMovieData.stars && transformedMovieData.stars.length > 0 ? (
                  transformedMovieData.stars.map((star, index) => (
                    <span key={index} className="movie-detail-page__list-item text-body-3">
                      {star}
                    </span>
                  ))
                ) : (
                  <span className="movie-detail-page__empty text-body-3">No stars specified</span>
                )}
              </div>
            </div>

            {transformedMovieData.trailerUrl && (
              <div className="movie-detail-page__info-card">
                <h2 className="movie-detail-page__section-title text-h6">Trailer</h2>
                <a
                  href={transformedMovieData.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="movie-detail-page__trailer-link text-body-3"
                >
                  Watch Trailer
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
