import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TablePageTemplate from '../../../core/components/templates/TablePageTemplate';
import SearchInput from '../../../core/components/atoms/SearchInput';
import Select from '../../../core/components/atoms/Select';
import InfiniteSelect from '../../../core/components/atoms/InfiniteSelect';
import DataTable from '../../../core/components/organisms/DataTable';
import ActionButtons from '../../../core/components/molecules/ActionButtons';
import ConfirmDialog from '../../../core/components/molecules/ConfirmDialog';
import useTickets from '../hooks/useTickets';
import useSchedulesForDropdown from '../../schedules/hooks/useSchedulesForDropdown';
import { TicketDTO } from '../api/tickets.dto';
import { useToast } from '../../../core/context/ToastContext';
import { ROUTE_PATHS } from '../../../core/routes/routeNames';
import './TicketsPage.css';

const TicketsPage = () => {
  const navigate = useNavigate();
  const { 
    tickets, 
    pagination, 
    isLoading, 
    error, 
    updateSearch, 
    updateStatus,
    updateSchedule,
    updatePage, 
    updatePageSize,
    deleteTicket,
    isDeleting,
  } = useTickets();

  const { schedules, isLoading: loadingSchedules, fetchNextPage, hasNextPage, isFetchingNextPage } = useSchedulesForDropdown();

  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [scheduleFilter, setScheduleFilter] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketDTO | null>(null);

  const handleView = useCallback((ticket: TicketDTO) => {
    navigate(ROUTE_PATHS.TICKET_DETAIL.replace(':id', ticket.uuid));
  }, [navigate]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    updateSearch(value);
  }, [updateSearch]);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusFilter(value);
    updateStatus(value as any);
  }, [updateStatus]);

  const handleScheduleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setScheduleFilter(value);
    updateSchedule(value);
  }, [updateSchedule]);

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
        <span className="tickets-page__seat">{ticket.seatNumber}</span>
      ),
    },
    {
      key: 'user',
      label: 'CUSTOMER',
      render: (ticket: TicketDTO) => (
        <div className="tickets-page__customer">
          <div className="tickets-page__customer-name">{ticket.user?.name || 'N/A'}</div>
          <div className="tickets-page__customer-email">{ticket.user?.email || 'N/A'}</div>
        </div>
      ),
    },
    {
      key: 'movie',
      label: 'MOVIE',
      render: (ticket: TicketDTO) => (
        <div className="tickets-page__movie">
          <div className="tickets-page__movie-title">{ticket.schedule?.movie?.title || 'N/A'}</div>
          <div className="tickets-page__movie-hall">{ticket.schedule?.cinemaHall || 'N/A'}</div>
        </div>
      ),
    },
    {
      key: 'showTime',
      label: 'SHOW TIME',
      render: (ticket: TicketDTO) => (
        <div className="tickets-page__showtime">
          <div className="tickets-page__showtime-date">{ticket.schedule?.showDate || 'N/A'}</div>
          <div className="tickets-page__showtime-time">{ticket.schedule?.showTime || 'N/A'}</div>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'PRICE',
      render: (ticket: TicketDTO) => (
        <span className="tickets-page__price">${ticket.price.toFixed(2)}</span>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (ticket: TicketDTO) => (
        <span className={`tickets-page__status tickets-page__status--${ticket.status.toLowerCase()}`}>
          {ticket.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (ticket: TicketDTO) => (
        <ActionButtons
          onView={() => handleView(ticket)}
          onDelete={() => handleDelete(ticket)}
        />
      ),
    },
  ], [handleView, handleDelete]);

  const paginationData = useMemo(() => {
    if (!pagination) return null;
    
    return {
      page: pagination.page + 1,
      size: pagination.size,
      totalItems: pagination.totalItems,
      totalPages: pagination.totalPages,
    };
  }, [pagination]);

  const scheduleOptions = useMemo(() => {
    return schedules.map(schedule => ({
      value: schedule.uuid,
      label: `${schedule.movie.title} - ${schedule.formattedShowDate} ${schedule.formattedShowTime} (${schedule.cinemaHall})`,
    }));
  }, [schedules]);

  const pageControls = useMemo(() => (
    <div className="tickets-page__controls">
      <div className="tickets-page__filters">
        <SearchInput
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <InfiniteSelect
          name="schedule"
          value={scheduleFilter}
          onChange={handleScheduleChange}
          placeholder="All Schedules"
          options={scheduleOptions as any}
          onScrollEnd={() => hasNextPage && fetchNextPage()}
          isLoadingMore={isFetchingNextPage}
          hasMore={hasNextPage}
          disabled={loadingSchedules}
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
          <option value="EXPIRED">Expired</option>
        </Select>
      </div>
    </div>
  ), [searchTerm, scheduleFilter, statusFilter, scheduleOptions, handleSearch, handleScheduleChange, handleStatusChange, hasNextPage, fetchNextPage, isFetchingNextPage, loadingSchedules]);

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
