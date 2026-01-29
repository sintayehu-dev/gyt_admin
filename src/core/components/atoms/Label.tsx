/**
 * Label Atom Component
 * 
 * Reusable label component for form fields with Tailwind CSS
 */

import './Label.css';

const Label = ({ children, htmlFor, required = false }) => {
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
