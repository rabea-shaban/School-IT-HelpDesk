import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  CheckCircle2,
  Clock,
  PlayCircle,
  AlertCircle,
  Copy,
  Check,
  Printer,
  Share2,
  MapPin,
  Laptop,
  User,
  HelpCircle,
  FileText,
  Sparkles,
  PlusCircle,
  ShieldCheck,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { Ticket } from '../types/ticket';
import { subscribeToTicketByQuery } from '../firebase/tickets';
import { useToast } from '../context/ToastContext';
import { formatDateTime, getStatusConfig, getPriorityConfig } from '../utils/formatters';
import {
  translateJobTitle,
  translateDepartment,
  translateProblemType,
  formatPureLocation,
} from '../utils/i18nHelpers';

export const TrackTicket: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const { ticketNumber: paramTicketNumber } = useParams<{ ticketNumber?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess } = useToast();

  const queryFromUrl = paramTicketNumber || searchParams.get('number') || searchParams.get('id') || '';

  const [inputQuery, setInputQuery] = useState(queryFromUrl);
  const [activeQuery, setActiveQuery] = useState(queryFromUrl.trim());
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState<boolean>(!!queryFromUrl.trim());
  const [hasSearched, setHasSearched] = useState<boolean>(!!queryFromUrl.trim());
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync activeQuery when URL parameter changes
  useEffect(() => {
    if (queryFromUrl && queryFromUrl !== activeQuery) {
      setInputQuery(queryFromUrl);
      setActiveQuery(queryFromUrl.trim());
      setHasSearched(true);
    }
  }, [queryFromUrl]);

  // Real-time subscription to the ticket
  useEffect(() => {
    if (!activeQuery) {
      setTicket(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToTicketByQuery(activeQuery, foundTicket => {
      setTicket(foundTicket);
      setLoading(false);
      setHasSearched(true);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [activeQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputQuery.trim();
    if (!clean) return;

    setActiveQuery(clean);
    setHasSearched(true);
    setSearchParams({ number: clean });
  };

  const handleCopyTicketNumber = () => {
    if (!ticket) return;
    navigator.clipboard.writeText(ticket.ticketNumber);
    setCopiedNumber(true);
    showSuccess(t('track.numberCopiedToast'), t('common.success'));
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const handleCopyTrackingLink = () => {
    if (!ticket) return;
    const url = `${window.location.origin}/track/${ticket.ticketNumber}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    showSuccess(t('track.linkCopiedToast'), t('common.success'));
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Determine timeline progress steps
  const getStepStatus = (stepIndex: number) => {
    if (!ticket) return 'upcoming';

    const status = ticket.status;

    if (stepIndex === 0) {
      return 'completed';
    }

    if (stepIndex === 1) {
      if (status === 'in-progress') return 'current';
      if (status === 'resolved' || status === 'closed') return 'completed';
      return 'upcoming';
    }

    if (stepIndex === 2) {
      if (status === 'resolved') return 'completed';
      if (status === 'closed') return 'completed';
      return 'upcoming';
    }

    if (stepIndex === 3) {
      if (status === 'closed') return 'completed';
      return 'upcoming';
    }

    return 'upcoming';
  };

  const statusCfg = ticket ? getStatusConfig(ticket.status) : null;
  const priorityCfg = ticket ? getPriorityConfig(ticket.priority) : null;
  const statusKey = ticket ? ticket.status.replace('-', '_') : '';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-school-500 selection:text-white">
      <Navbar />

      {/* Hero Search Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#071526] via-[#0a223c] to-[#0f2d4e] text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 shadow-2xl">
        {/* Glow lights */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-r from-school-500/20 via-orange-500/15 to-indigo-500/20 blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-school-200 text-xs font-black tracking-wide uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('track.heroBadge')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {t('track.heroTitle')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            {t('track.heroSubtitle')}
          </p>

          {/* Search Input Box */}
          <form onSubmit={handleSearchSubmit} className="pt-2 max-w-2xl mx-auto">
            <div className="relative flex flex-col sm:flex-row items-stretch gap-2 bg-white/10 p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-slate-300 absolute left-4 rtl:left-auto rtl:right-4 pointer-events-none" />
                <input
                  type="text"
                  value={inputQuery}
                  onChange={e => setInputQuery(e.target.value)}
                  placeholder={t('track.searchPlaceholder')}
                  className="w-full pl-11 pr-4 rtl:pl-4 rtl:pr-11 py-3 bg-white/95 rounded-xl sm:rounded-2xl text-slate-900 text-sm sm:text-base font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-school-400 transition-all font-mono"
                  dir="ltr"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="px-6 py-3 rounded-xl sm:rounded-2xl shadow-lg shadow-school-600/40 text-sm font-bold shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>{t('track.searchButton')}</span>
              </Button>
            </div>

            {/* Hint & Examples */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-[11px] text-slate-300">
              <span className="font-semibold text-slate-400">{t('track.exampleLabel')}:</span>
              <button
                type="button"
                onClick={() => {
                  setInputQuery('TCK-2026-0101');
                  setActiveQuery('TCK-2026-0101');
                  setHasSearched(true);
                  setSearchParams({ number: 'TCK-2026-0101' });
                }}
                className="font-mono bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md border border-white/10 transition-colors"
              >
                TCK-2026-0101
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputQuery('102');
                  setActiveQuery('102');
                  setHasSearched(true);
                  setSearchParams({ number: '102' });
                }}
                className="font-mono bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md border border-white/10 transition-colors"
              >
                102
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-20 rounded-3xl" />
            <Skeleton className="h-44 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        ) : !hasSearched ? (
          /* Initial Guidance State */
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-school-50 border border-school-200 flex items-center justify-center mx-auto text-school-600 shadow-inner">
              <Search className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-black text-slate-900">
                {t('track.initialStateTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {t('track.initialStateSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4 text-left rtl:text-right">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="w-7 h-7 rounded-xl bg-school-600 text-white font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="text-xs font-bold text-slate-800">{t('track.step1Title')}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {t('track.step1Desc')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="w-7 h-7 rounded-xl bg-school-600 text-white font-black text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="text-xs font-bold text-slate-800">{t('track.step2Title')}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {t('track.step2Desc')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="w-7 h-7 rounded-xl bg-school-600 text-white font-black text-xs flex items-center justify-center">
                  3
                </span>
                <h4 className="text-xs font-bold text-slate-800">{t('track.step3Title')}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {t('track.step3Desc')}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-3">
              <Link to="/">
                <Button variant="outline" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                  {t('dashboard.newTicketButton')}
                </Button>
              </Link>
            </div>
          </div>
        ) : !ticket ? (
          /* Ticket Not Found State */
          <div className="bg-white rounded-3xl border border-rose-200/80 p-8 sm:p-12 text-center space-y-5 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-500 shadow-inner">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-black text-slate-900">
                {t('track.notFoundTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {t('track.notFoundSubtitle', { query: activeQuery })}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 max-w-lg mx-auto text-left rtl:text-right space-y-2">
              <span className="font-bold text-slate-800 block">
                {t('track.notFoundTipsTitle')}
              </span>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500">
                <li>{t('track.notFoundTip1')}</li>
                <li>{t('track.notFoundTip2')}</li>
                <li>{t('track.notFoundTip3')}</li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInputQuery('');
                  setActiveQuery('');
                  setHasSearched(false);
                  setSearchParams({});
                }}
              >
                {t('track.tryAnotherNumber')}
              </Button>
              <Link to="/">
                <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                  {t('dashboard.newTicketButton')}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Found Ticket Details & Real-Time Tracking Card */
          <div className="space-y-6 animate-fadeIn" id="printable-track">
            {/* Live Sync Badge Bar */}
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200/80 px-4 py-2.5 rounded-2xl text-xs font-bold text-emerald-900">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>{t('track.liveUpdatesActive')}</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-700">
                {t('common.lastUpdated')}: {formatDateTime(ticket.updatedAt, i18n.language)}
              </span>
            </div>

            {/* Ticket Header Card */}
            <Card className="p-0 overflow-hidden shadow-md">
              <CardHeader className="bg-gradient-to-r from-slate-900 via-[#0b2444] to-[#0f3057] text-white p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-school-300 uppercase tracking-widest">
                        {t('submit.ticketNumberBox')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-2xl sm:text-3xl font-black text-white bg-white/10 px-3.5 py-1 rounded-2xl border border-white/20 shadow-inner">
                        {ticket.ticketNumber}
                      </span>
                      {statusCfg && (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-extrabold ${statusCfg.bg}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                          {t(`status.${statusKey}`)}
                        </span>
                      )}
                      {priorityCfg && (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold ${priorityCfg.badge}`}
                        >
                          {t(`priority.${ticket.priority}`)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Top Action Buttons (Copy, Share, Print) */}
                  <div className="flex items-center gap-2 self-end sm:self-center no-print">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyTicketNumber}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs py-1.5 px-2.5"
                      title={t('submit.copyTicket')}
                    >
                      {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber ? t('submit.copied') : t('track.copyCode')}</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyTrackingLink}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs py-1.5 px-2.5"
                      title={t('track.shareLink')}
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? t('submit.copied') : t('track.shareLink')}</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrint}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs py-1.5 px-2.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="p-5 sm:p-8 space-y-8">
                {/* 1. VISUAL STEP TIMELINE */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-school-600" />
                      <span>{t('track.timelineTitle')}</span>
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {t('track.timelineSubtitle')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                    {/* Step 1: Received */}
                    <div
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        getStepStatus(0) === 'completed'
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            <Check className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                            {t('track.stage1Badge')}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 pt-1">
                          {t('track.stage1Title')}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {t('track.stage1Desc')}
                        </p>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 mt-2 block">
                        {formatDateTime(ticket.createdAt, i18n.language)}
                      </span>
                    </div>

                    {/* Step 2: In Progress */}
                    <div
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        getStepStatus(1) === 'completed'
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : getStepStatus(1) === 'current'
                          ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30'
                          : 'bg-slate-50/70 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
                              getStepStatus(1) === 'completed'
                                ? 'bg-emerald-500 text-white'
                                : getStepStatus(1) === 'current'
                                ? 'bg-amber-500 text-white animate-pulse'
                                : 'bg-slate-300 text-slate-700'
                            }`}
                          >
                            {getStepStatus(1) === 'completed' ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <PlayCircle className="w-4 h-4" />
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              getStepStatus(1) === 'completed'
                                ? 'text-emerald-700 bg-emerald-100/80'
                                : getStepStatus(1) === 'current'
                                ? 'text-amber-800 bg-amber-200/90 animate-pulse'
                                : 'text-slate-500 bg-slate-200'
                            }`}
                          >
                            {getStepStatus(1) === 'current'
                              ? t('track.inProgressBadge')
                              : t('track.stage2Badge')}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 pt-1">
                          {t('track.stage2Title')}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {ticket.resolvedBy
                            ? t('track.stage2Assigned', { name: ticket.resolvedBy })
                            : t('track.stage2Desc')}
                        </p>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 mt-2 block">
                        {getStepStatus(1) === 'current' || getStepStatus(1) === 'completed'
                          ? formatDateTime(ticket.updatedAt, i18n.language)
                          : '—'}
                      </span>
                    </div>

                    {/* Step 3: Resolved */}
                    <div
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        getStepStatus(2) === 'completed'
                          ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20'
                          : 'bg-slate-50/70 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
                              getStepStatus(2) === 'completed'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-300 text-slate-700'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              getStepStatus(2) === 'completed'
                                ? 'text-emerald-700 bg-emerald-100/90'
                                : 'text-slate-500 bg-slate-200'
                            }`}
                          >
                            {t('track.stage3Badge')}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 pt-1">
                          {t('track.stage3Title')}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {t('track.stage3Desc')}
                        </p>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 mt-2 block">
                        {ticket.resolvedAt ? formatDateTime(ticket.resolvedAt, i18n.language) : '—'}
                      </span>
                    </div>

                    {/* Step 4: Closed */}
                    <div
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        getStepStatus(3) === 'completed'
                          ? 'bg-slate-100 border-slate-300'
                          : 'bg-slate-50/70 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
                              getStepStatus(3) === 'completed'
                                ? 'bg-slate-800 text-white'
                                : 'bg-slate-300 text-slate-700'
                            }`}
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              getStepStatus(3) === 'completed'
                                ? 'text-slate-700 bg-slate-200'
                                : 'text-slate-500 bg-slate-200'
                            }`}
                          >
                            {t('track.stage4Badge')}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 pt-1">
                          {t('track.stage4Title')}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {t('track.stage4Desc')}
                        </p>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 mt-2 block">
                        {ticket.status === 'closed'
                          ? formatDateTime(ticket.updatedAt, i18n.language)
                          : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. RESOLUTION REPORT NOTE (IF RESOLVED) */}
                {(ticket.status === 'resolved' || ticket.status === 'closed') && (
                  <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-emerald-950">
                            {t('track.resolutionReportTitle')}
                          </h4>
                          <span className="text-[11px] text-emerald-700 font-medium">
                            {t('track.resolutionReportSubtitle')}
                          </span>
                        </div>
                      </div>

                      {ticket.resolvedAt && (
                        <span className="text-[11px] font-mono text-emerald-800 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200">
                          {formatDateTime(ticket.resolvedAt, i18n.language)}
                        </span>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl bg-white/90 border border-emerald-200 text-sm text-emerald-950 font-medium leading-relaxed whitespace-pre-wrap">
                      {ticket.resolutionNote || t('status.resolved')}
                    </div>

                    {ticket.resolvedBy && (
                      <div className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>{t('modals.resolvedBy', { name: ticket.resolvedBy })}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. TICKET SUMMARY SPECIFICATIONS */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-school-600" />
                    <span>{t('track.requestSummaryTitle')}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Requester Box */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        {t('modals.requesterInfo')}
                      </span>
                      <div className="flex items-start gap-2.5">
                        <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
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

                    {/* Location & Device Box */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        {t('modals.locationHardware')}
                      </span>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                          <MapPin className="w-4 h-4 text-school-600 shrink-0" />
                          <span>{formatPureLocation(ticket, isEn, t)}</span>
                        </div>
                        {ticket.deviceId ? (
                          <div className="flex items-center gap-2 font-mono font-bold text-xs text-slate-900">
                            <Laptop className="w-4 h-4 text-slate-500 shrink-0" />
                            <span>{ticket.deviceId}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 block">
                            {t('modals.noDeviceIdAttached')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Problem Category */}
                  <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        {t('modals.problemCategory')}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {translateProblemType(ticket.problemType, t)}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {t('common.created')}: {formatDateTime(ticket.createdAt, i18n.language)}
                    </span>
                  </div>

                  {/* Problem Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{t('modals.problemDesc')}</span>
                    </label>
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                      {ticket.problemDescription}
                    </div>
                  </div>

                  {/* Requested Action */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-school-800 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-school-600 shrink-0" />
                      <span>{t('modals.requestedAction')}</span>
                    </label>
                    <div className="p-4 rounded-2xl bg-school-50/50 border border-school-200/80 text-xs sm:text-sm text-school-950 font-medium leading-relaxed whitespace-pre-wrap">
                      {ticket.requestedAction}
                    </div>
                  </div>
                </div>

                {/* Bottom Footer Actions */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 no-print">
                  <Link to="/" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      leftIcon={<PlusCircle className="w-4 h-4" />}
                    >
                      {t('dashboard.newTicketButton')}
                    </Button>
                  </Link>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setInputQuery('');
                      setActiveQuery('');
                      setHasSearched(false);
                      setSearchParams({});
                    }}
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                  >
                    {t('track.searchAnotherTicket')}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
