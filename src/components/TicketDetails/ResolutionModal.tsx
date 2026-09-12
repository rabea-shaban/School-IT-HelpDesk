import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Ticket } from '../../types/ticket';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { translateProblemType } from '../../utils/i18nHelpers';

interface ResolutionModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (ticketId: string, resolutionNote: string) => Promise<void>;
  isLoading?: boolean;
}

export const ResolutionModal: React.FC<ResolutionModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!ticket) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      setError(t('modals.resolutionRequiredError'));
      return;
    }
    setError('');
    await onConfirm(ticket.id, note.trim());
    setNote('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5 text-emerald-800 font-extrabold">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span>{t('modals.markAsResolvedTitle')}</span>
        </div>
      }
      subtitle={t('modals.resolvingSubtitle', {
        number: ticket.ticketNumber,
        name: ticket.name,
      })}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-left rtl:text-right">
        {/* Ticket Summary Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-500">{t('modals.problemReported')}</span>
            <span className="font-bold text-slate-900">
              {translateProblemType(ticket.problemType, t)}
            </span>
          </div>
          {ticket.deviceId && (
            <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
              <span className="font-semibold text-slate-500">{t('modals.deviceId')}</span>
              <span className="font-mono font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {ticket.deviceId}
              </span>
            </div>
          )}
        </div>

        {/* Resolution Note Textarea */}
        <div>
          <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
            {t('modals.resolutionNotesLabel')} <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={e => {
              setNote(e.target.value);
              if (error) setError('');
            }}
            placeholder={t('modals.resolutionNotesPlaceholder')}
            className={`w-full p-3.5 rounded-2xl border bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 transition-all ${
              error
                ? 'border-rose-300 focus:ring-rose-100'
                : 'border-slate-300 focus:ring-emerald-100 focus:border-emerald-600'
            }`}
          />
          {error && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-bold">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="success"
            size="md"
            isLoading={isLoading}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            {t('modals.confirmResolveBtn')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
