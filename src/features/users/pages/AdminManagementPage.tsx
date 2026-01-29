import { useState } from 'react';
import TablePageTemplate from '../../../core/components/templates/TablePageTemplate';
import PageControls from '../../../core/components/molecules/PageControls';
import DataTable from '../../../core/components/organisms/DataTable';
import TableActions from '../../../core/components/molecules/TableActions';
import Pagination from '../../../core/components/molecules/Pagination';
import Button from '../../../core/components/atoms/Button';
import './AdminManagementPage.css';

const AdminManagementPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [currentSort, setCurrentSort] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data
  const admins = [
    {
      id: 1,
      name: 'Bamlak Tesfaye',
      avatar: 'https://i.pravatar.cc/150?img=20',
      phoneNumber: '0987654321',
      email: 'sample@gmail.com',
      role: 'Manager',
      dateJoined: '12-Oct-2025',
      status: 'Online'
    },
    {
      id: 2,
      name: 'Bamlak Tesfaye',
      avatar: 'https://i.pravatar.cc/150?img=21',
      phoneNumber: '0987654321',
      email: 'sample@gmail.com',
      role: 'Admin',
      dateJoined: '12-Oct-2025',
      status: 'Online'
    },
    {
      id: 3,
      name: 'Bamlak Tesfaye',
      avatar: 'https://i.pravatar.cc/150?img=22',
      phoneNumber: '0987654321',
      email: 'sample@gmail.com',
      role: 'Super Admin',
      dateJoined: '12-Oct-2025',
      status: 'Online'
    },
    {
      id: 4,
      name: 'Bamlak Tesfaye',
      avatar: 'https://i.pravatar.cc/150?img=23',
      phoneNumber: '0987654321',
      email: 'sample@gmail.com',
      role: 'Manager',
      dateJoined: '12-Oct-2025',
      status: 'Online'
    },
    {
      id: 5,
      name: 'Bamlak Tesfaye',
      avatar: 'https://i.pravatar.cc/150?img=24',
      phoneNumber: '0987654321',
      email: 'sample@gmail.com',
      role: 'Manager',
      dateJoined: '12-Oct-2025',
      status: 'Online'
    },
  ];

  const columns = [
    {
      key: 'name',
      label: 'FULL NAME',
      sortable: true,
      render: (row) => (
        <div className="admin-cell">
          <img src={row.avatar} alt={row.name} className="admin-avatar" />
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
      key: 'email',
      label: 'EMAIL ADDRESS',
      sortable: true,
    },
    {
      key: 'role',
      label: 'ROLE',
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
          onView={() => console.log('View admin:', row.id)}
          onEdit={() => console.log('Edit admin:', row.id)}
          onDelete={() => console.log('Delete admin:', row.id)}
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

  const filteredData = admins.filter((admin) =>
    admin.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    admin.phoneNumber.includes(searchValue) ||
    admin.email.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="admin-management-page">
      <div className="admin-management-page__header">
        <h1 className="admin-management-page__title text-h4">Admins</h1>
        <Button
          variant="primary"
          onClick={() => console.log('Add Admin')}
          className="admin-management-page__add-btn"
        >
          <span className="text-body-3">Add Admin</span>
        </Button>
      </div>

      <TablePageTemplate
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
            emptyMessage="No admins found"
          />
          <Pagination
            currentPage={currentPage}
            totalPages={100}
            onPageChange={setCurrentPage}
          />
        </>
      }
      />
    </div>
  );
};

export default AdminManagementPage;

