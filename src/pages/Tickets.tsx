import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Ticket as TicketIcon,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import { Ticket } from '../types/ticket';
import {
  subscribeToTickets,
  updateTicketStatus,
  resolveTicket,
  deleteTicket,
  deleteTicketsByIds,
  deleteAllTickets,
} from '../firebase/tickets';
import { TicketTable } from '../components/TicketTable/TicketTable';
import { TicketFilters } from '../components/TicketTable/TicketFilters';
import { TicketDetailsModal } from '../components/TicketDetails/TicketDetailsModal';
import { ResolutionModal } from '../components/TicketDetails/ResolutionModal';
import { DeviceHistoryModal } from '../components/DeviceTable/DeviceHistoryModal';
import { DeleteConfirmModal } from '../components/TicketDetails/DeleteConfirmModal';
import { EmptyState } from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Tickets: React.FC = () => {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states initialized from URL params if present
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || 'all');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || 'all');
  const [problemFilter, setProblemFilter] = useState(searchParams.get('problem') || 'all');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | '7days' | '15days' | '30days' | 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [resolvingTicket, setResolvingTicket] = useState<Ticket | null>(null);
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [historyDeviceId, setHistoryDeviceId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Delete Modals
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [isDeleteSingleOpen, setIsDeleteSingleOpen] = useState(false);
  const [isDeletePeriodOpen, setIsDeletePeriodOpen] = useState(false);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToTickets(liveTickets => {
      setTickets(liveTickets);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Update filters if URL params change
  useEffect(() => {
    const urlStatus = searchParams.get('status');
    const urlPriority = searchParams.get('priority');
    if (urlStatus) setStatusFilter(urlStatus);
    if (urlPriority) setPriorityFilter(urlPriority);
  }, [searchParams]);

  // Compute Period Label
  const periodLabel = useMemo(() => {
    if (dateFilter === '7days') return t('common.last7Days');
    if (dateFilter === '15days') return t('common.last15Days');
    if (dateFilter === '30days') return t('common.last30Days');
    if (dateFilter === 'custom') {
      if (startDate && endDate) return `${t('common.fromDate')} ${startDate} ${t('common.toDate')} ${endDate}`;
      if (startDate) return `${t('common.fromDate')} ${startDate}`;
      if (endDate) return `${t('common.toDate')} ${endDate}`;
      return t('common.customRange');
    }
    return t('common.allTime');
  }, [dateFilter, startDate, endDate, t]);

  // Filtering Logic
  const filteredTickets = useMemo(() => {
    const nowMs = Date.now();
    const sevenDaysAgo = nowMs - 7 * 24 * 60 * 60 * 1000;
    const fifteenDaysAgo = nowMs - 15 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = nowMs - 30 * 24 * 60 * 60 * 1000;
    const customStartMs = startDate ? new Date(`${startDate}T00:00:00`).getTime() : null;
    const customEndMs = endDate ? new Date(`${endDate}T23:59:59`).getTime() : null;

    return tickets.filter(ticket => {
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchNumber = ticket.ticketNumber?.toLowerCase().includes(term);
        const matchName = ticket.name?.toLowerCase().includes(term);
        const matchDevice = ticket.deviceId?.toLowerCase().includes(term);
        const matchProblem = ticket.problemType?.toLowerCase().includes(term);
        const matchDesc = ticket.problemDescription?.toLowerCase().includes(term);
        const matchDept = ticket.department?.toLowerCase().includes(term);
        const matchLab = ticket.labNumber ? `lab ${ticket.labNumber}`.includes(term) : false;

        if (
          !matchNumber &&
          !matchName &&
          !matchDevice &&
          !matchProblem &&
          !matchDesc &&
          !matchDept &&
          !matchLab
        ) {
          return false;
        }
      }

      // Status
      if (statusFilter !== 'all' && ticket.status !== statusFilter) {
        return false;
      }

      // Priority
      if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) {
        return false;
      }

      // Location
      if (locationFilter !== 'all' && ticket.locationType !== locationFilter) {
        return false;
      }

      // Problem Type
      if (problemFilter !== 'all' && ticket.problemType !== problemFilter) {
        return false;
      }

      // Date Filtering
      if (dateFilter !== 'all') {
        const ticketDate = new Date(ticket.createdAt).getTime();

        if (dateFilter === '7days') {
          if (ticketDate < sevenDaysAgo) return false;
        } else if (dateFilter === '15days') {
          if (ticketDate < fifteenDaysAgo) return false;
        } else if (dateFilter === '30days') {
          if (ticketDate < thirtyDaysAgo) return false;
        } else if (dateFilter === 'custom') {
          if (customStartMs !== null && ticketDate < customStartMs) return false;
          if (customEndMs !== null && ticketDate > customEndMs) return false;
        }
      }

      return true;
    });
  }, [
    tickets,
    searchTerm,
    statusFilter,
    priorityFilter,
    locationFilter,
    problemFilter,
    dateFilter,
    startDate,
    endDate,
  ]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setLocationFilter('all');
    setProblemFilter('all');
    setDateFilter('all');
    setStartDate('');
    setEndDate('');
    setSearchParams({});
  };

  // Actions
  const handleStartWorking = async (ticketId: string) => {
    try {
      const updated = await updateTicketStatus(ticketId, 'in-progress', user?.email || 'IT Admin');
      if (selectedTicket?.id === ticketId) setSelectedTicket(updated);
      showSuccess(t('common.statusChangedInProgress'), t('common.statusUpdated'));
    } catch (err: any) {
      showError(err.message || t('common.error'), t('common.error'));
    }
  };

  const handleOpenResolve = (ticket: Ticket) => {
    setIsDetailsOpen(false);
    setResolvingTicket(ticket);
    setIsResolveOpen(true);
  };

  const handleConfirmResolve = async (ticketId: string, note: string) => {
    try {
      const updated = await resolveTicket(ticketId, note, user?.email || 'IT Admin');
      if (selectedTicket?.id === ticketId) setSelectedTicket(updated);
      setIsResolveOpen(false);
      setResolvingTicket(null);
      showSuccess(t('common.ticketResolvedSuccess'), t('common.success'));
    } catch (err: any) {
      showError(err.message || t('common.error'), t('common.error'));
    }
  };

  const handleCloseTicket = async (ticketId: string) => {
    try {
      const updated = await updateTicketStatus(ticketId, 'closed');
      if (selectedTicket?.id === ticketId) setSelectedTicket(updated);
      showSuccess(t('common.ticketClosedSuccess'), t('common.success'));
    } catch (err: any) {
      showError(err.message || t('common.error'), t('common.error'));
    }
  };

  const handleReopenTicket = async (ticketId: string) => {
    try {
      const updated = await updateTicketStatus(ticketId, 'in-progress');
      if (selectedTicket?.id === ticketId) setSelectedTicket(updated);
      showSuccess(t('common.ticketReopenedSuccess'), t('common.success'));
    } catch (err: any) {
      showError(err.message || t('common.error'), t('common.error'));
    }
  };

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailsOpen(true);
  };

  const handleViewDeviceHistory = (deviceId: string) => {
    setIsDetailsOpen(false);
    setHistoryDeviceId(deviceId);
    setIsHistoryOpen(true);
  };

  // Delete Handlers
  const handleRequestDeleteSingle = (ticket: Ticket) => {
    setTicketToDelete(ticket);
    setIsDeleteSingleOpen(true);
  };

  const handleConfirmDeleteSingle = async () => {
    if (!ticketToDelete) return;
    try {
      await deleteTicket(ticketToDelete.id);
      if (selectedTicket?.id === ticketToDelete.id) {
        setIsDetailsOpen(false);
        setSelectedTicket(null);
      }
      setTicketToDelete(null);
      showSuccess(t('common.deletedSuccessfully'), t('common.success'));
    } catch (err: any) {
      showError(err.message || t('common.error'), t('common.error'));
    }
  };

  const handleRequestDeleteFromDetails = async (ticketId: string) => {
    const tkt = tickets.find(x => x.id === ticketId) || selectedTicket;
    if (tkt) {
      handleRequestDeleteSingle(tkt);
    }
  };

  const handleConfirmDeleteAll = async () => {
    try {
      await deleteAllTickets();
      setIsDetailsOpen(false);
      setSelectedTicket(null);
      showSuccess(t('common.deletedSuccessfully'), t('common.success'));
    } catch (err: any) {
      showError(err.message || t('common.error'), t('common.error'));
    }
  };

  const handleConfirmDeletePeriod = async () => {
    const idsToDelete = filteredTickets.map(tkt => tkt.id);
    if (idsToDelete.length === 0) return;
    try {
      await deleteTicketsByIds(idsToDelete);
      setIsDeletePeriodOpen(false);
      if (selectedTicket && idsToDelete.includes(selectedTicket.id)) {
        setIsDetailsOpen(false);
        setSelectedTicket(null);
      }
      showSuccess(t('common.deletedSuccessfully'), t('common.success'));
    } catch (err: any) {
      showError(err.message || t('common.error'), t('common.error'));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('common.allTicketsTitle')}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t('common.liveCount', { count: tickets.length })}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('common.allTicketsSubtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Delete Period Button (if a time filter is active) */}
          {dateFilter !== 'all' && filteredTickets.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsDeletePeriodOpen(true)}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              {t('modals.deletePeriodTickets', { count: filteredTickets.length })}
            </Button>
          )}

          {/* Delete All Button */}
          {tickets.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteAllOpen(true)}
              className="text-rose-600 border-rose-200 hover:bg-rose-50"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              {t('modals.deleteAllTickets', { count: tickets.length })}
            </Button>
          )}

          <Link to="/">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
            >
              {t('dashboard.newTicketButton')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <TicketFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
        problemFilter={problemFilter}
        onProblemChange={setProblemFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onReset={handleResetFilters}
      />

      {/* Ticket Table / Skeleton / Empty State */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200">
          <TableSkeleton rows={7} columns={8} />
        </div>
      ) : filteredTickets.length === 0 ? (
        <EmptyState
          icon={<TicketIcon className="w-10 h-10 text-slate-300" />}
          title={t('common.noMatchingTicketsTitle')}
          description={t('common.noMatchingTicketsDesc')}
          actionText={t('common.resetFilters')}
          onAction={handleResetFilters}
        />
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              {t('common.showingTickets', {
                filtered: filteredTickets.length,
                total: tickets.length,
              })}{' '}
              {dateFilter !== 'all' ? `• (${periodLabel})` : ''}
            </span>
          </div>
          <TicketTable
            tickets={filteredTickets}
            onViewTicket={handleViewDetails}
            onStartWorking={tkt => handleStartWorking(tkt.id)}
            onResolveTicket={handleOpenResolve}
            onDeleteTicket={handleRequestDeleteSingle}
            onDeviceClick={handleViewDeviceHistory}
          />
        </div>
      )}

      {/* Modals */}
      <TicketDetailsModal
        ticket={selectedTicket}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onStartWorking={handleStartWorking}
        onOpenResolveModal={handleOpenResolve}
        onCloseTicket={handleCloseTicket}
        onReopenTicket={handleReopenTicket}
        onDeleteTicket={handleRequestDeleteFromDetails}
        onViewDeviceHistory={handleViewDeviceHistory}
      />

      <ResolutionModal
        ticket={resolvingTicket}
        isOpen={isResolveOpen}
        onClose={() => setIsResolveOpen(false)}
        onConfirm={handleConfirmResolve}
      />

      <DeviceHistoryModal
        deviceId={historyDeviceId}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectTicket={ticketId => {
          const t = tickets.find(x => x.id === ticketId);
          if (t) {
            setIsHistoryOpen(false);
            setSelectedTicket(t);
            setIsDetailsOpen(true);
          }
        }}
      />

      {/* Delete Single Ticket Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteSingleOpen}
        onClose={() => {
          setIsDeleteSingleOpen(false);
          setTicketToDelete(null);
        }}
        onConfirm={handleConfirmDeleteSingle}
        ticket={ticketToDelete}
        mode="single"
      />

      {/* Delete Period Tickets Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeletePeriodOpen}
        onClose={() => setIsDeletePeriodOpen(false)}
        onConfirm={handleConfirmDeletePeriod}
        mode="period"
        totalCount={filteredTickets.length}
        periodLabel={periodLabel}
      />

      {/* Delete All Tickets Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteAllOpen}
        onClose={() => setIsDeleteAllOpen(false)}
        onConfirm={handleConfirmDeleteAll}
        mode="all"
        totalCount={tickets.length}
      />
    </div>
  );
};
