import { Device, SchoolFloor } from '../types/device';
import { Lab } from '../types/lab';
import {
  TOTAL_LABS_COUNT,
  TOTAL_SCHOOL_DEVICES_COUNT,
  getLabDeviceCount,
  getLabName,
  getLabShortName,
  SCHOOL_ROOMS,
  SCHOOL_FLOORS,
  SchoolRoomConfig,
} from './constants';

/**
 * Format a number with leading zeros (e.g. 5 -> "05")
 */
export const padZero = (num: number, length: number = 2): string => {
  return String(num).padStart(length, '0');
};

/**
 * Generate PC IDs for a specific Lab
 * Lab 1: PC-01-01 to PC-01-25 (25 PCs)
 * Lab 2: PC-LANG-01 to PC-LANG-28 (28 PCs)
 * Lab 3: PC-03-01 to PC-03-25 (25 PCs)
 * Lab 4: PC-04-01 to PC-04-25 (25 PCs)
 */
export const getLabDevices = (labNumber: number): string[] => {
  if (labNumber < 1 || labNumber > TOTAL_LABS_COUNT) return [];
  const count = getLabDeviceCount(labNumber);
  const devices: string[] = [];

  if (labNumber === 2) {
    for (let i = 1; i <= count; i++) {
      devices.push(`PC-LANG-${padZero(i)}`);
    }
  } else {
    const labStr = padZero(labNumber);
    for (let i = 1; i <= count; i++) {
      devices.push(`PC-${labStr}-${padZero(i)}`);
    }
  }
  return devices;
};

/**
 * Generate Teachers Room PCs (TR-PC-01 to TR-PC-08)
 */
export const getTeachersRoomDevices = (): string[] => {
  const devices: string[] = [];
  for (let i = 1; i <= 8; i++) {
    devices.push(`TR-PC-${padZero(i)}`);
  }
  return devices;
};

/**
 * Build all 4 initial Lab objects
 * Lab 1: 25 PCs (Second Floor)
 * Lab 2: 28 PCs (Second Floor - Language Lab)
 * Lab 3: 25 PCs (Third Floor)
 * Lab 4: 25 PCs (Fourth Floor)
 * Total Lab PCs: 103 PCs
 */
export const generateAllLabs = (): Lab[] => {
  const labsConfig: {
    labNumber: number;
    name: string;
    nameAr: string;
    nameEn: string;
    floor: string;
  }[] = [
    {
      labNumber: 1,
      name: 'Computer Lab 01',
      nameEn: 'Computer Lab 01',
      nameAr: 'معمل 1 كمبيوتر',
      floor: 'الدور الثاني',
    },
    {
      labNumber: 2,
      name: 'Language Lab',
      nameEn: 'Language Lab',
      nameAr: 'معمل اللغات',
      floor: 'الدور الثاني',
    },
    {
      labNumber: 3,
      name: 'Computer Lab 03',
      nameEn: 'Computer Lab 03',
      nameAr: 'معمل 3 كمبيوتر',
      floor: 'الدور الثالث',
    },
    {
      labNumber: 4,
      name: 'Computer Lab 04',
      nameEn: 'Computer Lab 04',
      nameAr: 'معمل 4 كمبيوتر',
      floor: 'الدور الرابع',
    },
  ];

  return labsConfig.map(cfg => {
    const devices = getLabDevices(cfg.labNumber);
    const totalCount = getLabDeviceCount(cfg.labNumber);
    return {
      labNumber: cfg.labNumber,
      name: cfg.name,
      nameAr: cfg.nameAr,
      nameEn: cfg.nameEn,
      floor: cfg.floor,
      totalDevices: totalCount,
      operationalDevices: totalCount,
      issueDevices: 0,
      totalTickets: 0,
      activeTickets: 0,
      resolvedTickets: 0,
      devices,
    };
  });
};

/**
 * Build all initial 133 Device objects according to school floor distribution:
 * Ground Floor: 4
 * First Floor: 11
 * Second Floor: 68 (Lab 1: 25, Language Lab: 28, Media: 1, Exams: 1, Teachers: 8, C classes: 5)
 * Third Floor: 25 (Lab 3)
 * Fourth Floor: 25 (Lab 4)
 * Total = 133 PCs
 */
export const generateAllDevices = (): Device[] => {
  const devices: Device[] = [];

  // 1. الدور الأرضي (4 أجهزة)
  devices.push(
    {
      id: 'GF-SOC-01',
      type: 'office_device',
      floor: 'ground',
      floorLabel: 'الدور الأرضي',
      roomName: 'مكتب الأخصائية الاجتماعية',
      location: 'الدور الأرضي - مكتب الأخصائية الاجتماعية',
      status: 'operational',
      ticketsCount: 0,
    },
    {
      id: 'GF-HR-01',
      type: 'office_device',
      floor: 'ground',
      floorLabel: 'الدور الأرضي',
      roomName: 'مكتب شؤون العاملين',
      location: 'الدور الأرضي - مكتب شؤون العاملين',
      status: 'operational',
      ticketsCount: 0,
    },
    {
      id: 'GF-STU-01',
      type: 'office_device',
      floor: 'ground',
      floorLabel: 'الدور الأرضي',
      roomName: 'مكتب شؤون الطلبة',
      location: 'الدور الأرضي - مكتب شؤون الطلبة',
      status: 'operational',
      ticketsCount: 0,
    },
    {
      id: 'GF-QA-01',
      type: 'office_device',
      floor: 'ground',
      floorLabel: 'الدور الأرضي',
      roomName: 'مكتب شؤون الجودة',
      location: 'الدور الأرضي - مكتب شؤون الجودة',
      status: 'operational',
      ticketsCount: 0,
    }
  );

  // 2. الدور الأول (11 جهازاً)
  // المكتب التعليمي (3)
  for (let i = 1; i <= 3; i++) {
    devices.push({
      id: `F1-EDU-${padZero(i)}`,
      type: 'office_device',
      floor: 'first',
      floorLabel: 'الدور الأول',
      roomName: 'المكتب التعليمي',
      location: 'الدور الأول - المكتب التعليمي',
      status: 'operational',
      ticketsCount: 0,
    });
  }
  // المدير الإداري (4)
  for (let i = 1; i <= 4; i++) {
    devices.push({
      id: `F1-ADM-${padZero(i)}`,
      type: 'office_device',
      floor: 'first',
      floorLabel: 'الدور الأول',
      roomName: 'مكتب المدير الإداري',
      location: 'الدور الأول - مكتب المدير الإداري',
      status: 'operational',
      ticketsCount: 0,
    });
  }
  // المدير الأكاديمي (1)
  devices.push({
    id: 'F1-ACAD-01',
    type: 'office_device',
    floor: 'first',
    floorLabel: 'الدور الأول',
    roomName: 'مكتب المدير الأكاديمي',
    location: 'الدور الأول - مكتب المدير الأكاديمي',
    status: 'operational',
    ticketsCount: 0,
  });
  // حجرة الاجتماعات (1)
  devices.push({
    id: 'F1-MEET-01',
    type: 'office_device',
    floor: 'first',
    floorLabel: 'الدور الأول',
    roomName: 'حجرة الاجتماعات',
    location: 'الدور الأول - حجرة الاجتماعات',
    status: 'operational',
    ticketsCount: 0,
  });
  // حجرة عبد الرحمن (1)
  devices.push({
    id: 'F1-ABD-01',
    type: 'office_device',
    floor: 'first',
    floorLabel: 'الدور الأول',
    roomName: 'حجرة عبد الرحمن',
    location: 'الدور الأول - حجرة عبد الرحمن',
    status: 'operational',
    ticketsCount: 0,
  });
  // ورشة المبيعات (1)
  devices.push({
    id: 'F1-SALES-01',
    type: 'office_device',
    floor: 'first',
    floorLabel: 'الدور الأول',
    roomName: 'ورشة المبيعات',
    location: 'الدور الأول - ورشة المبيعات',
    status: 'operational',
    ticketsCount: 0,
  });

  // 3. الدور الثاني (68 جهازاً)
  // معمل 1 كمبيوتر (25)
  for (let i = 1; i <= 25; i++) {
    devices.push({
      id: `PC-01-${padZero(i)}`,
      type: 'lab_pc',
      labNumber: 1,
      floor: 'second',
      floorLabel: 'الدور الثاني',
      roomName: 'معمل 1 كمبيوتر',
      location: 'معمل 1 كمبيوتر (الدور الثاني)',
      status: 'operational',
      ticketsCount: 0,
    });
  }
  // معمل اللغات (28)
  for (let i = 1; i <= 28; i++) {
    devices.push({
      id: `PC-LANG-${padZero(i)}`,
      type: 'lab_pc',
      labNumber: 2,
      floor: 'second',
      floorLabel: 'الدور الثاني',
      roomName: 'معمل اللغات',
      location: 'معمل اللغات (الدور الثاني)',
      status: 'operational',
      ticketsCount: 0,
    });
  }
  // حجرة الوسائط (1)
  devices.push({
    id: 'F2-MEDIA-01',
    type: 'office_device',
    floor: 'second',
    floorLabel: 'الدور الثاني',
    roomName: 'حجرة الوسائط',
    location: 'الدور الثاني - حجرة الوسائط',
    status: 'operational',
    ticketsCount: 0,
  });
  // مكتب التقييم والامتحانات (1)
  devices.push({
    id: 'F2-EXAM-01',
    type: 'office_device',
    floor: 'second',
    floorLabel: 'الدور الثاني',
    roomName: 'مكتب التقييم والامتحانات',
    location: 'الدور الثاني - مكتب التقييم والامتحانات',
    status: 'operational',
    ticketsCount: 0,
  });
  // حجرة المدرسين (8)
  for (let i = 1; i <= 8; i++) {
    devices.push({
      id: `TR-PC-${padZero(i)}`,
      type: 'teachers_room_pc',
      floor: 'second',
      floorLabel: 'الدور الثاني',
      roomName: 'حجرة المدرسين',
      location: 'الدور الثاني - حجرة المدرسين',
      status: 'operational',
      ticketsCount: 0,
    });
  }
  // فصول C (5 أجهزة: فصل C1 جهازين، C2 جهازين، C3 جهاز)
  devices.push(
    {
      id: 'CLS-C1-01',
      type: 'classroom_equipment',
      floor: 'second',
      floorLabel: 'الدور الثاني',
      roomName: 'فصل C1',
      location: 'الدور الثاني - فصل C1',
      status: 'operational',
      ticketsCount: 0,
    },
    {
      id: 'CLS-C1-02',
      type: 'classroom_equipment',
      floor: 'second',
      floorLabel: 'الدور الثاني',
      roomName: 'فصل C1',
      location: 'الدور الثاني - فصل C1',
      status: 'operational',
      ticketsCount: 0,
    },
    {
      id: 'CLS-C2-01',
      type: 'classroom_equipment',
      floor: 'second',
      floorLabel: 'الدور الثاني',
      roomName: 'فصل C2',
      location: 'الدور الثاني - فصل C2',
      status: 'operational',
      ticketsCount: 0,
    },
    {
      id: 'CLS-C2-02',
      type: 'classroom_equipment',
      floor: 'second',
      floorLabel: 'الدور الثاني',
      roomName: 'فصل C2',
      location: 'الدور الثاني - فصل C2',
      status: 'operational',
      ticketsCount: 0,
    },
    {
      id: 'CLS-C3-01',
      type: 'classroom_equipment',
      floor: 'second',
      floorLabel: 'الدور الثاني',
      roomName: 'فصل C3',
      location: 'الدور الثاني - فصل C3',
      status: 'operational',
      ticketsCount: 0,
    }
  );

  // 4. الدور الثالث (معمل 3: 25 جهازاً)
  for (let i = 1; i <= 25; i++) {
    devices.push({
      id: `PC-03-${padZero(i)}`,
      type: 'lab_pc',
      labNumber: 3,
      floor: 'third',
      floorLabel: 'الدور الثالث',
      roomName: 'معمل 3 كمبيوتر',
      location: 'معمل 3 كمبيوتر (الدور الثالث)',
      status: 'operational',
      ticketsCount: 0,
    });
  }

  // 5. الدور الرابع (معمل 4: 25 جهازاً)
  for (let i = 1; i <= 25; i++) {
    devices.push({
      id: `PC-04-${padZero(i)}`,
      type: 'lab_pc',
      labNumber: 4,
      floor: 'fourth',
      floorLabel: 'الدور الرابع',
      roomName: 'معمل 4 كمبيوتر',
      location: 'معمل 4 كمبيوتر (الدور الرابع)',
      status: 'operational',
      ticketsCount: 0,
    });
  }

  return devices;
};

