import SearchInput from '../atoms/SearchInput';
import Button from '../atoms/Button';
import './PageControls.css';

const PageControls = ({ 
  searchValue, 
  onSearchChange, 
  onFilter, 
  onExport,
  showFilter = true,
  showExport = true 
}) => {
  return (
    <div className="page-controls">
      <SearchInput
        placeholder="Search"
        value={searchValue}
        onChange={onSearchChange}
      />
      
      <div className="page-controls__actions">
        {showFilter && (
          <Button
            variant="secondary"
            onClick={onFilter}
            className="page-controls__button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span className="text-body-3">Filter</span>
          </Button>
        )}
        
        {showExport && (
          <Button
            variant="secondary"
            onClick={onExport}
            className="page-controls__button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="text-body-3">Export</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PageControls;

