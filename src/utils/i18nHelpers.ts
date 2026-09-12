import { TFunction } from 'i18next';
import { SCHOOL_FLOORS, SCHOOL_ROOMS } from './constants';
import { Device } from '../types/device';
import { Ticket } from '../types/ticket';

/**
 * Translate a Job Title
 */
export const translateJobTitle = (jobTitle: string | undefined, t: TFunction): string => {
  if (!jobTitle) return '';
  const key = `jobTitles.${jobTitle}`;
  const translated = t(key);
  return translated !== key ? translated : jobTitle;
};

/**
 * Translate a Department Name
 */
export const translateDepartment = (dept: string | undefined, t: TFunction): string => {
  if (!dept) return '';
  const key = `departments.${dept}`;
  const translated = t(key);
  return translated !== key ? translated : dept;
};

/**
 * Translate a Problem Type
 */
export const translateProblemType = (problem: string | undefined, t: TFunction): string => {
  if (!problem) return '';
  const key = `problems.${problem}`;
  const translated = t(key);
  return translated !== key ? translated : problem;
};

/**
 * Translate Floor ID or Label
 */
export const translateFloor = (floor: string | undefined, isEn: boolean): string => {
  if (!floor) return '';
  const config = SCHOOL_FLOORS.find(
    f => f.id === floor || f.labelEn === floor || f.labelAr === floor
  );
  if (config) {
    return isEn ? config.labelEn : config.labelAr;
  }
  return floor;
};

/**
 * Translate Room Config or Name
 */
export const translateRoomName = (roomName: string | undefined, isEn: boolean): string => {
  if (!roomName) return '';
  
  // Clean up any old concatenated patterns like "Name (الاسم)"
  const cleanSearch = roomName.replace(/\s*\([^)]*\)/g, '').trim();

  const found = SCHOOL_ROOMS.find(
    r =>
      r.id === roomName ||
      r.nameEn.toLowerCase() === roomName.toLowerCase() ||
      r.nameAr.toLowerCase() === roomName.toLowerCase() ||
      r.nameEn.toLowerCase() === cleanSearch.toLowerCase() ||
      r.nameAr.toLowerCase() === cleanSearch.toLowerCase()
  );

  if (found) {
    return isEn ? found.nameEn : found.nameAr;
  }

  // Known hardcoded patterns fallback
  if (roomName.includes('معمل 1') || roomName.includes('Lab 01') || roomName.includes('Lab 1')) {
    return isEn ? 'Computer Lab 01' : 'معمل 1 كمبيوتر';
  }
  if (roomName.includes('معمل اللغات') || roomName.includes('Language Lab')) {
    return isEn ? 'Language Lab' : 'معمل اللغات';
  }
  if (roomName.includes('معمل 3') || roomName.includes('Lab 03') || roomName.includes('Lab 3')) {
    return isEn ? 'Computer Lab 03' : 'معمل 3 كمبيوتر';
  }
  if (roomName.includes('معمل 4') || roomName.includes('Lab 04') || roomName.includes('Lab 4')) {
    return isEn ? 'Computer Lab 04' : 'معمل 4 كمبيوتر';
  }
  if (roomName.includes('المدرسين') || roomName.includes('Teachers')) {
    return isEn ? 'Teachers Room' : 'حجرة المدرسين';
  }
  if (roomName.includes('الاجتماعية') || roomName.includes('Social')) {
    return isEn ? 'Social Worker Office' : 'مكتب الأخصائية الاجتماعية';
  }
  if (roomName.includes('العاملين') || roomName.includes('HR') || roomName.includes('Personnel')) {
    return isEn ? 'Personnel / HR Office' : 'مكتب شؤون العاملين';
  }
  if (roomName.includes('الطلبة') || roomName.includes('Students') || roomName.includes('Student Affairs')) {
    return isEn ? 'Student Affairs Office' : 'مكتب شؤون الطلبة';
  }
  if (roomName.includes('الجودة') || roomName.includes('Quality')) {
    return isEn ? 'Quality Assurance Office' : 'مكتب شؤون الجودة';
  }
  if (roomName.includes('التعليمي') || roomName.includes('Educational')) {
    return isEn ? 'Educational Office' : 'المكتب التعليمي';
  }
  if (roomName.includes('المدير الإداري') || roomName.includes('Administrative Director')) {
    return isEn ? 'Administrative Director Office' : 'مكتب المدير الإداري';
  }
  if (roomName.includes('المدير الأكاديمي') || roomName.includes('Academic Director')) {
    return isEn ? 'Academic Director Office' : 'مكتب المدير الأكاديمي';
  }
  if (roomName.includes('الاجتماعات') || roomName.includes('Meeting')) {
    return isEn ? 'Meeting Room' : 'حجرة الاجتماعات';
  }
  if (roomName.includes('عبد الرحمن') || roomName.includes('Abdelrahman')) {
    return isEn ? 'Abdelrahman Room' : 'حجرة عبد الرحمن';
  }
  if (roomName.includes('المبيعات') || roomName.includes('Sales')) {
    return isEn ? 'Sales Workshop' : 'ورشة المبيعات';
  }
  if (roomName.includes('المخازن') || roomName.includes('Stores') || roomName.includes('Warehouse')) {
    return isEn ? 'Stores Workshop' : 'ورشة المخازن';
  }
  if (roomName.includes('الوسائط') || roomName.includes('Multimedia') || roomName.includes('Media')) {
    return isEn ? 'Multimedia Room' : 'حجرة الوسائط';
  }
  if (roomName.includes('الامتحانات') || roomName.includes('Exams') || roomName.includes('Assessment')) {
    return isEn ? 'Assessment & Exams Office' : 'مكتب التقييم والامتحانات';
  }
  if (roomName.includes('العيادة') || roomName.includes('Clinic')) {
    return isEn ? 'School Clinic' : 'العيادة';
  }

  return cleanSearch;
};

/**
 * Translate Lab Name strictly
 */
export const translateLabName = (labNumber: number, isEn: boolean): string => {
  switch (labNumber) {
    case 1:
      return isEn ? 'Computer Lab 01' : 'معمل 1 كمبيوتر';
    case 2:
      return isEn ? 'Language Lab' : 'معمل اللغات';
    case 3:
      return isEn ? 'Computer Lab 03' : 'معمل 3 كمبيوتر';
    case 4:
      return isEn ? 'Computer Lab 04' : 'معمل 4 كمبيوتر';
    default:
      return isEn ? `Lab ${labNumber}` : `معمل ${labNumber}`;
  }
};

/**
 * Format Ticket Location with pure language string
 */
export const formatPureLocation = (ticket: Ticket | null | undefined, isEn: boolean, t: TFunction): string => {
  if (!ticket) return '';

  if (ticket.roomName) {
    const room = translateRoomName(ticket.roomName, isEn);
    const floor = ticket.floor ? translateFloor(ticket.floor, isEn) : '';
    return floor ? `${room} - ${floor}` : room;
  }

  if (ticket.customLocation) {
    return ticket.customLocation;
  }

  if (ticket.labNumber) {
    const lab = translateLabName(ticket.labNumber, isEn);
    return lab;
  }

  switch (ticket.locationType) {
    case 'teachers_room':
      return t('locations.teachers_room');
    case 'classroom':
      return ticket.classroomName ? `${t('locations.classroom')}: ${ticket.classroomName}` : t('locations.classroom');
    case 'office':
      return t('locations.office');
    default:
      return t('locations.other');
  }
};

/**
 * Translate Device Location strictly
 */
export const translateDeviceLocation = (device: Device, isEn: boolean, t: TFunction): string => {
  if (device.roomName) {
    return translateRoomName(device.roomName, isEn);
  }
  if (device.labNumber) {
    return translateLabName(device.labNumber, isEn);
  }
  if (device.type === 'teachers_room_pc') {
    return t('locations.teachers_room');
  }
  if (device.type === 'office_device') {
    return t('locations.office');
  }
  if (device.type === 'classroom_equipment') {
    return t('locations.classroom');
  }
  return device.location || t('locations.other');
};
