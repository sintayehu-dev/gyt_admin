import { ReactNode } from 'react';
import './TablePageTemplate.css';

interface TablePageTemplateProps {
  title?: string;
  pageControls?: ReactNode;
  table: ReactNode;
}

const TablePageTemplate = ({
  title,
  pageControls,
  table
}: TablePageTemplateProps) => {
  return (
    <div className="table-page-template">
      {title && <h1 className="table-page-template__title text-h4">{title}</h1>}

      {pageControls && (
        <div className="table-page-template__controls">
          {pageControls}
        </div>
      )}

      <div className="table-page-template__content">
        {table}
      </div>
    </div>
  );
};

export default TablePageTemplate;

