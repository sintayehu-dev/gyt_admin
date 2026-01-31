import { useRef, useState } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  id?: string;
  name?: string;
  accept?: string;
  onChange: (file: File | null) => void;
  value?: File | null;
  disabled?: boolean;
  preview?: string;
  label?: string;
  maxSize?: number; // in MB
}

const FileUpload = ({
  id,
  name,
  accept = 'image/*',
  onChange,
  value,
  disabled = false,
  preview,
  label = 'Choose File',
  maxSize = 5,
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview || null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (file) {
      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        setError(`File size must be less than ${maxSize}MB`);
        onChange(null);
        setPreviewUrl(null);
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onChange(file);
    } else {
      setPreviewUrl(null);
      onChange(null);
    }
  };

  const handleRemove = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload">
      <input
        ref={fileInputRef}
        id={id}
        name={name}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="file-upload__input"
      />

      {previewUrl ? (
        <div className="file-upload__preview">
          <img src={previewUrl} alt="Preview" className="file-upload__preview-image" />
          <div className="file-upload__preview-overlay">
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="file-upload__remove-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className="file-upload__button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>{label}</span>
          <span className="file-upload__hint">Max size: {maxSize}MB</span>
        </button>
      )}

      {error && <span className="file-upload__error">{error}</span>}
    </div>
  );
};

export default FileUpload;
