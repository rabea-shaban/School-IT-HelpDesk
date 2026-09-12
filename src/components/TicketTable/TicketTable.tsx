import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Eye,
  Play,
  CheckCircle2,
  MapPin,
  Laptop,
  Trash2,
} from 'lucide-react';
import { Ticket } from '../../types/ticket';
import {
  formatDateOnly,
  getStatusConfig,
  getPriorityConfig,
} from '../../utils/formatters';
import {
  translateJobTitle,
  translateDepartment,
  translateProblemType,
  formatPureLocation,
} from '../../utils/i18nHelpers';
import { Button } from '../ui/Button';

interface TicketTableProps {
  tickets: Ticket[];
  onViewTicket: (ticket: Ticket) => void;
  onStartWorking?: (ticket: Ticket) => void;
  onResolveTicket?: (ticket: Ticket) => void;
  onDeleteTicket?: (ticket: Ticket) => void;
  onDeviceClick?: (deviceId: string) => void;
}

export const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  onViewTicket,
  onStartWorking,
  onResolveTicket,
  onDeleteTicket,
  onDeviceClick,
}) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  return (
    <div>
      {/* MOBILE VIEW (< md): Responsive Stacked Cards */}
      <div className="md:hidden space-y-3">
        {tickets.map(ticket => {
          const statusCfg = getStatusConfig(ticket.status);
          const priorityCfg = getPriorityConfig(ticket.priority);
          const statusKey = ticket.status.replace('-', '_');

          return (
            <div
              key={ticket.id}
              onClick={() => onViewTicket(ticket)}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm active:scale-[0.99] transition-all space-y-3 cursor-pointer text-left rtl:text-right"
            >
              {/* Card Header: Ticket Number & Status */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-black text-school-900 bg-school-50 px-2.5 py-1 rounded-lg border border-school-200">
                  {ticket.ticketNumber}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${priorityCfg.badge}`}>
                    {t(`priority.${ticket.priority}`)}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-bold ${statusCfg.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                    {t(`status.${statusKey}`)}
                  </span>
                </div>
              </div>

              {/* Requester & Problem */}
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  {translateProblemType(ticket.problemType, t)}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                  {ticket.problemDescription}
                </p>
              </div>

              {/* Location & Requester Metadata */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-school-600 flex-shrink-0" />
                  <span>{formatPureLocation(ticket, isEn, t)}</span>
                  {ticket.deviceId && (
                    <span className="font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-900 text-[11px]">
                      {ticket.deviceId}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {formatDateOnly(ticket.createdAt, i18n.language)}
                </div>
              </div>

              {/* Actions Row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100" onClick={e => e.stopPropagation()}>
                <span className="text-xs text-slate-500 font-medium">
                  {ticket.name} ({translateJobTitle(ticket.jobTitle, t)})
                </span>
                <div className="flex items-center gap-1.5">
                  {ticket.status === 'new' && onStartWorking && (
                    <button
                      type="button"
                      onClick={() => onStartWorking(ticket)}
                      className="p-1.5 rounded-lg text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
                      title={t('common.startWorking')}
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {ticket.status === 'in-progress' && onResolveTicket && (
                    <button
                      type="button"
                      onClick={() => onResolveTicket(ticket)}
                      className="p-1.5 rounded-lg text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      title={t('common.resolve')}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewTicket(ticket)}
                    className="px-2 py-1 text-xs"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    {t('common.view')}
                  </Button>
                  {onDeleteTicket && (
                    <button
                      type="button"
                      onClick={() => onDeleteTicket(ticket)}
                      className="p-1.5 rounded-lg text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
                      title={t('common.delete')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP VIEW (md+): Standard Clean Table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/5">
        <table className="w-full text-left rtl:text-right text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
              <th className="py-3.5 px-4">{t('common.ticketId')}</th>
              <th className="py-3.5 px-4">{t('common.requester')}</th>
              <th className="py-3.5 px-4">{t('common.location')}</th>
              <th className="py-3.5 px-4">{t('common.device')}</th>
              <th className="py-3.5 px-4">{t('common.problem')}</th>
              <th className="py-3.5 px-4">{t('common.priority')}</th>
              <th className="py-3.5 px-4">{t('common.status')}</th>
              <th className="py-3.5 px-4">{t('common.createdAt')}</th>
              <th className="py-3.5 px-4 text-right rtl:text-left">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map(ticket => {
              const statusCfg = getStatusConfig(ticket.status);
              const priorityCfg = getPriorityConfig(ticket.priority);
              const statusKey = ticket.status.replace('-', '_');

              return (
                <tr
                  key={ticket.id}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  onClick={() => onViewTicket(ticket)}
                >
                  {/* Ticket ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-school-700 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-md bg-school-50 border border-school-100 group-hover:bg-school-100/70 transition-colors">
                      {ticket.ticketNumber}
                    </span>
                  </td>

                  {/* Requester */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{ticket.name}</div>
                    <div className="text-xs text-slate-500 font-medium">
                      {translateJobTitle(ticket.jobTitle, t)} &bull; {translateDepartment(ticket.department, t)}
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-xs">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {formatPureLocation(ticket, isEn, t)}
                    </div>
                  </td>

                  {/* Device */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {ticket.deviceId ? (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          if (onDeviceClick) onDeviceClick(ticket.deviceId!);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-xs font-bold text-slate-700 bg-slate-100 hover:bg-school-100 hover:text-school-700 transition-colors"
                      >
                        <Laptop className="w-3 h-3 text-slate-500" />
                        {ticket.deviceId}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">—</span>
                    )}
                  </td>

                  {/* Problem */}
                  <td className="py-3.5 px-4 max-w-[220px]">
                    <div className="font-semibold text-slate-900 text-xs truncate">
                      {translateProblemType(ticket.problemType, t)}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate" title={ticket.problemDescription}>
                      {ticket.problemDescription}
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${priorityCfg.badge}`}
                    >
                      {t(`priority.${ticket.priority}`)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${statusCfg.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                      {t(`status.${statusKey}`)}
                    </span>
                  </td>

                  {/* Created At */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                    {formatDateOnly(ticket.createdAt, i18n.language)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right rtl:text-left" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                      {ticket.status === 'new' && onStartWorking && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onStartWorking(ticket)}
                          className="text-amber-700 hover:bg-amber-50 hover:text-amber-800 text-xs font-bold"
                          leftIcon={<Play className="w-3.5 h-3.5" />}
                        >
                          {t('common.startWorking')}
                        </Button>
                      )}

                      {ticket.status === 'in-progress' && onResolveTicket && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onResolveTicket(ticket)}
                          className="text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 text-xs font-bold"
                          leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        >
                          {t('common.resolve')}
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewTicket(ticket)}
                        className="text-slate-600 hover:text-school-600 hover:bg-school-50 text-xs"
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        {t('common.details')}
                      </Button>

                      {onDeleteTicket && (
                        <button
                          type="button"
                          onClick={() => onDeleteTicket(ticket)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title={t('common.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
