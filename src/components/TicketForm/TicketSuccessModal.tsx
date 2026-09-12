import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  Copy,
  Check,
  Printer,
  PlusCircle,
  MapPin,
} from 'lucide-react';
import { Ticket } from '../../types/ticket';
import { Button } from '../ui/Button';
import { formatDateTime, getPriorityConfig } from '../../utils/formatters';
import {
  translateJobTitle,
  translateDepartment,
  translateProblemType,
  formatPureLocation,
} from '../../utils/i18nHelpers';

interface TicketSuccessModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onReset: () => void;
}

export const TicketSuccessModal: React.FC<TicketSuccessModalProps> = ({
  ticket,
  isOpen,
  onReset,
}) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && ticket) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen, ticket]);

  if (!isOpen || !ticket) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(ticket.ticketNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const priorityCfg = getPriorityConfig(ticket.priority);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto isolate">
      {/* Dark Opaque Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onReset}
      />

      <div className="relative z-10 flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div
          id="printable-ticket"
          className="relative z-20 w-full max-w-lg max-h-[92vh] flex flex-col transform overflow-hidden rounded-3xl bg-white p-5 sm:p-8 text-left rtl:text-right shadow-2xl border border-slate-200 transition-all ring-1 ring-black/10 overflow-y-auto"
          style={{ backgroundColor: '#ffffff', opacity: 1 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header Icon */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2 sm:mb-3 shadow-inner">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('submit.successModalTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              {t('submit.successModalSubtitle')}
            </p>
          </div>

          {/* Ticket Number Highlight Box */}
          <div className="mt-4 sm:mt-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-school-50 to-blue-50/60 border border-school-200 text-center relative group">
            <span className="text-[10px] sm:text-xs font-bold text-school-700 uppercase tracking-widest block">
              {t('submit.ticketNumberBox')}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-school-900 tracking-wider my-1 font-mono">
              {ticket.ticketNumber}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500">
              {t('submit.ticketNumberHint')}
            </p>

            <button
              type="button"
              onClick={handleCopy}
              className="mt-2.5 sm:mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-school-200 text-xs font-semibold text-school-700 hover:bg-school-100/50 shadow-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('submit.copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t('submit.copyTicket')}</span>
                </>
              )}
            </button>
          </div>

          {/* Summary Details */}
          <div className="mt-4 sm:mt-6 space-y-2.5 sm:space-y-3 border-t border-b border-slate-100 py-3 sm:py-4 text-xs">
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-600 font-semibold">{t('common.requester')}:</span>
              <span className="font-bold text-slate-900">
                {ticket.name} ({translateJobTitle(ticket.jobTitle, t)})
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-600 font-semibold">{t('submit.departmentLabel')}:</span>
              <span className="font-semibold text-slate-800">
                {translateDepartment(ticket.department, t)}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-600 font-semibold">{t('common.location')}:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {formatPureLocation(ticket, isEn, t)}
                {ticket.deviceId && ` • ${ticket.deviceId}`}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-600 font-semibold">{t('common.problem')}:</span>
              <span className="font-bold text-slate-900">
                {translateProblemType(ticket.problemType, t)}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-600 font-semibold">{t('common.priority')}:</span>
              <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${priorityCfg.badge}`}>
                {t(`priority.${ticket.priority}`)}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-600 font-semibold">{t('common.created')}:</span>
              <span className="text-slate-700 font-mono font-medium">
                {formatDateTime(ticket.createdAt, i18n.language)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2.5 sm:gap-3 no-print">
            <Button
              variant="outline"
              size="md"
              className="w-full sm:flex-1 text-xs sm:text-sm py-2 sm:py-2.5"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4 text-slate-500" />}
            >
              {t('submit.printTicket')}
            </Button>
            <Button
              variant="primary"
              size="md"
              className="w-full sm:flex-1 text-xs sm:text-sm py-2 sm:py-2.5"
              onClick={onReset}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              {t('submit.submitAnother')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
