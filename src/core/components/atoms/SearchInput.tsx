import './SearchInput.css';

const SearchInput = ({ 
  placeholder = 'Search', 
  value, 
  onChange,
  disabled = false 
}) => {
  return (
    <div className="search-input">
      <svg 
        className="search-input__icon" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        className="search-input__field text-body-3"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default SearchInput;

