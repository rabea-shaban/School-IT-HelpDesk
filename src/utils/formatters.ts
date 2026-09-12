import { TicketPriority, TicketStatus, LocationType } from '../types/ticket';
import { DeviceStatus } from '../types/device';
import { translateRoomName, translateFloor, translateLabName } from './i18nHelpers';

/**
 * Format ISO date string into readable text
 */
export const formatDateTime = (isoString?: string | null, locale?: string): string => {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    const activeLang = locale || (typeof window !== 'undefined' ? localStorage.getItem('school_it_language') || 'ar' : 'ar');
    const isEn = activeLang.startsWith('en');
    
    return new Intl.DateTimeFormat(isEn ? 'en-US' : 'ar-EG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return isoString;
  }
};

export const formatDateOnly = (isoString?: string | null, locale?: string): string => {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    const activeLang = locale || (typeof window !== 'undefined' ? localStorage.getItem('school_it_language') || 'ar' : 'ar');
    const isEn = activeLang.startsWith('en');

    return new Intl.DateTimeFormat(isEn ? 'en-US' : 'ar-EG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoString;
  }
};

/**
 * Human-readable label & styles for Ticket Status
 */
export const getStatusConfig = (status: TicketStatus) => {
  switch (status) {
    case 'new':
      return {
        label: 'New',
        labelAr: 'جديد',
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        badge: 'bg-blue-100 text-blue-800',
      };
    case 'in-progress':
      return {
        label: 'In Progress',
        labelAr: 'قيد التنفيذ',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500 animate-pulse',
        badge: 'bg-amber-100 text-amber-800',
      };
    case 'resolved':
      return {
        label: 'Resolved',
        labelAr: 'تم التصليح',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        badge: 'bg-emerald-100 text-emerald-800',
      };
    case 'closed':
      return {
        label: 'Closed',
        labelAr: 'مغلق',
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        badge: 'bg-slate-200 text-slate-800',
      };
  }
};

/**
 * Human-readable label & styles for Ticket Priority
 */
export const getPriorityConfig = (priority: TicketPriority) => {
  switch (priority) {
    case 'low':
      return {
        label: 'Low',
        labelAr: 'منخفض',
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        badge: 'bg-slate-100 text-slate-700',
        iconColor: 'text-slate-400',
      };
    case 'medium':
      return {
        label: 'Medium',
        labelAr: 'متوسط',
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        badge: 'bg-blue-50 text-blue-700',
        iconColor: 'text-blue-500',
      };
    case 'high':
      return {
        label: 'High',
        labelAr: 'مرتفع',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        badge: 'bg-amber-100 text-amber-800 font-semibold',
        iconColor: 'text-amber-500',
      };
    case 'urgent':
      return {
        label: 'Urgent',
        labelAr: 'عاجل جداً',
        bg: 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse-subtle',
        badge: 'bg-rose-100 text-rose-800 font-bold',
        iconColor: 'text-rose-600',
      };
  }
};

/**
 * Device status label & styling
 */
export const getDeviceStatusConfig = (status: DeviceStatus) => {
  switch (status) {
    case 'operational':
      return {
        label: 'Operational',
        labelAr: 'يعمل بكفاءة',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800',
      };
    case 'has_issue':
      return {
        label: 'Active Issue',
        labelAr: 'يوجد عطل معلق',
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        badge: 'bg-rose-100 text-rose-800',
      };
    case 'under_maintenance':
      return {
        label: 'Maintenance',
        labelAr: 'تحت الصيانة',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        badge: 'bg-amber-100 text-amber-800',
      };
  }
};

/**
 * Format location string strictly in single language
 */
export const formatLocationDisplay = (
  ticket: {
    locationType: LocationType;
    labNumber?: number;
    roomName?: string;
    floor?: string;
    classroomName?: string;
    customLocation?: string;
    deviceId?: string;
  },
  isEn = false
): string => {
  if (ticket.roomName) {
    return translateRoomName(ticket.roomName, isEn);
  }
  if (ticket.customLocation) {
    return ticket.customLocation;
  }
  if (ticket.labNumber) {
    return translateLabName(ticket.labNumber, isEn);
  }
  switch (ticket.locationType) {
    case 'teachers_room':
      return isEn ? 'Teachers Room' : 'حجرة المدرسين';
    case 'classroom':
      return isEn
        ? ticket.classroomName ? `Classroom: ${ticket.classroomName}` : 'Classroom'
        : ticket.classroomName ? `فصل: ${ticket.classroomName}` : 'فصل دراسي';
    case 'office':
      return isEn ? 'Administrative Office' : 'مكتب إداري';
    case 'other':
    default:
      return isEn ? 'Other Location' : 'مكان آخر';
  }
};
