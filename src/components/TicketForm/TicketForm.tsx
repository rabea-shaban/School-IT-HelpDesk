import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import {
  User,
  Briefcase,
  Building,
  MapPin,
  Monitor,
  AlertCircle,
  CheckCircle,
  Send,
  Building2,
} from 'lucide-react';
import { TicketFormData } from '../../types/ticket';
import {
  JOB_TITLES,
  DEPARTMENTS,
  PROBLEM_TYPES,
  PRIORITIES,
  SCHOOL_FLOORS,
  SCHOOL_ROOMS,
} from '../../utils/constants';
import { getLabDevices, getTeachersRoomDevices, padZero } from '../../utils/deviceGenerator';
import {
  translateJobTitle,
  translateDepartment,
  translateProblemType,
  translateFloor,
  translateRoomName,
} from '../../utils/i18nHelpers';
import { Button } from '../ui/Button';

interface TicketFormProps {
  onSubmit: (data: TicketFormData) => Promise<void>;
  isLoading?: boolean;
}

export const TicketForm: React.FC<TicketFormProps> = ({ onSubmit, isLoading = false }) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  // Dynamic schema localized according to current language
  const ticketSchema = useMemo(() => {
    return z
      .object({
        name: z.string().min(2, t('validation.nameMin')),
        jobTitle: z.string().min(1, t('validation.jobTitleRequired')),
        jobTitleCustom: z.string().optional(),
        department: z.string().min(1, t('validation.departmentRequired')),
        departmentCustom: z.string().optional(),
        floor: z.string().min(1, t('validation.floorRequired')),
        roomId: z.string().min(1, t('validation.roomRequired')),
        roomNameCustom: z.string().optional(),
        deviceId: z.string().optional(),
        deviceIdCustom: z.string().optional(),
        problemType: z.string().min(1, t('validation.problemTypeRequired')),
        problemDescription: z.string().min(5, t('validation.problemDescRequired')),
        requestedAction: z.string().min(5, t('validation.requestedActionRequired')),
        priority: z.enum(['low', 'medium', 'high', 'urgent']),
      })
      .refine(
        data => {
          if (data.jobTitle === 'Other' && (!data.jobTitleCustom || data.jobTitleCustom.trim() === '')) {
            return false;
          }
          return true;
        },
        {
          message: t('validation.jobTitleCustomRequired'),
          path: ['jobTitleCustom'],
        }
      )
      .refine(
        data => {
          if (data.department === 'Other' && (!data.departmentCustom || data.departmentCustom.trim() === '')) {
            return false;
          }
          return true;
        },
        {
          message: t('validation.departmentCustomRequired'),
          path: ['departmentCustom'],
        }
      )
      .refine(
        data => {
          if (data.roomId === 'other' && (!data.roomNameCustom || data.roomNameCustom.trim() === '')) {
            return false;
          }
          return true;
        },
        {
          message: t('validation.roomCustomRequired'),
          path: ['roomNameCustom'],
        }
      );
  }, [t]);

  type TicketFormInternalValues = z.infer<typeof ticketSchema>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<TicketFormInternalValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      name: '',
      jobTitle: '',
      jobTitleCustom: '',
      department: '',
      departmentCustom: '',
      floor: 'second',
      roomId: 'f2-lab1',
      roomNameCustom: '',
      deviceId: 'PC-01-01',
      deviceIdCustom: '',
      problemType: 'Computer Not Working',
      problemDescription: '',
      requestedAction: '',
      priority: 'medium',
    },
  });

  const selectedJobTitle = watch('jobTitle');
  const selectedDepartment = watch('department');
  const selectedFloor = watch('floor');
  const selectedRoomId = watch('roomId');
  const selectedDeviceId = watch('deviceId');

  // Rooms available for the selected floor
  const availableRooms = useMemo(() => {
    if (!selectedFloor || selectedFloor === 'other') return [];
    return SCHOOL_ROOMS.filter(r => r.floor === selectedFloor);
  }, [selectedFloor]);

  // Selected room config
  const currentRoomConfig = useMemo(() => {
    return SCHOOL_ROOMS.find(r => r.id === selectedRoomId);
  }, [selectedRoomId]);

  // Devices available for current room
  const availableDevices = useMemo(() => {
    if (!currentRoomConfig) return [];

    if (currentRoomConfig.type === 'lab' && currentRoomConfig.labNumber) {
      return getLabDevices(currentRoomConfig.labNumber);
    }
    if (currentRoomConfig.type === 'teachers_room') {
      return getTeachersRoomDevices();
    }
    if (currentRoomConfig.devicesCount > 0 && currentRoomConfig.devicePrefix) {
      const list: string[] = [];
      for (let i = 1; i <= currentRoomConfig.devicesCount; i++) {
        list.push(`${currentRoomConfig.devicePrefix}-${padZero(i)}`);
      }
      return list;
    }
    return [];
  }, [currentRoomConfig]);

  // Change floor handler
  const handleFloorChange = (floorId: string) => {
    setValue('floor', floorId);
    if (floorId === 'other') {
      setValue('roomId', 'other');
      setValue('deviceId', '');
      return;
    }

    const roomsForFloor = SCHOOL_ROOMS.filter(r => r.floor === floorId);
    if (roomsForFloor.length > 0) {
      const firstRoom = roomsForFloor[0];
      setValue('roomId', firstRoom.id);
      autoSelectFirstDevice(firstRoom);
    } else {
      setValue('roomId', 'other');
      setValue('deviceId', '');
    }
  };

  // Change room handler
  const handleRoomChange = (roomId: string) => {
    setValue('roomId', roomId);
    if (roomId === 'other') {
      setValue('deviceId', 'other');
      return;
    }
    const room = SCHOOL_ROOMS.find(r => r.id === roomId);
    if (room) {
      autoSelectFirstDevice(room);
    }
  };

  const autoSelectFirstDevice = (room: (typeof SCHOOL_ROOMS)[0]) => {
    if (room.type === 'lab' && room.labNumber) {
      const devs = getLabDevices(room.labNumber);
      setValue('deviceId', devs[0] || '');
    } else if (room.type === 'teachers_room') {
      setValue('deviceId', 'TR-PC-01');
    } else if (room.devicesCount > 0 && room.devicePrefix) {
      setValue('deviceId', `${room.devicePrefix}-01`);
    } else {
      setValue('deviceId', '');
    }
  };

  // Final Form Submit mapping
  const onInternalSubmit = async (values: TicketFormInternalValues) => {
    const room = SCHOOL_ROOMS.find(r => r.id === values.roomId);
    const roomNameResolved =
      values.roomId === 'other'
        ? values.roomNameCustom?.trim() || t('locations.other')
        : room
        ? (isEn ? room.nameEn : room.nameAr)
        : values.roomId;

    const floorConfig = SCHOOL_FLOORS.find(f => f.id === values.floor);
    const floorLabel = floorConfig ? (isEn ? floorConfig.labelEn : floorConfig.labelAr) : values.floor;

    let locationType: TicketFormData['locationType'] = 'office';
    let labNumber: number | '' = '';

    if (room) {
      locationType = room.type;
      if (room.labNumber) labNumber = room.labNumber;
    } else if (values.floor === 'other' || values.roomId === 'other') {
      locationType = 'other';
    }

    const finalDeviceId =
      values.deviceId === 'other'
        ? values.deviceIdCustom?.trim() || ''
        : values.deviceId || values.deviceIdCustom?.trim() || '';

    const payload: TicketFormData = {
      name: values.name.trim(),
      jobTitle: values.jobTitle === 'Other' ? values.jobTitleCustom || 'Other' : values.jobTitle,
      jobTitleCustom: values.jobTitleCustom,
      department:
        values.department === 'Other' ? values.departmentCustom || 'Other' : values.department,
      departmentCustom: values.departmentCustom,
      locationType,
      floor: values.floor,
      roomName: roomNameResolved,
      classroomName: locationType === 'classroom' ? roomNameResolved : undefined,
      labNumber: labNumber === '' ? undefined : Number(labNumber),
      deviceId: finalDeviceId,
      customLocation: `${floorLabel} - ${roomNameResolved}`,
      problemType: values.problemType,
      problemDescription: values.problemDescription.trim(),
      requestedAction: values.requestedAction.trim(),
      priority: values.priority,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-6 sm:space-y-8">
      {/* SECTION 1: Requester Information */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/80 shadow-sm shadow-slate-900/5 transition-all">
        <div className="flex items-center gap-3 pb-4 sm:pb-5 border-b border-slate-100">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 font-extrabold text-sm sm:text-base">
            1
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              {t('submit.section1Title')}
            </h3>
            <p className="text-xs text-slate-500">{t('submit.section1Subtitle')}</p>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Full Name */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('submit.fullNameLabel')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 rtl:left-auto rtl:right-3.5" />
              <input
                type="text"
                placeholder={t('submit.fullNamePlaceholder')}
                {...register('name')}
                className={`w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl border bg-slate-50/50 focus:bg-white text-base sm:text-sm font-medium text-slate-900 transition-all focus:outline-none focus:ring-4 ${
                  errors.name
                    ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-school-100 focus:border-school-500'
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.name.message}
              </p>
            )}
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('submit.jobTitleLabel')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 rtl:left-auto rtl:right-3.5" />
              <select
                {...register('jobTitle')}
                className={`w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl border bg-slate-50/50 focus:bg-white text-base sm:text-sm font-medium text-slate-900 transition-all focus:outline-none focus:ring-4 ${
                  errors.jobTitle
                    ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-school-100 focus:border-school-500'
                }`}
              >
                <option value="">{t('submit.jobTitleSelectPlaceholder')}</option>
                {JOB_TITLES.map(title => (
                  <option key={title} value={title}>
                    {translateJobTitle(title, t)}
                  </option>
                ))}
              </select>
            </div>
            {errors.jobTitle && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.jobTitle.message}
              </p>
            )}

            {selectedJobTitle === 'Other' && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder={t('submit.customJobTitlePlaceholder')}
                  {...register('jobTitleCustom')}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-base sm:text-sm font-medium focus:ring-2 focus:ring-school-100 focus:border-school-500"
                />
                {errors.jobTitleCustom && (
                  <p className="mt-1 text-xs text-rose-600">{errors.jobTitleCustom.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('submit.departmentLabel')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 rtl:left-auto rtl:right-3.5" />
              <select
                {...register('department')}
                className={`w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl border bg-slate-50/50 focus:bg-white text-base sm:text-sm font-medium text-slate-900 transition-all focus:outline-none focus:ring-4 ${
                  errors.department
                    ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-school-100 focus:border-school-500'
                }`}
              >
                <option value="">{t('submit.departmentSelectPlaceholder')}</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>
                    {translateDepartment(dept, t)}
                  </option>
                ))}
              </select>
            </div>
            {errors.department && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.department.message}
              </p>
            )}

            {selectedDepartment === 'Other' && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder={t('submit.customDepartmentPlaceholder')}
                  {...register('departmentCustom')}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-base sm:text-sm font-medium focus:ring-2 focus:ring-school-100 focus:border-school-500"
                />
                {errors.departmentCustom && (
                  <p className="mt-1 text-xs text-rose-600">{errors.departmentCustom.message}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: Floor, Room & Device Picker */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/80 shadow-sm shadow-slate-900/5 transition-all">
        <div className="flex items-center gap-3 pb-4 sm:pb-5 border-b border-slate-100">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600 font-extrabold text-sm sm:text-base">
            2
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              {t('submit.section2Title')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('submit.section2Subtitle')}
            </p>
          </div>
        </div>

        {/* STEP A: Choose Floor */}
        <div className="mt-5 sm:mt-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-school-600" />
            <span>{t('submit.floorSelectLabel')}</span>
            <span className="text-rose-500">*</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {SCHOOL_FLOORS.map(floor => {
              const isSelected = selectedFloor === floor.id;
              const floorLabel = isEn ? floor.labelEn : floor.labelAr;
              const floorDesc = isEn ? floor.descriptionEn : floor.description;

              return (
                <button
                  key={floor.id}
                  type="button"
                  onClick={() => handleFloorChange(floor.id)}
                  className={`p-3 rounded-xl sm:rounded-2xl border text-left rtl:text-right flex flex-col justify-between transition-all select-none active:scale-[0.98] ${
                    isSelected
                      ? 'border-school-600 bg-school-50 text-school-950 shadow-sm ring-2 ring-school-200 font-bold'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <span className="text-xs font-black text-school-700 font-mono">
                      {floor.devicesCount > 0 ? `${floor.devicesCount} ${t('devices.pc')}` : t('locations.other')}
                    </span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-school-600" />}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold block leading-tight">
                      {floorLabel}
                    </span>
                    {floorDesc && (
                      <span className="text-[10px] text-slate-500 font-medium block mt-0.5 line-clamp-1">
                        {floorDesc}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP B: Choose Room / Lab / Office inside Floor */}
        <div className="mt-6 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/70 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Room Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-school-600" />
                <span>{t('submit.roomSelectLabel')}</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedRoomId}
                  onChange={e => handleRoomChange(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-white text-base sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 ${
                    errors.roomId
                      ? 'border-rose-300 focus:ring-rose-100'
                      : 'border-slate-200 focus:ring-school-100 focus:border-school-500'
                  }`}
                >
                  <option value="">{t('submit.roomSelectPlaceholder')}</option>
                  {availableRooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {isEn ? room.nameEn : room.nameAr}{' '}
                      {room.devicesCount > 0 ? `(${room.devicesCount} ${t('devices.pc')})` : ''}
                    </option>
                  ))}
                  <option value="other">{t('locations.other')}</option>
                </select>
              </div>

              {selectedRoomId === 'other' && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    placeholder={t('submit.customRoomPlaceholder')}
                    {...register('roomNameCustom')}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-base sm:text-sm font-medium focus:ring-2 focus:ring-school-100 focus:border-school-500"
                  />
                  {errors.roomNameCustom && (
                    <p className="mt-1 text-xs text-rose-600">{errors.roomNameCustom.message}</p>
                  )}
                </div>
              )}
            </div>

            {/* Device Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-school-600" />
                <span>{t('submit.deviceSelectLabel')}</span>
              </label>

              {availableDevices.length > 0 ? (
                <div className="space-y-2">
                  <div className="relative">
                    <select
                      {...register('deviceId')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-base sm:text-sm font-mono font-bold text-school-900 focus:outline-none focus:ring-4 focus:ring-school-100 focus:border-school-500"
                    >
                      {availableDevices.map((dId: string) => (
                        <option key={dId} value={dId}>
                          {dId}
                        </option>
                      ))}
                      <option value="other">{t('submit.otherDeviceOption')}</option>
                    </select>
                  </div>

                  {selectedDeviceId === 'other' && (
                    <input
                      type="text"
                      placeholder={t('submit.customDevicePlaceholder')}
                      {...register('deviceIdCustom')}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-mono font-medium focus:ring-2 focus:ring-school-100 focus:border-school-500"
                    />
                  )}
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder={t('submit.customDevicePlaceholder')}
                    {...register('deviceIdCustom')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-base sm:text-sm font-medium text-slate-900 focus:ring-4 focus:ring-school-100 focus:border-school-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Problem & Action Details */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/80 shadow-sm shadow-slate-900/5 transition-all">
        <div className="flex items-center gap-3 pb-4 sm:pb-5 border-b border-slate-100">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 font-extrabold text-sm sm:text-base">
            3
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              {t('submit.section4Title')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('submit.section4Subtitle')}
            </p>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 space-y-4 sm:space-y-6">
          {/* Problem Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('submit.problemTypeLabel')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                {...register('problemType')}
                className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 focus:bg-white text-base sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 ${
                  errors.problemType
                    ? 'border-rose-300 focus:ring-rose-100'
                    : 'border-slate-200 focus:ring-school-100 focus:border-school-500'
                }`}
              >
                {PROBLEM_TYPES.map(prob => (
                  <option key={prob} value={prob}>
                    {translateProblemType(prob, t)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Describe the Problem */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('submit.problemDescLabel')} <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder={t('submit.problemDescPlaceholder')}
              {...register('problemDescription')}
              className={`w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border bg-slate-50/50 focus:bg-white text-base sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 leading-relaxed ${
                errors.problemDescription
                  ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-school-100 focus:border-school-500'
              }`}
            />
            {errors.problemDescription && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.problemDescription.message}
              </p>
            )}
          </div>

          {/* What do you need from IT? */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span>{t('submit.requestedActionLabel')}</span>
              <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder={t('submit.requestedActionPlaceholder')}
              {...register('requestedAction')}
              className={`w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border bg-slate-50/50 focus:bg-white text-base sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 leading-relaxed ${
                errors.requestedAction
                  ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-school-100 focus:border-school-500'
              }`}
            />
            {errors.requestedAction && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.requestedAction.message}
              </p>
            )}
          </div>

          {/* Priority Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {t('submit.priorityLabel')} <span className="text-rose-500">*</span>
            </label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {PRIORITIES.map(p => {
                    const isSelected = field.value === p.id;
                    const priorityLabel = t(`priority.${p.id}`);
                    const priorityDesc = t(`priority.${p.id}Desc`);

                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => field.onChange(p.id)}
                        className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left rtl:text-right transition-all active:scale-[0.98] ${
                          isSelected
                            ? p.id === 'urgent'
                              ? 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-200 font-bold'
                              : p.id === 'high'
                              ? 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-200 font-bold'
                              : 'border-school-600 bg-school-50 text-school-950 ring-2 ring-school-200 font-bold'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {priorityLabel}
                          </span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-school-600" />}
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                          {priorityDesc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* Submit Button Bar */}
      <div className="flex items-center justify-end pt-1">
        <Button
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          className="w-full sm:w-auto px-8 py-3 text-base font-bold shadow-lg shadow-school-600/20"
          rightIcon={<Send className="w-4 h-4 rtl:rotate-180" />}
        >
          {t('submit.submitBtn')}
        </Button>
      </div>
    </form>
  );
};
