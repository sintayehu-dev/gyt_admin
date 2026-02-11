import { ReactNode } from 'react';
import './Label.css';

interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
}

const Label = ({ children, htmlFor, required = false }: LabelProps) => {
  return (
    <label
      className="label text-body-4"
      htmlFor={htmlFor}
    >
      {children}
      {required && <span className="label__required">*</span>}
    </label>
  );
};

export default Label;
