import { useRef, useEffect, useState } from 'react';
import './InfiniteMultiSelect.css';

interface InfiniteMultiSelectProps {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  name: string;
  disabled?: boolean;
  error?: boolean;
  onScrollEnd?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  id?: string;
  label?: string;
}

const InfiniteMultiSelect = ({
  options = [],
  placeholder = 'Select items',
  selectedValues = [],
  onChange,
  name,
  disabled = false,
  error = false,
  onScrollEnd,
  isLoadingMore = false,
  hasMore = false,
  label,
  ...props
}: InfiniteMultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const listElement = listRef.current;
    if (!listElement || !onScrollEnd) return;

    const handleScroll = () => {
      const scrollTop = listElement.scrollTop;
      const scrollHeight = listElement.scrollHeight;
      const clientHeight = listElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight * 0.8 && hasMore && !isLoadingMore) {
        onScrollEnd();
      }
    };

    listElement.addEventListener('scroll', handleScroll);
    return () => listElement.removeEventListener('scroll', handleScroll);
  }, [onScrollEnd, hasMore, isLoadingMore]);

  const handleToggle = (value: string) => {
    if (disabled) return;
    
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    
    onChange(newValues);
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(selectedValues.filter(v => v !== value));
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLabels = selectedValues
    .map(value => options.find(opt => opt.value === value)?.label)
    .filter(Boolean);

  return (
    <div className="infinite-multi-select" ref={dropdownRef} {...props}>
      <div
        className={`infinite-multi-select__trigger ${error ? 'infinite-multi-select__trigger--error' : ''} ${disabled ? 'infinite-multi-select__trigger--disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="infinite-multi-select__selected">
          {selectedLabels.length === 0 ? (
            <span className="infinite-multi-select__placeholder">{placeholder}</span>
          ) : (
            <div className="infinite-multi-select__tags">
              {selectedLabels.map((label, index) => (
                <span key={selectedValues[index]} className="infinite-multi-select__tag">
                  {label}
                  <button
                    type="button"
                    className="infinite-multi-select__tag-remove"
                    onClick={(e) => handleRemove(selectedValues[index], e)}
                    disabled={disabled}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="infinite-multi-select__arrow">▼</span>
      </div>

      {isOpen && (
        <div className="infinite-multi-select__dropdown">
          <div className="infinite-multi-select__search">
            <input
              type="text"
              className="infinite-multi-select__search-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="infinite-multi-select__list" ref={listRef}>
            {filteredOptions.length === 0 && !isLoadingMore ? (
              <div className="infinite-multi-select__empty">No options found</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`infinite-multi-select__option ${
                    selectedValues.includes(option.value) ? 'infinite-multi-select__option--selected' : ''
                  }`}
                  onClick={() => handleToggle(option.value)}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => {}}
                    className="infinite-multi-select__checkbox"
                  />
                  <span>{option.label}</span>
                </div>
              ))
            )}
            {isLoadingMore && (
              <div className="infinite-multi-select__loading">Loading more...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfiniteMultiSelect;
