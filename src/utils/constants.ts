export const JOB_TITLES = [
  'Teacher',
  'Supervisor',
  'Accountant',
  'Administrator',
  'Employee',
  'IT',
  'Other'
] as const;

export const DEPARTMENTS = [
  'English Department',
  'Arabic Department',
  'Mathematics',
  'Science',
  'Administration',
  'HR',
  'Accounting',
  'Social Service',
  'Quality Assurance',
  'Other'
] as const;

export interface LocationTypeConfig {
  id: 'lab' | 'teachers_room' | 'classroom' | 'office' | 'other';
  labelEn: string;
  labelAr: string;
  descriptionEn: string;
  descriptionAr: string;
}

export const LOCATION_TYPES: LocationTypeConfig[] = [
  { id: 'lab', labelEn: 'Computer Lab', labelAr: 'معمل الحاسب الآلي', descriptionEn: 'One of the 4 school computer labs', descriptionAr: 'أحد معامل الحاسب واللغات الأربعة بالمدرسة' },
  { id: 'teachers_room', labelEn: 'Teachers Room', labelAr: 'غرفة المعلمين والمدرسين', descriptionEn: 'Staff & Teachers workstations', descriptionAr: 'محطات عمل وأجهزة المعلمين والمشرفين' },
  { id: 'classroom', labelEn: 'Classroom', labelAr: 'الفصل الدراسي', descriptionEn: 'Classroom smart board or workstation', descriptionAr: 'الشاشة التفاعلية أو كمبيوتر الفصل' },
  { id: 'office', labelEn: 'Office', labelAr: 'مكتب إداري', descriptionEn: 'Administration & management offices', descriptionAr: 'المكاتب الإدارية وإدارة المدرسة' },
  { id: 'other', labelEn: 'Other Location', labelAr: 'مكان آخر', descriptionEn: 'Library, hall, clinic, playground, etc.', descriptionAr: 'المكتبة، القاعة، العيادة، المسرح، وغيرها' },
];

export const PROBLEM_TYPES = [
  'Computer Not Working',
  'Computer Suddenly Shut Down',
  'Windows Installation / Reinstallation',
  'Network / Internet Problem',
  'Software Problem',
  'Hardware Problem',
  'Printer Problem',
  'Device Setup / Configuration',
  'Smart Board / Projector',
  'Account / Password Problem',
  'Other'
] as const;

export const PRIORITIES = [
  { id: 'low', label: 'Low', color: 'slate', description: 'Can wait, minor or non-blocking' },
  { id: 'medium', label: 'Medium', color: 'blue', description: 'Standard priority request' },
  { id: 'high', label: 'High', color: 'amber', description: 'Urgent attention needed for class' },
  { id: 'urgent', label: 'Urgent', color: 'rose', description: 'Critical classroom/exam stoppage' },
] as const;

export const TOTAL_LABS_COUNT = 4;
export const TOTAL_SCHOOL_DEVICES_COUNT = 133;
export const DEFAULT_DEVICES_PER_LAB = 25;
export const LANGUAGE_LAB_DEVICES_COUNT = 28;
export const TEACHERS_ROOM_DEVICES_COUNT = 8;

export interface SchoolFloorConfig {
  id: 'ground' | 'first' | 'second' | 'third' | 'fourth' | 'other';
  labelEn: string;
  labelAr: string;
  description: string;
  descriptionEn?: string;
  devicesCount: number;
}

export const SCHOOL_FLOORS: SchoolFloorConfig[] = [
  {
    id: 'ground',
    labelEn: 'Ground Floor',
    labelAr: 'الدور الأرضي',
    description: 'مكاتب شؤون الطلاب، العاملين، الجودة، والأخصائية الاجتماعية (4 أجهزة)',
    descriptionEn: 'Student Affairs, Staff Affairs, Quality Assurance, Social Worker offices (4 PCs)',
    devicesCount: 4,
  },
  {
    id: 'first',
    labelEn: 'First Floor',
    labelAr: 'الدور الأول',
    description: 'المكتب التعليمي، المدير الإداري، الأكاديمي، والورش (11 جهازاً)',
    descriptionEn: 'Educational Office, Admin & Academic Directors, Meeting Room, Workshops (11 PCs)',
    devicesCount: 11,
  },
  {
    id: 'second',
    labelEn: 'Second Floor',
    labelAr: 'الدور الثاني',
    description: 'معمل 1 كمبيوتر (25)، معمل اللغات (28)، غرفة المدرسين (8)، وفصول C (68 جهازاً)',
    descriptionEn: 'Computer Lab 1 (25), Language Lab (28), Teachers Room (8), C Classrooms (68 PCs)',
    devicesCount: 68,
  },
  {
    id: 'third',
    labelEn: 'Third Floor',
    labelAr: 'الدور الثالث',
    description: 'معمل 3 كمبيوتر (25)، العيادة، وفصول A و B (25 جهازاً)',
    descriptionEn: 'Computer Lab 3 (25), Clinic, A & B Classrooms (25 PCs)',
    devicesCount: 25,
  },
  {
    id: 'fourth',
    labelEn: 'Fourth Floor',
    labelAr: 'الدور الرابع',
    description: 'معمل 4 كمبيوتر (25 جهازاً)',
    descriptionEn: 'Computer Lab 4 (25 PCs)',
    devicesCount: 25,
  },
  {
    id: 'other',
    labelEn: 'Other Locations',
    labelAr: 'أماكن أخرى',
    description: 'أي مكان أو قاعة إضافية بالمدرسة',
    descriptionEn: 'Any other school location or facility',
    devicesCount: 0,
  },
];

export interface SchoolRoomConfig {
  id: string;
  floor: 'ground' | 'first' | 'second' | 'third' | 'fourth' | 'other';
  nameEn: string;
  nameAr: string;
  type: 'office' | 'lab' | 'teachers_room' | 'classroom' | 'other';
  labNumber?: number;
  devicesCount: number;
  devicePrefix?: string;
}

export const SCHOOL_ROOMS: SchoolRoomConfig[] = [
  // --- الدور الأرضي (4 أجهزة) ---
  {
    id: 'gf-social',
    floor: 'ground',
    nameEn: 'Social Worker Office',
    nameAr: 'مكتب الأخصائية الاجتماعية',
    type: 'office',
    devicesCount: 1,
    devicePrefix: 'GF-SOC',
  },
  {
    id: 'gf-hr',
    floor: 'ground',
    nameEn: 'Personnel / HR Office',
    nameAr: 'مكتب شؤون العاملين',
    type: 'office',
    devicesCount: 1,
    devicePrefix: 'GF-HR',
  },
  {
    id: 'gf-students',
    floor: 'ground',
    nameEn: 'Student Affairs Office',
    nameAr: 'مكتب شؤون الطلبة',
    type: 'office',
    devicesCount: 1,
    devicePrefix: 'GF-STU',
  },
  {
    id: 'gf-quality',
    floor: 'ground',
    nameEn: 'Quality Assurance Office',
    nameAr: 'مكتب شؤون الجودة',
    type: 'office',
    devicesCount: 1,
    devicePrefix: 'GF-QA',
  },

  // --- الدور الأول (11 جهاز) ---
  {
    id: 'f1-edu',
    floor: 'first',
    nameEn: 'Educational Office',
    nameAr: 'المكتب التعليمي',
    type: 'office',
    devicesCount: 3,
    devicePrefix: 'F1-EDU',
  },
  {
    id: 'f1-admin-mgr',
    floor: 'first',
    nameEn: 'Administrative Director Office',
    nameAr: 'مكتب المدير الإداري',
    type: 'office',
    devicesCount: 4,
    devicePrefix: 'F1-ADM',
  },
  {
    id: 'f1-acad-mgr',
    floor: 'first',
    nameEn: 'Academic Director Office',
    nameAr: 'مكتب المدير الأكاديمي',
    type: 'office',
    devicesCount: 1,
    devicePrefix: 'F1-ACAD',
  },
  {
    id: 'f1-meeting',
    floor: 'first',
    nameEn: 'Meeting Room',
    nameAr: 'حجرة الاجتماعات',
    type: 'office',
    devicesCount: 1,
    devicePrefix: 'F1-MEET',
  },
  {
    id: 'f1-abdelrahman',
    floor: 'first',
    nameEn: 'Abdelrahman Room',
    nameAr: 'حجرة عبد الرحمن',
    type: 'office',
    devicesCount: 1,
    devicePrefix: 'F1-ABD',
  },
  {
    id: 'f1-sales',
    floor: 'first',
    nameEn: 'Sales Workshop',
    nameAr: 'ورشة المبيعات',
    type: 'office',
    devicesCount: 1,
    devicePrefix: 'F1-SALES',
  },
  {
    id: 'f1-stores',
    floor: 'first',
    nameEn: 'Stores / Warehouse Workshop',
    nameAr: 'ورشة المخازن',
    type: 'office',
    devicesCount: 0,
    devicePrefix: 'F1-STR',
  },

  // --- الدور الثاني (68 جهاز) ---
  {
    id: 'f2-lab1',
    floor: 'second',
    nameEn: 'Computer Lab 01',
    nameAr: 'معمل 1 كمبيوتر',
    type: 'lab',
    labNumber: 1,
    devicesCount: 25,
    devicePrefix: 'PC-01',
  },
  {
    id: 'f2-lang-lab',
    floor: 'second',
    nameEn: 'Language Lab',
    nameAr: 'معمل اللغات',
    type: 'lab',
    labNumber: 2,
    devicesCount: 28,
    devicePrefix: 'PC-LANG',
  },
  {
    id: 'f2-multimedia',
    floor: 'second',
    nameEn: 'Multimedia Room',
    nameAr: 'حجرة الوسائط',
    type: 'office',
    devicesCount: 1,
    devicePrefix: 'F2-MEDIA',
  },
  {
    id: 'f2-exams',
    floor: 'second',
    nameEn: 'Assessment & Exams Office',
    nameAr: 'مكتب التقييم والامتحانات',
    type: 'office',
    devicesCount: 1,
    devicePrefix: 'F2-EXAM',
  },
  {
    id: 'f2-teachers',
    floor: 'second',
    nameEn: 'Teachers Room',
    nameAr: 'حجرة المدرسين',
    type: 'teachers_room',
    devicesCount: 8,
    devicePrefix: 'TR-PC',
  },
  {
    id: 'f2-class-c1',
    floor: 'second',
    nameEn: 'Classroom C1',
    nameAr: 'فصل C1',
    type: 'classroom',
    devicesCount: 2,
    devicePrefix: 'CLS-C1',
  },
  {
    id: 'f2-class-c2',
    floor: 'second',
    nameEn: 'Classroom C2',
    nameAr: 'فصل C2',
    type: 'classroom',
    devicesCount: 2,
    devicePrefix: 'CLS-C2',
  },
  {
    id: 'f2-class-c3',
    floor: 'second',
    nameEn: 'Classroom C3',
    nameAr: 'فصل C3',
    type: 'classroom',
    devicesCount: 1,
    devicePrefix: 'CLS-C3',
  },

  // --- الدور الثالث (25 جهاز) ---
  {
    id: 'f3-lab3',
    floor: 'third',
    nameEn: 'Computer Lab 03',
    nameAr: 'معمل 3 كمبيوتر',
    type: 'lab',
    labNumber: 3,
    devicesCount: 25,
    devicePrefix: 'PC-03',
  },
  {
    id: 'f3-clinic',
    floor: 'third',
    nameEn: 'School Clinic',
    nameAr: 'العيادة',
    type: 'office',
    devicesCount: 0,
    devicePrefix: 'F3-CLN',
  },
  {
    id: 'f3-classes-a',
    floor: 'third',
    nameEn: 'Classrooms A (A1-A4)',
    nameAr: 'فصول أ (A1 إلى A4)',
    type: 'classroom',
    devicesCount: 0,
    devicePrefix: 'CLS-A',
  },
  {
    id: 'f3-classes-b',
    floor: 'third',
    nameEn: 'Classrooms B (B1-B3)',
    nameAr: 'فصول ب (B1 إلى B3)',
    type: 'classroom',
    devicesCount: 0,
    devicePrefix: 'CLS-B',
  },

  // --- الدور الرابع (25 جهاز) ---
  {
    id: 'f4-lab4',
    floor: 'fourth',
    nameEn: 'Computer Lab 04',
    nameAr: 'معمل 4 كمبيوتر',
    type: 'lab',
    labNumber: 4,
    devicesCount: 25,
    devicePrefix: 'PC-04',
  },
];

export const getLabDeviceCount = (labNumber: number): number => {
  if (labNumber === 2) return LANGUAGE_LAB_DEVICES_COUNT;
  return DEFAULT_DEVICES_PER_LAB;
};

export const getLabName = (labNumber: number, isEn = false): string => {
  if (isEn) {
    switch (labNumber) {
      case 1:
        return 'Computer Lab 01';
      case 2:
        return 'Language Lab';
      case 3:
        return 'Computer Lab 03';
      case 4:
        return 'Computer Lab 04';
      default:
        return `Computer Lab ${labNumber}`;
    }
  }
  switch (labNumber) {
    case 1:
      return 'معمل 1 كمبيوتر';
    case 2:
      return 'معمل اللغات';
    case 3:
      return 'معمل 3 كمبيوتر';
    case 4:
      return 'معمل 4 كمبيوتر';
    default:
      return `معمل ${labNumber}`;
  }
};

export const getLabShortName = (labNumber: number): string => {
  switch (labNumber) {
    case 1:
      return 'معمل 1';
    case 2:
      return 'معمل اللغات';
    case 3:
      return 'معمل 3';
    case 4:
      return 'معمل 4';
    default:
      return `معمل ${labNumber}`;
  }
};

