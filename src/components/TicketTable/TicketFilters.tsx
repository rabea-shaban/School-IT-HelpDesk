import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, RotateCcw, Calendar, CalendarRange } from 'lucide-react';
import { PROBLEM_TYPES } from '../../utils/constants';
import { translateProblemType } from '../../utils/i18nHelpers';

interface TicketFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  priorityFilter: string;
  onPriorityChange: (priority: string) => void;
  locationFilter: string;
  onLocationChange: (loc: string) => void;
  problemFilter: string;
  onProblemChange: (problem: string) => void;
  dateFilter: string;
  onDateFilterChange: (val: string) => void;
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  onReset: () => void;
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  locationFilter,
  onLocationChange,
  problemFilter,
  onProblemChange,
  dateFilter,
  onDateFilterChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onReset,
}) => {
  const { t } = useTranslation();

  const isFiltered =
    searchTerm !== '' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    locationFilter !== 'all' ||
    problemFilter !== 'all' ||
    dateFilter !== 'all' ||
    startDate !== '' ||
    endDate !== '';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 rtl:left-auto rtl:right-3.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={t('common.searchPlaceholder')}
          className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-school-100 focus:border-school-500 transition-all"
        />
      </div>

      {/* Date Range Quick Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 me-2">
          <Calendar className="w-3.5 h-3.5 text-school-600 shrink-0" />
          <span>{t('common.period')}:</span>
        </span>

        <button
          type="button"
          onClick={() => onDateFilterChange('all')}
          className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            dateFilter === 'all'
              ? 'bg-school-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {t('common.allTime')}
        </button>

        <button
          type="button"
          onClick={() => onDateFilterChange('7days')}
          className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            dateFilter === '7days'
              ? 'bg-school-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {t('common.last7Days')}
        </button>

        <button
          type="button"
          onClick={() => onDateFilterChange('15days')}
          className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            dateFilter === '15days'
              ? 'bg-school-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {t('common.last15Days')}
        </button>

        <button
          type="button"
          onClick={() => onDateFilterChange('30days')}
          className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            dateFilter === '30days'
              ? 'bg-school-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {t('common.last30Days')}
        </button>

        <button
          type="button"
          onClick={() => onDateFilterChange('custom')}
          className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
            dateFilter === 'custom'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <CalendarRange className="w-3.5 h-3.5" />
          <span>{t('common.customRange')}</span>
        </button>
      </div>

      {/* Custom Date Inputs (if custom is active) */}
      {dateFilter === 'custom' && (
        <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 flex-1">
            <label className="text-xs font-bold text-slate-700 shrink-0">{t('common.fromDate')}:</label>
            <input
              type="date"
              value={startDate}
              onChange={e => onStartDateChange(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div className="flex items-center gap-2 flex-1">
            <label className="text-xs font-bold text-slate-700 shrink-0">{t('common.toDate')}:</label>
            <input
              type="date"
              value={endDate}
              onChange={e => onEndDateChange(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {(startDate || endDate) && (
            <button
              type="button"
              onClick={() => {
                onStartDateChange('');
                onEndDateChange('');
              }}
              className="text-xs font-bold text-indigo-700 hover:underline text-center sm:text-start self-center sm:self-auto cursor-pointer"
            >
              {t('common.clearDate')}
            </button>
          )}
        </div>
      )}

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-1 border-t border-slate-100">
        {/* Status */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            {t('common.status')}
          </label>
          <select
            value={statusFilter}
            onChange={e => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-school-100"
          >
            <option value="all">{t('common.all')}</option>
            <option value="new">{t('status.new')}</option>
            <option value="in-progress">{t('status.in_progress')}</option>
            <option value="resolved">{t('status.resolved')}</option>
            <option value="closed">{t('status.closed')}</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            {t('common.priority')}
          </label>
          <select
            value={priorityFilter}
            onChange={e => onPriorityChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-school-100"
          >
            <option value="all">{t('common.all')}</option>
            <option value="urgent">{t('priority.urgent')}</option>
            <option value="high">{t('priority.high')}</option>
            <option value="medium">{t('priority.medium')}</option>
            <option value="low">{t('priority.low')}</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            {t('common.location')}
          </label>
          <select
            value={locationFilter}
            onChange={e => onLocationChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-school-100"
          >
            <option value="all">{t('common.all')}</option>
            <option value="lab">{t('locations.lab')}</option>
            <option value="teachers_room">{t('locations.teachers_room')}</option>
            <option value="classroom">{t('locations.classroom')}</option>
            <option value="office">{t('locations.office')}</option>
            <option value="other">{t('locations.other')}</option>
          </select>
        </div>

        {/* Problem Type */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            {t('common.problemType')}
          </label>
          <select
            value={problemFilter}
            onChange={e => onProblemChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-school-100 truncate"
          >
            <option value="all">{t('common.all')}</option>
            {PROBLEM_TYPES.map(p => (
              <option key={p} value={p}>
                {translateProblemType(p, t)}
              </option>
            ))}
          </select>
        </div>

        {/* Reset */}
        <div className="flex items-end col-span-2 sm:col-span-4 lg:col-span-1">
          <button
            type="button"
            onClick={onReset}
            disabled={!isFiltered}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('common.resetFilters')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
