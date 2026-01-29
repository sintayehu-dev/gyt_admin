import { useState, useMemo, useCallback } from 'react';
import TablePageTemplate from '../../../core/components/templates/TablePageTemplate';
import SearchInput from '../../../core/components/atoms/SearchInput';
import Select from '../../../core/components/atoms/Select';
import DataTable from '../../../core/components/organisms/DataTable';
import ActionButtons from '../../../core/components/molecules/ActionButtons';
import ConfirmDialog from '../../../core/components/molecules/ConfirmDialog';
import useTickets from '../hooks/useTickets';
import { TicketDTO } from '../api/tickets.dto';
import { useToast } from '../../../core/context/ToastContext';
import './TicketsPage.css';

const TicketsPage = () => {
  const { 
    tickets, 
    pagination, 
    isLoading, 
    error, 
    updateSearch, 
    updateStatus,
    updatePage, 
    updatePageSize,
    deleteTicket,
    isDeleting,
  } = useTickets();

  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketDTO | null>(null);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    updateSearch(value);
  }, [updateSearch]);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusFilter(value);
    updateStatus(value as any);
  }, [updateStatus]);

  const handlePageChange = useCallback((page: number) => {
    updatePage(page);
  }, [updatePage]);

  const handlePageSizeChange = useCallback((size: number) => {
    updatePageSize(size);
  }, [updatePageSize]);

  const handleDelete = useCallback((ticket: TicketDTO) => {
    setSelectedTicket(ticket);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedTicket(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedTicket) return;
    
    const result = await deleteTicket(selectedTicket.uuid);
    
    if (result.success) {
      setIsDeleteDialogOpen(false);
      setSelectedTicket(null);
      showToast('Ticket deleted successfully', 'success');
    } else {
      showToast(`Failed to delete ticket: ${result.error}`, 'error');
    }
  }, [selectedTicket, deleteTicket, showToast]);

  const columns = useMemo(() => [
    {
      key: 'seatNumber',
      label: 'SEAT',
      render: (ticket: TicketDTO) => (
        <div>
          <div className="tickets-page__seat">{ticket.seatNumber}</div>
          <div className="tickets-page__user">User: {ticket.userUuid.substring(0, 8)}...</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (ticket: TicketDTO) => (
        <span className={`tickets-page__status tickets-page__status--${ticket.status}`}>
          {ticket.status}
        </span>
      ),
    },
    {
      key: 'price',
      label: 'PRICE',
      render: (ticket: TicketDTO) => (
        <div className="tickets-page__price">
          ${ticket.price.toFixed(2)}
        </div>
      ),
    },
    {
      key: 'bookingDate',
      label: 'BOOKING DATE',
      render: (ticket: TicketDTO) => (
        <div className="tickets-page__date">
          <span className="tickets-page__date-value">{ticket.formattedBookingDate}</span>
        </div>
      ),
    },
    {
      key: 'paymentDate',
      label: 'PAYMENT DATE',
      render: (ticket: TicketDTO) => (
        <div className="tickets-page__date">
          <span className="tickets-page__date-value">{ticket.formattedPaymentDate}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (ticket: TicketDTO) => (
        <ActionButtons
          onDelete={() => handleDelete(ticket)}
        />
      ),
    },
  ], [handleDelete]);

  const paginationData = useMemo(() => {
    if (!pagination) return null;
    
    return {
      page: pagination.page + 1,
      size: pagination.size,
      totalItems: pagination.totalItems,
      totalPages: pagination.totalPages,
    };
  }, [pagination]);

  const pageControls = useMemo(() => (
    <div className="tickets-page__controls">
      <div className="tickets-page__filters">
        <SearchInput
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <Select
          name="status"
          value={statusFilter}
          onChange={handleStatusChange}
          placeholder="All Statuses"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </Select>
      </div>
    </div>
  ), [searchTerm, statusFilter, handleSearch, handleStatusChange]);

  return (
    <>
      <TablePageTemplate
        title="Tickets"
        pageControls={pageControls}
        table={
          <DataTable
            columns={columns}
            data={tickets}
            isLoading={isLoading}
            error={error}
            pagination={paginationData}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            emptyMessage="No tickets found"
          />
        }
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Ticket"
        message={
          selectedTicket ? (
            <>
              Are you sure you want to delete ticket for seat <strong>"{selectedTicket.seatNumber}"</strong>?
              <br />
              This action cannot be undone.
            </>
          ) : (
            'Are you sure you want to delete this ticket?'
          )
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
};

export default TicketsPage;
