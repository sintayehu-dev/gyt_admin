import './TablePageTemplate.css';

const TablePageTemplate = ({
  title,
  pageControls,
  table
}) => {
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

