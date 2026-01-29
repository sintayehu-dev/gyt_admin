import { useState } from 'react';
import TablePageTemplate from '../../../core/components/templates/TablePageTemplate';
import PageControls from '../../../core/components/molecules/PageControls';
import DataTable from '../../../core/components/organisms/DataTable';
import TableActions from '../../../core/components/molecules/TableActions';
import Pagination from '../../../core/components/molecules/Pagination';
import './RiderManagementPage.css';

const RiderManagementPage = () => {
    const [searchValue, setSearchValue] = useState('');
    const [currentSort, setCurrentSort] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Sample data - replace with actual API call
    const riders = [
        {
            id: 1,
            name: 'Bamlak Tesfaye',
            avatar: 'https://i.pravatar.cc/150?img=1',
            phoneNumber: '0987654321',
            dateJoined: '12-Oct-2025',
            status: 'Online'
        },
        {
            id: 2,
            name: 'Bamlak Tesfaye',
            avatar: 'https://i.pravatar.cc/150?img=2',
            phoneNumber: '0987654321',
            dateJoined: '12-Oct-2025',
            status: 'Online'
        },
        {
            id: 3,
            name: 'Bamlak Tesfaye',
            avatar: 'https://i.pravatar.cc/150?img=3',
            phoneNumber: '0987654321',
            dateJoined: '12-Oct-2025',
            status: 'Online'
        },
        {
            id: 4,
            name: 'Bamlak Tesfaye',
            avatar: 'https://i.pravatar.cc/150?img=4',
            phoneNumber: '0987654321',
            dateJoined: '12-Oct-2025',
            status: 'Online'
        },
        {
            id: 5,
            name: 'Bamlak Tesfaye',
            avatar: 'https://i.pravatar.cc/150?img=5',
            phoneNumber: '0987654321',
            dateJoined: '12-Oct-2025',
            status: 'Online'
        },
        {
            id: 6,
            name: 'Bamlak Tesfaye',
            avatar: 'https://i.pravatar.cc/150?img=6',
            phoneNumber: '0987654321',
            dateJoined: '12-Oct-2025',
            status: 'Online'
        },
    ];

    const columns = [
        {
            key: 'name',
            label: 'NAME',
            sortable: true,
            render: (row) => (
                <div className="rider-cell">
                    <img src={row.avatar} alt={row.name} className="rider-avatar" />
                    <span>{row.name}</span>
                </div>
            ),
        },
        {
            key: 'phoneNumber',
            label: 'PHONE NUMBER',
            sortable: true,
        },
        {
            key: 'dateJoined',
            label: 'DATE JOINED',
            sortable: true,
        },
        {
            key: 'status',
            label: 'STATUS',
            sortable: true,
            render: (row) => (
                <span className={`status-badge ${row.status === 'Online' ? 'status-badge--online' : 'status-badge--offline'}`}>
                    {row.status}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'ACTIONS',
            render: (row) => (
                <TableActions
                    onView={() => handleView(row.id)}
                    onEdit={() => handleEdit(row.id)}
                    onDelete={() => handleDelete(row.id)}
                />
            ),
        },
    ];

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleFilter = () => {
        console.log('Filter clicked');
    };

    const handleExport = () => {
        console.log('Export clicked');
    };

    const handleSort = (key) => {
        setCurrentSort({ key, direction: currentSort?.key === key && currentSort?.direction === 'asc' ? 'desc' : 'asc' });
    };

    const handleView = (id) => {
        console.log('View rider:', id);
    };

    const handleEdit = (id) => {
        console.log('Edit rider:', id);
    };

    const handleDelete = (id) => {
        console.log('Delete rider:', id);
    };

    // Filter data based on search
    const filteredData = riders.filter((rider) =>
        rider.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        rider.phoneNumber.includes(searchValue)
    );

    return (
        <TablePageTemplate
            title="Riders Mangement"
            pageControls={
                <PageControls
                    searchValue={searchValue}
                    onSearchChange={handleSearchChange}
                    onFilter={handleFilter}
                    onExport={handleExport}
                />
            }
            table={
                <>
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        onSort={handleSort}
                        currentSort={currentSort}
                        emptyMessage="No riders found"
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={100}
                        onPageChange={setCurrentPage}
                    />
                </>
            }
        />
    );
};

export default RiderManagementPage;

