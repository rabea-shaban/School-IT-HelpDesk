import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Trash2, Calendar } from 'lucide-react';
import { Ticket } from '../../types/ticket';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { translateProblemType, formatPureLocation } from '../../utils/i18nHelpers';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  ticket?: Ticket | null;
  mode?: 'single' | 'all' | 'period';
  totalCount?: number;
  periodLabel?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  ticket,
  mode = 'single',
  totalCount = 0,
  periodLabel = '',
}) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const isAll = mode === 'all';
  const isPeriod = mode === 'period';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2.5 text-rose-600">
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Trash2 className="w-5 h-5" />
          </div>
          <span className="text-lg font-black text-slate-900">
            {isAll
              ? t('modals.confirmDeleteAllTitle')
              : isPeriod
              ? t('modals.confirmDeletePeriodTitle')
              : t('modals.confirmDeleteSingleTitle')}
          </span>
        </div>
      }
    >
      <div className="space-y-5 pt-1 text-left rtl:text-right">
        {isAll ? (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 space-y-2">
            <div className="flex items-center gap-2 text-rose-700 font-extrabold text-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{t('modals.warningIrreversible')}</span>
            </div>
            <p className="text-xs text-rose-900/80 leading-relaxed font-medium">
              {t('modals.deleteAllWarning', { count: totalCount })}
            </p>
          </div>
        ) : isPeriod ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm">
              <Calendar className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>{t('modals.deletePeriodHeading')}</span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              {t('modals.deletePeriodWarning', { count: totalCount })}
            </p>
            <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-xs font-bold text-amber-900 flex items-center justify-between">
              <span>{t('modals.targetedPeriod')}:</span>
              <span className="font-mono bg-amber-100 px-2 py-0.5 rounded">{periodLabel}</span>
            </div>
            <p className="text-[11px] text-amber-800/80 font-medium">
              {t('modals.deletePeriodNote')}
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <p className="text-sm font-semibold text-slate-800">
              {t('modals.deleteSinglePrompt')}
            </p>
            {ticket && (
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">{t('common.ticketId')}:</span>
                  <span className="font-mono font-bold text-school-900">{ticket.ticketNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">{t('common.requester')}:</span>
                  <span className="font-bold text-slate-800">{ticket.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">{t('common.location')}:</span>
                  <span className="font-medium text-slate-800">
                    {formatPureLocation(ticket, isEn, t)} {ticket.deviceId ? `(${ticket.deviceId})` : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">{t('common.problem')}:</span>
                  <span className="font-semibold text-rose-600">
                    {translateProblemType(ticket.problemType, t)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="md"
            disabled={loading}
            onClick={onClose}
          >
            {t('common.cancel')}
          </Button>

          <Button
            type="button"
            variant="danger"
            size="md"
            isLoading={loading}
            onClick={handleConfirm}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            {isAll
              ? t('modals.confirmDeleteAllBtn')
              : isPeriod
              ? t('modals.confirmDeletePeriodBtn', { count: totalCount })
              : t('modals.confirmDeleteSingleBtn')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
