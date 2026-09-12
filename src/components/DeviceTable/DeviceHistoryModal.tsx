import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Laptop,
  CheckCircle2,
  User,
  Wrench,
} from 'lucide-react';
import { DeviceHistoryItem } from '../../types/device';
import { getDeviceHistory } from '../../firebase/devices';
import { Modal } from '../ui/Modal';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { formatDateTime, getStatusConfig, getPriorityConfig } from '../../utils/formatters';
import { translateProblemType } from '../../utils/i18nHelpers';

interface DeviceHistoryModalProps {
  deviceId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectTicket?: (ticketId: string) => void;
}

export const DeviceHistoryModal: React.FC<DeviceHistoryModalProps> = ({
  deviceId,
  isOpen,
  onClose,
  onSelectTicket,
}) => {
  const { t, i18n } = useTranslation();
  const [history, setHistory] = useState<DeviceHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && deviceId) {
      setLoading(true);
      getDeviceHistory(deviceId)
        .then(items => setHistory(items))
        .catch(err => console.error('Error fetching device history:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, deviceId]);

  if (!deviceId) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-school-50 text-school-600 border border-school-200">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 font-mono">{deviceId}</h3>
            <p className="text-xs text-slate-500 font-sans">{t('devices.deviceHistory')}</p>
          </div>
        </div>
      }
      subtitle={t('devices.totalLifetimeTickets', { count: history.length })}
      maxWidth="2xl"
    >
      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1 text-left rtl:text-right">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
          </div>
        ) : history.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 className="w-8 h-8 text-emerald-500" />}
            title={t('devices.cleanRecordTitle')}
            description={t('devices.cleanRecordDesc', { id: deviceId })}
          />
        ) : (
          history.map(item => {
            const statusCfg = getStatusConfig(item.status as any);
            const priorityCfg = getPriorityConfig(item.priority as any);
            const statusKey = item.status.replace('-', '_');

            return (
              <div
                key={item.ticketId}
                onClick={() => onSelectTicket && onSelectTicket(item.ticketId)}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all space-y-2.5 cursor-pointer group"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-school-700 bg-school-50 px-2 py-0.5 rounded border border-school-100 group-hover:bg-school-100">
                      {item.ticketNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {translateProblemType(item.problemType, t)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityCfg.badge}`}
                    >
                      {t(`priority.${item.priority}`)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.bg}`}
                    >
                      {t(`status.${statusKey}`)}
                    </span>
                  </div>
                </div>

                {/* Problem & Action */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.problemDescription}
                </p>

                {/* Resolution note if any */}
                {item.resolutionNote && (
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900 space-y-1">
                    <div className="font-bold flex items-center gap-1 text-emerald-800">
                      <Wrench className="w-3 h-3" />
                      {t('modals.resolutionLog')}:
                    </div>
                    <div>{item.resolutionNote}</div>
                  </div>
                )}

                {/* Footer timestamp & requester */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1 border-t border-slate-100">
                  <span className="flex items-center gap-1 text-slate-600 font-semibold">
                    <User className="w-3 h-3 text-slate-400" />
                    {item.requesterName}
                  </span>
                  <span className="font-mono">{formatDateTime(item.createdAt, i18n.language)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
};
