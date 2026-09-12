import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  User,
  MapPin,
  Laptop,
  CheckCircle2,
  Play,
  RotateCcw,
  Check,
  FileText,
  HelpCircle,
  Trash2,
} from 'lucide-react';
import { Ticket } from '../../types/ticket';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  formatDateTime,
  getStatusConfig,
  getPriorityConfig,
} from '../../utils/formatters';
import {
  translateJobTitle,
  translateDepartment,
  translateProblemType,
  formatPureLocation,
} from '../../utils/i18nHelpers';

interface TicketDetailsModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onStartWorking?: (ticketId: string) => Promise<void>;
  onOpenResolveModal?: (ticket: Ticket) => void;
  onCloseTicket?: (ticketId: string) => Promise<void>;
  onReopenTicket?: (ticketId: string) => Promise<void>;
  onDeleteTicket?: (ticketId: string) => Promise<void>;
  onViewDeviceHistory?: (deviceId: string) => void;
}

export const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onStartWorking,
  onOpenResolveModal,
  onCloseTicket,
  onReopenTicket,
  onDeleteTicket,
  onViewDeviceHistory,
}) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [actionLoading, setActionLoading] = useState(false);

  if (!ticket) return null;

  const statusCfg = getStatusConfig(ticket.status);
  const priorityCfg = getPriorityConfig(ticket.priority);
  const statusKey = ticket.status.replace('-', '_');

  const handleAction = async (actionFn?: () => Promise<void>) => {
    if (!actionFn) return;
    setActionLoading(true);
    try {
      await actionFn();
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <span className="font-mono text-xl font-extrabold text-school-900 bg-school-50 px-3 py-1 rounded-xl border border-school-200">
            {ticket.ticketNumber}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${statusCfg.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
            {t(`status.${statusKey}`)}
          </span>
        </div>
      }
      subtitle={t('modals.submittedBy', {
        name: ticket.name,
        date: formatDateTime(ticket.createdAt, i18n.language),
      })}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-left rtl:text-right">
        {/* Top Info Grid: Requester & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Requester Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {t('modals.requesterInfo')}
            </span>
            <div className="flex items-start gap-2.5">
              <User className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{ticket.name}</h4>
                <p className="text-xs text-slate-600 font-medium">
                  {translateJobTitle(ticket.jobTitle, t)}
                </p>
                <p className="text-xs text-slate-500">
                  {translateDepartment(ticket.department, t)}
                </p>
              </div>
            </div>
          </div>

          {/* Location & Device Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {t('modals.locationHardware')}
            </span>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                <MapPin className="w-4 h-4 text-school-600 flex-shrink-0" />
                <span>{formatPureLocation(ticket, isEn, t)}</span>
              </div>
              {ticket.deviceId ? (
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900">
                    <Laptop className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span>{ticket.deviceId}</span>
                  </div>
                  {onViewDeviceHistory && (
                    <button
                      type="button"
                      onClick={() => onViewDeviceHistory(ticket.deviceId!)}
                      className="text-[11px] text-school-600 hover:text-school-800 font-bold underline cursor-pointer"
                    >
                      {t('modals.viewDeviceHistory')}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400">{t('modals.noDeviceIdAttached')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Priority & Problem Type Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-100/70 border border-slate-200">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {t('modals.problemCategory')}
            </span>
            <span className="text-sm font-bold text-slate-900">
              {translateProblemType(ticket.problemType, t)}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-right rtl:text-left">
              {t('common.priority')}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold ${priorityCfg.badge}`}
            >
              {t(`priority.${ticket.priority}`)}
            </span>
          </div>
        </div>

        {/* Problem Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>{t('modals.problemDesc')}</span>
          </label>
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
            {ticket.problemDescription}
          </div>
        </div>

        {/* Requested Action */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 text-school-700">
            <HelpCircle className="w-4 h-4 text-school-600" />
            <span>{t('modals.requestedAction')}</span>
          </label>
          <div className="p-4 rounded-2xl bg-school-50/40 border border-school-200/80 text-sm text-school-950 font-medium leading-relaxed whitespace-pre-wrap">
            {ticket.requestedAction}
          </div>
        </div>

        {/* Resolution Box if Resolved */}
        {ticket.status === 'resolved' || ticket.status === 'closed' ? (
          <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {t('modals.resolutionLog')}
              </span>
              {ticket.resolvedAt && (
                <span className="text-[11px] text-emerald-700 font-mono">
                  {formatDateTime(ticket.resolvedAt, i18n.language)}
                </span>
              )}
            </div>
            <p className="text-sm text-emerald-950 font-medium leading-relaxed">
              {ticket.resolutionNote || t('status.resolved')}
            </p>
            {ticket.resolvedBy && (
              <p className="text-xs text-emerald-700 pt-1">
                {t('modals.resolvedBy', { name: ticket.resolvedBy })}
              </p>
            )}
          </div>
        ) : null}

        {/* Admin Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-mono">
            {formatDateTime(ticket.updatedAt, i18n.language)}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {ticket.status === 'new' && onStartWorking && (
              <Button
                variant="primary"
                size="md"
                isLoading={actionLoading}
                onClick={() => handleAction(() => onStartWorking(ticket.id))}
                leftIcon={<Play className="w-4 h-4" />}
              >
                {t('modals.startWorking')}
              </Button>
            )}

            {(ticket.status === 'new' || ticket.status === 'in-progress') && onOpenResolveModal && (
              <Button
                variant="success"
                size="md"
                onClick={() => onOpenResolveModal(ticket)}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                {t('modals.markResolved')}
              </Button>
            )}

            {ticket.status === 'resolved' && onCloseTicket && (
              <Button
                variant="secondary"
                size="md"
                isLoading={actionLoading}
                onClick={() => handleAction(() => onCloseTicket(ticket.id))}
                leftIcon={<Check className="w-4 h-4" />}
              >
                {t('modals.closeTicket')}
              </Button>
            )}

            {(ticket.status === 'resolved' || ticket.status === 'closed') && onReopenTicket && (
              <Button
                variant="outline"
                size="md"
                isLoading={actionLoading}
                onClick={() => handleAction(() => onReopenTicket(ticket.id))}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                {t('modals.reopenTicket')}
              </Button>
            )}

            {onDeleteTicket && (
              <Button
                variant="danger"
                size="md"
                isLoading={actionLoading}
                onClick={() => handleAction(() => onDeleteTicket(ticket.id))}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                {t('common.delete')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
