import Pagination from '../molecules/Pagination';
import LoadingSpinner from '../atoms/LoadingSpinner';
import './DataTable.css';

interface Column {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (row: any) => React.ReactNode;
}

interface PaginationData {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    onSort?: (key: string) => void;
    currentSort?: { key: string; direction: 'asc' | 'desc' };
    emptyMessage?: string;
    isLoading?: boolean;
    error?: string | null;
    pagination?: PaginationData | null;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    onView?: (row: any) => void;
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
}

const DataTable = ({
    columns,
    data,
    onSort,
    currentSort,
    emptyMessage = 'No data available',
    isLoading = false,
    error = null,
    pagination,
    onPageChange,
    onPageSizeChange,
}: DataTableProps) => {
    if (error) {
        return (
            <div className="data-table">
                <div className="data-table__error">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="data-table">
            <div className="data-table__wrapper">
                <table className="data-table__table">
                    <thead className="data-table__thead">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`data-table__th text-body-5 ${column.sortable ? 'data-table__th--sortable' : ''}`}
                                    onClick={() => column.sortable && onSort && onSort(column.key)}
                                >
                                    <div className="data-table__th-content">
                                        {column.label}
                                        {column.sortable && (
                                            <svg
                                                className={`data-table__sort-icon ${currentSort?.key === column.key ? 'data-table__sort-icon--active' : ''}`}
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <polyline points="18 15 12 9 6 15" />
                                            </svg>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="data-table__tbody">
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length} className="data-table__loading">
                                    <LoadingSpinner size="medium" message="Loading data..." />
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="data-table__empty text-body-3">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="data-table__tr">
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className="data-table__td text-body-3">
                                            {column.render ? column.render(row) : row[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && onPageChange && onPageSizeChange && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    pageSize={pagination.size}
                    totalItems={pagination.totalItems}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                />
            )}
        </div>
    );
};

export default DataTable;
