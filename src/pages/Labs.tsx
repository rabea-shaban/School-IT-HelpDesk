import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layers, AlertTriangle, Laptop, TrendingUp } from 'lucide-react';
import { Lab, LabStats } from '../types/lab';
import { subscribeToLabs } from '../firebase/labs';
import { LabCards } from '../components/LabTable/LabCards';
import { LabStatsChart } from '../components/LabTable/LabStatsChart';
import { StatCard } from '../components/ui/StatCard';
import { Skeleton } from '../components/ui/Skeleton';
import { TOTAL_LABS_COUNT } from '../utils/constants';

export const Labs: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToLabs(liveLabs => {
      setLabs(liveLabs);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Compute live lab stats
  const stats: LabStats = {
    totalLabs: TOTAL_LABS_COUNT,
    totalLabDevices: labs.reduce((sum, l) => sum + l.totalDevices, 0) || 103,
    totalOpenTickets: labs.reduce((sum, l) => sum + l.activeTickets, 0),
    mostProblematicLab: (() => {
      let max = 0;
      let topLab: { labNumber: number; name: string; ticketsCount: number } | null = null;
      labs.forEach(l => {
        if (l.totalTickets > max) {
          max = l.totalTickets;
          topLab = {
            labNumber: l.labNumber,
            name: isEn ? (l.nameEn || l.name) : (l.nameAr || l.name),
            ticketsCount: l.totalTickets,
          };
        }
      });
      return topLab;
    })(),
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('labs.title', { count: TOTAL_LABS_COUNT })}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t('common.liveSync')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('labs.subtitle')}
          </p>
        </div>
      </div>

      {/* Top Stats Overview */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title={t('labs.totalLabsCard')}
            value={stats.totalLabs}
            icon={<Layers className="w-5 h-5" />}
            variant="blue"
            description={t('labs.totalLabsCardDesc')}
          />
          <StatCard
            title={t('labs.totalLabPCsCard')}
            value={stats.totalLabDevices}
            icon={<Laptop className="w-5 h-5" />}
            variant="slate"
            description={t('labs.totalLabPCsCardDesc')}
          />
          <StatCard
            title={t('labs.activeLabIssuesCard')}
            value={stats.totalOpenTickets}
            icon={<AlertTriangle className="w-5 h-5" />}
            variant={stats.totalOpenTickets > 0 ? 'amber' : 'emerald'}
            description={t('labs.activeLabIssuesCardDesc')}
          />
          <StatCard
            title={t('labs.mostReportedLabCard')}
            value={stats.mostProblematicLab ? stats.mostProblematicLab.name : t('labs.none')}
            icon={<TrendingUp className="w-5 h-5" />}
            variant="rose"
            description={
              stats.mostProblematicLab
                ? `${stats.mostProblematicLab.ticketsCount} ${t('common.tickets')}`
                : t('labs.allOperational')
            }
          />
        </div>
      )}

      {/* Problematic Labs Ranking Chart */}
      <LabStatsChart labs={labs} />

      {/* All 4 Labs Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">{t('labs.sectionTitle')}</h2>
          <span className="text-xs text-slate-500">{t('labs.sectionSubtitle')}</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-56 rounded-2xl" />
            ))}
          </div>
        ) : (
          <LabCards labs={labs} />
        )}
      </div>
    </div>
  );
};
