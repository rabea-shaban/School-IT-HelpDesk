import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layers } from 'lucide-react';
import { Lab } from '../../types/lab';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { translateLabName } from '../../utils/i18nHelpers';

interface LabStatsChartProps {
  labs: Lab[];
}

export const LabStatsChart: React.FC<LabStatsChartProps> = ({ labs }) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  // Sort labs by total tickets descending
  const sortedLabs = [...labs]
    .filter(l => l.totalTickets > 0)
    .sort((a, b) => b.totalTickets - a.totalTickets)
    .slice(0, 10);

  const maxTickets = sortedLabs.length > 0 ? sortedLabs[0].totalTickets : 1;

  return (
    <Card className="p-0">
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-school-600" />
            <span>{t('labs.chartTitle')}</span>
          </div>
        }
        subtitle={t('labs.chartSubtitle')}
      />
      <CardBody className="p-5 sm:p-6 space-y-4">
        {sortedLabs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            {t('labs.noLabTickets')}
          </div>
        ) : (
          sortedLabs.map((lab, rank) => {
            const percentage = Math.round((lab.totalTickets / maxTickets) * 100);
            const labName = translateLabName(lab.labNumber, isEn);

            return (
              <div key={lab.labNumber} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold flex items-center justify-center">
                      #{rank + 1}
                    </span>
                    <span className="text-slate-900 font-bold">{labName}</span>
                    {lab.activeTickets > 0 && (
                      <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full font-bold border border-rose-200">
                        {lab.activeTickets} {t('common.issues')}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-slate-700 font-bold">
                    {lab.totalTickets} {t('common.tickets')}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      rank === 0
                        ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                        : rank === 1
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                        : 'bg-gradient-to-r from-school-500 to-blue-400'
                    }`}
                    style={{ width: `${Math.max(8, percentage)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardBody>
    </Card>
  );
};
