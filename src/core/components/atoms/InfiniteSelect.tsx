import { useRef, useEffect } from 'react';
import './Select.css';

interface InfiniteSelectProps {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  disabled?: boolean;
  error?: boolean;
  onScrollEnd?: () => void;
  isLoadingMore?: boolean; 
  hasMore?: boolean;
  id?: string;
  required?: boolean;
}

const InfiniteSelect = ({
  options = [],
  placeholder,
  value,
  onChange,
  name,
  disabled = false,
  error = false,
  onScrollEnd,
  isLoadingMore = false,
  hasMore = false,
  ...props
}: InfiniteSelectProps) => {
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const selectElement = selectRef.current;
    if (!selectElement || !onScrollEnd) return;

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLSelectElement;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      // Load more when scrolled to 80% of the list
      if (scrollTop + clientHeight >= scrollHeight * 0.8 && hasMore && !isLoadingMore) {
        onScrollEnd();
      }
    };

    selectElement.addEventListener('scroll', handleScroll);
    return () => selectElement.removeEventListener('scroll', handleScroll);
  }, [onScrollEnd, hasMore, isLoadingMore]);

  return (
    <select
      ref={selectRef}
      className={`select text-body-4 ${error ? 'select--error' : ''}`}
      value={value}
      onChange={onChange}
      name={name}
      disabled={disabled}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
      {isLoadingMore && (
        <option disabled>Loading more...</option>
      )}
    </select>
  );
};

export default InfiniteSelect;
