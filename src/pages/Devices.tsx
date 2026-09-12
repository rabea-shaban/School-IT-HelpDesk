import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Device } from '../types/device';
import { subscribeToDevices } from '../firebase/devices';
import { DeviceTable } from '../components/DeviceTable/DeviceTable';
import { DeviceHistoryModal } from '../components/DeviceTable/DeviceHistoryModal';
import { TableSkeleton } from '../components/ui/Skeleton';
import { TOTAL_SCHOOL_DEVICES_COUNT, TOTAL_LABS_COUNT } from '../utils/constants';

export const Devices: React.FC = () => {
  const { t } = useTranslation();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const labQuery = searchParams.get('lab');
  const initialLab = labQuery ? Number(labQuery) : 'all';
  const floorQuery = searchParams.get('floor');
  const initialFloor = floorQuery || 'all';

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToDevices(liveDevices => {
      setDevices(liveDevices);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleSelectDevice = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setIsHistoryOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('devices.title', { count: TOTAL_SCHOOL_DEVICES_COUNT })}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('devices.subtitle', { devices: TOTAL_SCHOOL_DEVICES_COUNT, labs: TOTAL_LABS_COUNT })}
          </p>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200">
          <TableSkeleton rows={8} columns={6} />
        </div>
      ) : (
        <DeviceTable
          devices={devices}
          onSelectDevice={handleSelectDevice}
          initialLabFilter={initialLab}
          initialFloorFilter={initialFloor}
        />
      )}

      {/* History Modal */}
      <DeviceHistoryModal
        deviceId={selectedDeviceId}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
};
