import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Laptop,
  Search,
  History,
} from 'lucide-react';
import { Device } from '../../types/device';
import { formatDateOnly, getDeviceStatusConfig } from '../../utils/formatters';
import { translateDeviceLocation, translateProblemType } from '../../utils/i18nHelpers';
import { Button } from '../ui/Button';

interface DeviceTableProps {
  devices: Device[];
  onSelectDevice: (deviceId: string) => void;
  initialLabFilter?: number | 'all';
  initialFloorFilter?: string;
}

export const DeviceTable: React.FC<DeviceTableProps> = ({
  devices,
  onSelectDevice,
  initialLabFilter = 'all',
  initialFloorFilter = 'all',
}) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const [searchTerm, setSearchTerm] = useState('');
  const [floorFilter, setFloorFilter] = useState<string>(initialFloorFilter);
  const [labFilter, setLabFilter] = useState<string>(
    initialLabFilter === 'all' ? 'all' : String(initialLabFilter)
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filtered devices
  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      // Search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchId = device.id.toLowerCase().includes(term);
        const matchLoc = device.location.toLowerCase().includes(term);
        const matchRoom = device.roomName?.toLowerCase().includes(term);
        const matchProb = device.lastProblem?.toLowerCase().includes(term);
        if (!matchId && !matchLoc && !matchRoom && !matchProb) return false;
      }

      // Floor filter
      if (floorFilter !== 'all') {
        if (device.floor !== floorFilter) return false;
      }

      // Lab/Area filter
      if (labFilter !== 'all') {
        if (labFilter === 'tr') {
          if (device.type !== 'teachers_room_pc') return false;
        } else if (labFilter === 'offices') {
          if (device.type !== 'office_device') return false;
        } else if (labFilter === 'classrooms') {
          if (device.type !== 'classroom_equipment') return false;
        } else {
          if (device.labNumber !== Number(labFilter)) return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all') {
        if (device.status !== statusFilter) return false;
      }

      return true;
    });
  }, [devices, searchTerm, floorFilter, labFilter, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 rtl:left-auto rtl:right-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('devices.searchPlaceholder')}
            className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-base sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-school-100"
          />
        </div>

        {/* Floor Filter */}
        <div className="w-full sm:w-48">
          <select
            value={floorFilter}
            onChange={e => setFloorFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-base sm:text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-school-100"
          >
            <option value="all">{t('devices.filterAllFloors')}</option>
            <option value="ground">{isEn ? 'Ground Floor (4 PCs)' : 'الدور الأرضي (4 أجهزة)'}</option>
            <option value="first">{isEn ? 'First Floor (11 PCs)' : 'الدور الأول (11 جهازاً)'}</option>
            <option value="second">{isEn ? 'Second Floor (68 PCs)' : 'الدور الثاني (68 جهازاً)'}</option>
            <option value="third">{isEn ? 'Third Floor (25 PCs)' : 'الدور الثالث (25 جهازاً)'}</option>
            <option value="fourth">{isEn ? 'Fourth Floor (25 PCs)' : 'الدور الرابع (25 جهازاً)'}</option>
          </select>
        </div>

        {/* Lab/Area Filter */}
        <div className="w-full sm:w-56">
          <select
            value={labFilter}
            onChange={e => setLabFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-base sm:text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-school-100"
          >
            <option value="all">{t('devices.filterAllLabs')}</option>
            <option value="1">{isEn ? 'Computer Lab 1 (25 PCs)' : 'معمل 1 كمبيوتر (25 جهاز)'}</option>
            <option value="2">{isEn ? 'Language Lab (28 PCs)' : 'معمل اللغات (28 جهاز)'}</option>
            <option value="3">{isEn ? 'Computer Lab 3 (25 PCs)' : 'معمل 3 كمبيوتر (25 جهاز)'}</option>
            <option value="4">{isEn ? 'Computer Lab 4 (25 PCs)' : 'معمل 4 كمبيوتر (25 جهاز)'}</option>
            <option value="tr">{isEn ? 'Teachers Room (8 PCs)' : 'حجرة المدرسين (8 أجهزة)'}</option>
            <option value="offices">{isEn ? 'Admin Offices & Workshops' : 'المكاتب الإدارية والورش'}</option>
            <option value="classrooms">{isEn ? 'Classrooms & Smart Screens' : 'الفصول والشاشات'}</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-40">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-base sm:text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-school-100"
          >
            <option value="all">{t('common.all')}</option>
            <option value="has_issue">{t('devices.hasIssue')}</option>
            <option value="operational">{t('devices.operational')}</option>
          </select>
        </div>
      </div>

      {/* Device Count Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          {isEn
            ? `Showing ${filteredDevices.length} of ${devices.length} registered devices in school`
            : `عرض ${filteredDevices.length} من أصل ${devices.length} جهازاً مسجلاً بالمدرسة`}
        </span>
      </div>

      {/* MOBILE VIEW (< md): Responsive Cards List */}
      <div className="md:hidden space-y-3">
        {filteredDevices.slice(0, 100).map(device => {
          const statusCfg = getDeviceStatusConfig(device.status);

          return (
            <div
              key={device.id}
              onClick={() => onSelectDevice(device.id)}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm active:scale-[0.99] transition-all space-y-3 cursor-pointer text-left rtl:text-right"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-school-50 text-school-600">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-mono text-sm font-black text-slate-900">{device.id}</h4>
                    <span className="text-xs text-slate-500 font-semibold">
                      {translateDeviceLocation(device, isEn, t)}
                    </span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${statusCfg.bg}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      device.status === 'has_issue' ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                  />
                  {device.status === 'has_issue' ? t('devices.hasIssue') : t('devices.operational')}
                </span>
              </div>

              {device.lastProblem ? (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    {t('devices.lastReportedIssue')}
                  </span>
                  <span className="font-bold text-slate-800">
                    {translateProblemType(device.lastProblem, t)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                    {formatDateOnly(device.lastTicketDate, i18n.language)}
                  </span>
                </div>
              ) : null}

              <div className="flex items-center justify-between pt-1 border-t border-slate-100" onClick={e => e.stopPropagation()}>
                <span
                  className={`font-mono text-xs font-bold px-2 py-0.5 rounded-lg ${
                    device.ticketsCount > 0 ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {device.ticketsCount} {t('common.tickets')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectDevice(device.id)}
                  leftIcon={<History className="w-3.5 h-3.5 text-school-600" />}
                >
                  {t('devices.history')}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP VIEW (md+): Full Table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/5">
        <table className="w-full text-left rtl:text-right text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
              <th className="py-3.5 px-4">{t('devices.deviceId')}</th>
              <th className="py-3.5 px-4">{t('devices.location')}</th>
              <th className="py-3.5 px-4">{t('devices.currentStatus')}</th>
              <th className="py-3.5 px-4">{t('devices.totalTickets')}</th>
              <th className="py-3.5 px-4">{t('devices.lastReportedIssue')}</th>
              <th className="py-3.5 px-4 text-right rtl:text-left">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDevices.slice(0, 150).map(device => {
              const statusCfg = getDeviceStatusConfig(device.status);

              return (
                <tr
                  key={device.id}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  onClick={() => onSelectDevice(device.id)}
                >
                  {/* Device ID */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-school-100 group-hover:text-school-700 transition-colors">
                        <Laptop className="w-4 h-4" />
                      </div>
                      <span className="font-mono font-bold text-slate-900">{device.id}</span>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs font-semibold text-slate-700">
                    {translateDeviceLocation(device, isEn, t)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${statusCfg.bg}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          device.status === 'has_issue' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                        }`}
                      />
                      {device.status === 'has_issue' ? t('devices.hasIssue') : t('devices.operational')}
                    </span>
                  </td>

                  {/* Tickets Count */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`font-mono text-xs font-extrabold px-2 py-0.5 rounded-lg ${
                        device.ticketsCount > 2
                          ? 'bg-rose-100 text-rose-800'
                          : device.ticketsCount > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {device.ticketsCount} {t('common.tickets')}
                    </span>
                  </td>

                  {/* Last Problem */}
                  <td className="py-3.5 px-4 max-w-[200px] text-xs">
                    {device.lastProblem ? (
                      <div>
                        <span className="font-semibold text-slate-800 truncate block">
                          {translateProblemType(device.lastProblem, t)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatDateOnly(device.lastTicketDate, i18n.language)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">
                        {t('devices.noTicketsReported')}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right rtl:text-left" onClick={e => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectDevice(device.id)}
                      leftIcon={<History className="w-3.5 h-3.5 text-school-600" />}
                    >
                      {t('devices.history')}
                    </Button>
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
