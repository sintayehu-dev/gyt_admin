import { useState } from 'react';
import TablePageTemplate from '../../../core/components/templates/TablePageTemplate';
import PageControls from '../../../core/components/molecules/PageControls';
import DataTable from '../../../core/components/organisms/DataTable';
import TableActions from '../../../core/components/molecules/TableActions';
import Pagination from '../../../core/components/molecules/Pagination';
import './ParentManagementPage.css';

const ParentManagementPage = () => {
    const [searchValue, setSearchValue] = useState('');
    const [currentSort, setCurrentSort] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

  // Sample data
  const parents = [
    {
      id: 1,
      name: 'Bamlak Tesfaye',
      avatar: 'https://i.pravatar.cc/150?img=10',
      phoneNumber: '0987654321',
      children: 2,
      dateJoined: '12-Oct-2025',
      driverStatus: 'Assigned'
    },
    {
      id: 2,
      name: 'Bamlak Tesfaye',
      avatar: 'https://i.pravatar.cc/150?img=11',
      phoneNumber: '0987654321',
      children: 3,
      dateJoined: '12-Oct-2025',
      driverStatus: 'Assigned'
    },
    {
      id: 3,
      name: 'Bamlak Tesfaye',
      avatar: 'https://i.pravatar.cc/150?img=12',
      phoneNumber: '0987654321',
      children: 1,
      dateJoined: '12-Oct-2025',
      driverStatus: 'Online'
    },
    {
      id: 4,
      name: 'Bamlak Tesfaye',
      avatar: 'https://i.pravatar.cc/150?img=13',
      phoneNumber: '0987654321',
      children: 2,
      dateJoined: '12-Oct-2025',
      driverStatus: 'Online'
    },
    {
      id: 5,
      name: 'Bamlak Tesfaye',
      avatar: 'https://i.pravatar.cc/150?img=14',
      phoneNumber: '0987654321',
      children: 2,
      dateJoined: '12-Oct-2025',
      driverStatus: 'Online'
    },
    {
      id: 6,
      name: 'Bamlak Tesfaye',
      avatar: 'https://i.pravatar.cc/150?img=15',
      phoneNumber: '0987654321',
      children: 2,
      dateJoined: '12-Oct-2025',
      driverStatus: 'Online'
    },
  ];

  const columns = [
    {
      key: 'name',
      label: 'PARENT',
      sortable: true,
      render: (row) => (
        <div className="parent-cell">
          <img src={row.avatar} alt={row.name} className="parent-avatar" />
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
      key: 'children',
      label: 'CHILDREN',
      sortable: true,
      render: (row) => (
        <span>{row.children} {row.children === 1 ? 'children' : 'children'}</span>
      ),
    },
    {
      key: 'dateJoined',
      label: 'DATE JOINED',
      sortable: true,
    },
    {
      key: 'driverStatus',
      label: 'DRIVER ASSIGNED',
      sortable: true,
      render: (row) => (
        <span className={`driver-status-badge ${row.driverStatus === 'Assigned' ? 'driver-status-badge--assigned' : 'driver-status-badge--online'}`}>
          {row.driverStatus}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (row) => (
        <TableActions
          onView={() => console.log('View parent:', row.id)}
          onEdit={() => console.log('Edit parent:', row.id)}
          onDelete={() => console.log('Delete parent:', row.id)}
        />
      ),
    },
  ];

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSort = (key) => {
        setCurrentSort({ key, direction: currentSort?.key === key && currentSort?.direction === 'asc' ? 'desc' : 'asc' });
    };

    const filteredData = parents.filter((parent) =>
        parent.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        parent.phoneNumber.includes(searchValue)
    );

    return (
        <TablePageTemplate
            title="Parent Mangement"
            pageControls={
                <PageControls
                    searchValue={searchValue}
                    onSearchChange={handleSearchChange}
                    onFilter={() => console.log('Filter')}
                    onExport={() => console.log('Export')}
                />
            }
            table={
                <>
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        onSort={handleSort}
                        currentSort={currentSort}
                        emptyMessage="No parents found"
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

export default ParentManagementPage;

