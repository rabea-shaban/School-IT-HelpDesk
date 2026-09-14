import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Ticket as TicketIcon,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Laptop,
  ArrowRight,
  PlusCircle,
  BarChart3,
  PieChart,
  Building,
  Building2,
} from 'lucide-react';
import { Ticket } from '../types/ticket';
import { Lab } from '../types/lab';
import {
  subscribeToTickets,
  updateTicketStatus,
  resolveTicket,
  deleteTicket,
} from '../firebase/tickets';
import { subscribeToLabs } from '../firebase/labs';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TicketTable } from '../components/TicketTable/TicketTable';
import { TicketDetailsModal } from '../components/TicketDetails/TicketDetailsModal';
import { ResolutionModal } from '../components/TicketDetails/ResolutionModal';
import { DeviceHistoryModal } from '../components/DeviceTable/DeviceHistoryModal';
import { DeleteConfirmModal } from '../components/TicketDetails/DeleteConfirmModal';
import { Skeleton } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { padZero } from '../utils/deviceGenerator';
import {
  SCHOOL_FLOORS,
  TOTAL_SCHOOL_DEVICES_COUNT,
  TOTAL_LABS_COUNT,
} from '../utils/constants';
import { translateDepartment, translateProblemType } from '../utils/i18nHelpers';

export const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [resolvingTicket, setResolvingTicket] = useState<Ticket | null>(null);
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [historyDeviceId, setHistoryDeviceId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Delete modal state
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [isDeleteSingleOpen, setIsDeleteSingleOpen] = useState(false);

  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // Real-time Firestore subscriptions
  useEffect(() => {
    setLoading(true);

    const unsubTickets = subscribeToTickets(liveTickets => {
      setTickets(liveTickets);
      setLoading(false);
    });

    const unsubLabs = subscribeToLabs(liveLabs => {
      setLabs(liveLabs);
    });

    return () => {
      if (typeof unsubTickets === 'function') unsubTickets();
      if (typeof unsubLabs === 'function') unsubLabs();
    };
  }, []);

  // Compute live KPI Stats from real Firestore tickets
  const stats = useMemo(() => {
    const total = tickets.length;
    const newCount = tickets.filter(t => t.status === 'new').length;
    const inProgressCount = tickets.filter(t => t.status === 'in-progress').length;
    const resolvedCount = tickets.filter(
      t => t.status === 'resolved' || t.status === 'closed'
    ).length;
    const urgentCount = tickets.filter(
      t =>
        (t.priority === 'urgent' || t.priority === 'high') &&
        (t.status === 'new' || t.status === 'in-progress')
    ).length;

    // Active devices with issues
    const activeDeviceIds = new Set(
      tickets
        .filter(t => (t.status === 'new' || t.status === 'in-progress') && t.deviceId)
        .map(t => t.deviceId)
    );

    const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 100;

    return {
      total,
      newCount,
      inProgressCount,
      resolvedCount,
      urgentCount,
      issueDevicesCount: activeDeviceIds.size,
      resolutionRate,
    };
  }, [tickets]);

  // Compute Floor-by-Floor Live Statistics
  const floorStats = useMemo(() => {
    return SCHOOL_FLOORS.map(floor => {
      // Find open tickets for this floor
      const openFloorTickets = tickets.filter(
        t =>
          (t.status === 'new' || t.status === 'in-progress') &&
          (t.floor === floor.id ||
            (!t.floor &&
              ((floor.id === 'second' && (t.labNumber === 1 || t.labNumber === 2 || t.locationType === 'teachers_room')) ||
                (floor.id === 'third' && t.labNumber === 3) ||
                (floor.id === 'fourth' && t.labNumber === 4))))
      );

      const issueDevs = new Set(openFloorTickets.filter(t => t.deviceId).map(t => t.deviceId));
      const hasIssues = openFloorTickets.length > 0;
      const operationalCount = Math.max(0, floor.devicesCount - issueDevs.size);
      const healthRate = Math.round((operationalCount / floor.devicesCount) * 100);

      return {
        ...floor,
        openTicketsCount: openFloorTickets.length,
        issueDevicesCount: issueDevs.size,
        operationalCount,
        healthRate,
        hasIssues,
      };
    });
  }, [tickets]);

  // Compute Problem Types Distribution
  const problemTypeStats = useMemo(() => {
    const counts: Record<string, number> = {};
    tickets.forEach(t => {
      if (t.problemType) {
        counts[t.problemType] = (counts[t.problemType] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([type, count]) => ({
        type,
        count,
        percentage: tickets.length > 0 ? Math.round((count / tickets.length) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [tickets]);

  // Compute Location Type Distribution
  const locationStats = useMemo(() => {
    const counts: Record<string, { labelKey: string; count: number; active: number }> = {
      lab: { labelKey: 'locations.lab', count: 0, active: 0 },
      teachers_room: { labelKey: 'locations.teachers_room', count: 0, active: 0 },
      classroom: { labelKey: 'locations.classroom', count: 0, active: 0 },
      office: { labelKey: 'locations.office', count: 0, active: 0 },
      other: { labelKey: 'locations.other', count: 0, active: 0 },
    };

    tickets.forEach(t => {
      const locKey = (t.locationType || 'other') as keyof typeof counts;
      if (counts[locKey]) {
        counts[locKey].count += 1;
        if (t.status === 'new' || t.status === 'in-progress') {
          counts[locKey].active += 1;
        }
      }
    });

    return Object.entries(counts).map(([key, data]) => ({
      key,
      label: t(data.labelKey),
      count: data.count,
      active: data.active,
      percentage: tickets.length > 0 ? Math.round((data.count / tickets.length) * 100) : 0,
    }));
  }, [tickets, t]);

  // Compute Top Requesting Departments
  const departmentStats = useMemo(() => {
    const counts: Record<string, number> = {};
    tickets.forEach(t => {
      const dept =
        t.department === 'Other' && t.departmentCustom
          ? t.departmentCustom
          : t.department || 'General';
      counts[dept] = (counts[dept] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: tickets.length > 0 ? Math.round((count / tickets.length) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [tickets]);

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

  // Delete Single Ticket Handlers
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

  const isEn = i18n.language === 'en';

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Top Welcome & Actions Bar */}
      <div className="bg-gradient-to-r from-school-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-school-900/10 relative overflow-hidden">
        {/* Background decorative pattern */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-school-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1.5 bg-white/95 p-1 rounded-xl shadow-xs">
                <img
                  src="/Ministry_of_Education_(Egypt)_logo_(wikiar).png"
                  alt="وزارة التربية والتعليم"
                  className="w-6 h-6 object-contain rounded-full"
                />
                <img
                  src="/logo_AT.jpg"
                  alt="التكنولوجيا التطبيقية"
                  className="h-6 w-auto object-contain rounded"
                />
              </div>
              <span className="text-[11px] font-bold text-school-200 uppercase tracking-widest">
                {t('nav.internalBadge')}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {t('dashboard.heroTitle')}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {t('dashboard.liveSync')}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t('dashboard.heroSubtitle', { devices: TOTAL_SCHOOL_DEVICES_COUNT, labs: TOTAL_LABS_COUNT })}
            </p>

            {/* Quick school facts pill badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-school-300" />
                {t('dashboard.factsFloors')}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10 flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-school-300" />
                {t('dashboard.factsDevices', { count: TOTAL_SCHOOL_DEVICES_COUNT })}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-school-300" />
                {t('dashboard.factsLabs', { count: TOTAL_LABS_COUNT })}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/">
              <Button
                variant="primary"
                size="md"
                className="shadow-lg shadow-school-600/30"
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                {t('dashboard.newTicketButton')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid (6 Cards) */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <StatCard
            title={t('dashboard.totalTickets')}
            value={stats.total}
            icon={<TicketIcon className="w-5 h-5" />}
            variant="slate"
            description={t('dashboard.totalTicketsDesc')}
            onClick={() => navigate('/tickets')}
          />
          <StatCard
            title={t('dashboard.newTickets')}
            value={stats.newCount}
            icon={<Clock className="w-5 h-5" />}
            variant="blue"
            description={t('dashboard.newTicketsDesc')}
            onClick={() => navigate('/tickets?status=new')}
          />
          <StatCard
            title={t('dashboard.inProgressTickets')}
            value={stats.inProgressCount}
            icon={<PlayCircle className="w-5 h-5" />}
            variant="amber"
            description={t('dashboard.inProgressDesc')}
            onClick={() => navigate('/tickets?status=in-progress')}
          />
          <StatCard
            title={t('dashboard.resolvedTickets')}
            value={stats.resolvedCount}
            icon={<CheckCircle2 className="w-5 h-5" />}
            variant="emerald"
            description={t('dashboard.resolvedRate', { rate: stats.resolutionRate })}
            onClick={() => navigate('/tickets?status=resolved')}
          />
          <StatCard
            title={t('dashboard.urgentTickets')}
            value={stats.urgentCount}
            icon={<AlertTriangle className="w-5 h-5" />}
            variant={stats.urgentCount > 0 ? 'rose' : 'slate'}
            description={t('dashboard.urgentDesc')}
            onClick={() => navigate('/tickets?priority=urgent')}
          />
          <StatCard
            title={t('dashboard.issueDevices')}
            value={stats.issueDevicesCount}
            icon={<Laptop className="w-5 h-5" />}
            variant={stats.issueDevicesCount > 0 ? 'rose' : 'emerald'}
            description={t('dashboard.issueDevicesDesc', { total: TOTAL_SCHOOL_DEVICES_COUNT })}
            onClick={() => navigate('/devices')}
          />
        </div>
      )}

      {/* SECTION: 5 Floors Infrastructure Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-school-600" />
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {t('dashboard.floorsSectionTitle')}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {t('dashboard.floorsSectionSubtitle')}
              </span>
            </div>
          </div>
          <Link
            to="/devices"
            className="text-xs font-bold text-school-600 hover:text-school-800 inline-flex items-center gap-1 transition-colors"
          >
            <span>{t('dashboard.allDevicesLink')}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {floorStats.map(fl => (
            <div
              key={fl.id}
              onClick={() => navigate(`/devices?floor=${fl.id}`)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md active:scale-[0.99] flex flex-col justify-between ${
                fl.hasIssues
                  ? 'bg-amber-50/50 border-amber-200/90'
                  : 'bg-white border-slate-200/80 hover:border-school-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        fl.hasIssues ? 'bg-amber-500 text-white' : 'bg-school-600 text-white'
                      }`}
                    >
                      {fl.id === 'ground'
                        ? 'G'
                        : fl.id === 'first'
                        ? '1'
                        : fl.id === 'second'
                        ? '2'
                        : fl.id === 'third'
                        ? '3'
                        : '4'}
                    </div>
                    <span className="font-extrabold text-xs text-slate-900">
                      {isEn ? fl.labelEn : fl.labelAr}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      fl.hasIssues
                        ? 'bg-amber-100 text-amber-900 border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {fl.hasIssues
                      ? `${fl.openTicketsCount} ${t('common.tickets')}`
                      : t('devices.operational')}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                  {isEn ? fl.descriptionEn : fl.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100/80 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-500">{t('dashboard.devicesLabel')}:</span>
                  <span className="text-slate-800 font-mono">
                    {fl.devicesCount} {t('devices.pc')}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all ${
                      fl.hasIssues ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${fl.healthRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: 4 Computer & Language Labs Live Status Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-school-600" />
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {t('dashboard.labsSectionTitle')}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {t('dashboard.labsSectionSubtitle')}
              </span>
            </div>
          </div>
          <Link
            to="/labs"
            className="text-xs font-bold text-school-600 hover:text-school-800 inline-flex items-center gap-1 transition-colors"
          >
            <span>{t('dashboard.viewLabsLink')}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {labs.map(lab => {
            const hasIssue = lab.issueDevices > 0 || lab.activeTickets > 0;

            return (
              <div
                key={lab.labNumber}
                onClick={() => navigate(`/devices?lab=${lab.labNumber}`)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md active:scale-[0.99] ${
                  hasIssue
                    ? 'bg-amber-50/40 border-amber-200/90'
                    : 'bg-white border-slate-200/80 hover:border-school-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                        hasIssue ? 'bg-amber-500 text-white' : 'bg-school-600 text-white'
                      }`}
                    >
                      {padZero(lab.labNumber)}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">
                        {isEn ? (lab.nameEn || lab.name) : (lab.nameAr || lab.name)}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-semibold block">
                        {lab.totalDevices} {t('devices.pc')} {lab.floor ? `• ${lab.floor}` : ''}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                      hasIssue
                        ? 'bg-amber-100 text-amber-900 border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        hasIssue ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                      }`}
                    />
                    {hasIssue
                      ? `${lab.issueDevices} ${t('common.issues')}`
                      : t('devices.operational')}
                  </span>
                </div>

                <div className="space-y-1.5 pt-2.5 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">{t('dashboard.healthyDevices')}:</span>
                    <span className="text-slate-800 font-bold">
                      {lab.operationalDevices} / {lab.totalDevices}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all ${
                        hasIssue ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${(lab.operationalDevices / lab.totalDevices) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics 3-Column Grid: Problem Types, Locations, Departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Problem Types Breakdown */}
        <Card className="p-0">
          <CardHeader
            title={
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-school-600" />
                <span>{t('dashboard.problemTypesTitle')}</span>
              </div>
            }
            subtitle={t('dashboard.problemTypesSubtitle')}
          />
          <CardBody className="p-4 sm:p-5 space-y-3.5">
            {problemTypeStats.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                {t('dashboard.noTicketsRecorded')}
              </div>
            ) : (
              problemTypeStats.map((item, idx) => (
                <div key={item.type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 truncate max-w-[200px]">
                      {translateProblemType(item.type, t)}
                    </span>
                    <span className="text-slate-500 font-mono">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        idx === 0
                          ? 'bg-rose-500'
                          : idx === 1
                          ? 'bg-amber-500'
                          : 'bg-school-600'
                      }`}
                      style={{ width: `${Math.max(6, item.percentage)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* Card 2: Location Breakdown */}
        <Card className="p-0">
          <CardHeader
            title={
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-600" />
                <span>{t('dashboard.facilitiesTitle')}</span>
              </div>
            }
            subtitle={t('dashboard.facilitiesSubtitle')}
          />
          <CardBody className="p-4 sm:p-5 space-y-3.5">
            {locationStats.map(loc => (
              <div key={loc.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800">{loc.label}</span>
                  <div className="flex items-center gap-2 font-mono">
                    {loc.active > 0 && (
                      <span className="text-[10px] text-rose-600 font-bold">
                        {loc.active} {t('status.open')}
                      </span>
                    )}
                    <span className="text-slate-500">{loc.count} {t('common.tickets')}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${Math.max(4, loc.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Card 3: Top Requester Departments */}
        <Card className="p-0">
          <CardHeader
            title={
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" />
                <span>{t('dashboard.departmentsTitle')}</span>
              </div>
            }
            subtitle={t('dashboard.departmentsSubtitle')}
          />
          <CardBody className="p-4 sm:p-5 space-y-3.5">
            {departmentStats.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                {t('dashboard.noTicketsRecorded')}
              </div>
            ) : (
              departmentStats.map((dept, idx) => (
                <div key={dept.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800">
                      {translateDepartment(dept.name, t)}
                    </span>
                    <span className="text-slate-500 font-mono">
                      {dept.count} ({dept.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        idx === 0 ? 'bg-emerald-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${Math.max(6, dept.percentage)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>

      {/* Recent Tickets Table Section */}
      <Card className="p-0">
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <span>{t('dashboard.recentTicketsTitle')}</span>
              <span className="text-xs font-bold text-school-600 bg-school-50 px-2 py-0.5 rounded-full border border-school-200">
                {tickets.length} {t('common.tickets')}
              </span>
            </div>
          }
          subtitle={t('dashboard.recentTicketsSubtitle')}
          action={
            <Link to="/tickets">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />}>
                {t('dashboard.viewAllTickets')}
              </Button>
            </Link>
          }
        />
        <CardBody className="p-0">
          {tickets.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              {t('dashboard.noTicketsEmptyState')}
            </div>
          ) : (
            <TicketTable
              tickets={tickets.slice(0, 10)}
              onViewTicket={handleViewDetails}
              onStartWorking={tkt => handleStartWorking(tkt.id)}
              onResolveTicket={handleOpenResolve}
              onDeleteTicket={handleRequestDeleteSingle}
              onDeviceClick={handleViewDeviceHistory}
            />
          )}
        </CardBody>
      </Card>

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
    </div>
  );
};

