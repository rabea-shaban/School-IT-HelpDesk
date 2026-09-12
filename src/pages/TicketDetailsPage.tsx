import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Ticket as TicketIcon,
  MapPin,
  Laptop,
  User,
  Clock,
  CheckCircle2,
  Play,
  RotateCcw,
  Check,
  FileText,
  HelpCircle,
  Wrench,
} from 'lucide-react';
import { Ticket } from '../types/ticket';
import { getTicketById, updateTicketStatus, resolveTicket } from '../firebase/tickets';
import { ResolutionModal } from '../components/TicketDetails/ResolutionModal';
import { DeviceHistoryModal } from '../components/DeviceTable/DeviceHistoryModal';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import {
  formatDateTime,
  getStatusConfig,
  getPriorityConfig,
  formatLocationDisplay,
} from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const TicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [historyDeviceId, setHistoryDeviceId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const fetchTicket = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getTicketById(id);
      setTicket(data);
    } catch (err: any) {
      console.error('Error fetching ticket:', err);
      showError('Failed to load ticket details', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleStartWorking = async () => {
    if (!ticket) return;
    setActionLoading(true);
    try {
      const updated = await updateTicketStatus(ticket.id, 'in-progress', user?.email || 'IT Admin');
      setTicket(updated);
      showSuccess('Ticket status updated to In Progress', 'Working Started');
    } catch (err: any) {
      showError(err.message || 'Failed to update ticket', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmResolve = async (ticketId: string, note: string) => {
    try {
      const updated = await resolveTicket(ticketId, note, user?.email || 'IT Admin');
      setTicket(updated);
      setIsResolveOpen(false);
      showSuccess('Ticket marked as Resolved!', 'Resolved');
    } catch (err: any) {
      showError(err.message || 'Failed to resolve ticket', 'Error');
    }
  };

  const handleCloseTicket = async () => {
    if (!ticket) return;
    setActionLoading(true);
    try {
      const updated = await updateTicketStatus(ticket.id, 'closed');
      setTicket(updated);
      showSuccess('Ticket closed.', 'Closed');
    } catch (err: any) {
      showError(err.message || 'Failed to close ticket', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReopenTicket = async () => {
    if (!ticket) return;
    setActionLoading(true);
    try {
      const updated = await updateTicketStatus(ticket.id, 'in-progress');
      setTicket(updated);
      showSuccess('Ticket reopened.', 'Reopened');
    } catch (err: any) {
      showError(err.message || 'Failed to reopen ticket', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Ticket Not Found</h2>
        <p className="text-sm text-slate-500">The requested ticket does not exist or has been removed.</p>
        <Link to="/tickets">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Tickets
          </Button>
        </Link>
      </div>
    );
  }

  const statusCfg = getStatusConfig(ticket.status);
  const priorityCfg = getPriorityConfig(ticket.priority);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Back button */}
      <div>
        <Link
          to="/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tickets</span>
        </Link>
      </div>

      {/* Main Ticket Card */}
      <Card className="p-0 overflow-hidden">
        <CardHeader className="bg-slate-50/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-extrabold text-school-900 bg-white px-3.5 py-1 rounded-xl border border-slate-200 shadow-sm">
                {ticket.ticketNumber}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${statusCfg.bg}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold ${priorityCfg.badge}`}
              >
                {ticket.priority.toUpperCase()} PRIORITY
              </span>
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-6 sm:p-8 space-y-6">
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Requester */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Requester Information
              </span>
              <div className="flex items-start gap-2.5 pt-1">
                <User className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <h4 className="text-base font-bold text-slate-900">{ticket.name}</h4>
                  <p className="text-xs text-slate-600 font-medium">{ticket.jobTitle}</p>
                  <p className="text-xs text-slate-500">{ticket.department}</p>
                </div>
              </div>
            </div>

            {/* Location & Device */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Location & Device
              </span>
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <MapPin className="w-4 h-4 text-school-600" />
                  <span>{formatLocationDisplay(ticket)}</span>
                </div>
                {ticket.deviceId && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono font-bold text-xs text-slate-900">
                      <Laptop className="w-4 h-4 text-slate-500" />
                      <span>{ticket.deviceId}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setHistoryDeviceId(ticket.deviceId!);
                        setIsHistoryOpen(true);
                      }}
                      className="text-xs font-bold text-school-600 hover:text-school-800 underline"
                    >
                      View Device History
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Problem Type Banner */}
          <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200 flex justify-between items-center">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Problem Category
              </span>
              <span className="text-base font-bold text-slate-900">{ticket.problemType}</span>
            </div>
            <div className="text-right text-xs text-slate-500 font-mono">
              Reported: {formatDateTime(ticket.createdAt)}
            </div>
          </div>

          {/* Problem Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Problem Description</span>
            </label>
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
              {ticket.problemDescription}
            </div>
          </div>

          {/* What Requester Needs */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 text-school-700">
              <HelpCircle className="w-4 h-4 text-school-600" />
              <span>What Requester Needs from IT</span>
            </label>
            <div className="p-4 rounded-2xl bg-school-50/40 border border-school-200/80 text-sm text-school-950 font-medium leading-relaxed whitespace-pre-wrap">
              {ticket.requestedAction}
            </div>
          </div>

          {/* Resolution Details */}
          {(ticket.status === 'resolved' || ticket.status === 'closed') && (
            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Resolution Log
                </span>
                {ticket.resolvedAt && (
                  <span className="text-[11px] text-emerald-700 font-mono">
                    {formatDateTime(ticket.resolvedAt)}
                  </span>
                )}
              </div>
              <p className="text-sm text-emerald-950 font-medium leading-relaxed">
                {ticket.resolutionNote || 'Ticket resolved by IT Administrator.'}
              </p>
              {ticket.resolvedBy && (
                <p className="text-xs text-emerald-700">
                  Resolved By: <strong className="text-emerald-900">{ticket.resolvedBy}</strong>
                </p>
              )}
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-400 font-mono">
              Last updated: {formatDateTime(ticket.updatedAt)}
            </div>

            <div className="flex items-center gap-2.5">
              {ticket.status === 'new' && (
                <Button
                  variant="primary"
                  size="md"
                  isLoading={actionLoading}
                  onClick={handleStartWorking}
                  leftIcon={<Play className="w-4 h-4" />}
                >
                  Start Working
                </Button>
              )}

              {(ticket.status === 'new' || ticket.status === 'in-progress') && (
                <Button
                  variant="success"
                  size="md"
                  onClick={() => setIsResolveOpen(true)}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Mark as Resolved
                </Button>
              )}

              {ticket.status === 'resolved' && (
                <Button
                  variant="secondary"
                  size="md"
                  isLoading={actionLoading}
                  onClick={handleCloseTicket}
                  leftIcon={<Check className="w-4 h-4" />}
                >
                  Close Ticket
                </Button>
              )}

              {(ticket.status === 'resolved' || ticket.status === 'closed') && (
                <Button
                  variant="outline"
                  size="md"
                  isLoading={actionLoading}
                  onClick={handleReopenTicket}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                >
                  Reopen Ticket
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Resolution Modal */}
      <ResolutionModal
        ticket={ticket}
        isOpen={isResolveOpen}
        onClose={() => setIsResolveOpen(false)}
        onConfirm={handleConfirmResolve}
      />

      {/* Device History Modal */}
      <DeviceHistoryModal
        deviceId={historyDeviceId}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
};
