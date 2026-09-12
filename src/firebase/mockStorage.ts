import { Ticket } from '../types/ticket';
import { Device } from '../types/device';
import { generateAllDevices, generateAllLabs } from '../utils/deviceGenerator';

const STORAGE_KEYS = {
  TICKETS: 'school_it_tickets_v2',
  DEVICES: 'school_it_devices_v2',
  LABS: 'school_it_labs_v2',
  AUTH_USER: 'school_it_auth_user',
};

// Initial Seed Tickets based on real school structure
const INITIAL_TICKETS: Ticket[] = [
  {
    id: 't-125',
    ticketNumber: 'IT-2026-000125',
    name: 'Ahmed Mohamed',
    jobTitle: 'Teacher',
    department: 'Science',
    locationType: 'lab',
    floor: 'second',
    roomName: 'معمل 1 كمبيوتر',
    labNumber: 1,
    deviceId: 'PC-01-18',
    problemType: 'Computer Not Working',
    problemDescription: 'The computer does not turn on at all. Power button does not light up.',
    requestedAction: 'Please check and repair the computer before period 3.',
    priority: 'high',
    status: 'new',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    resolvedAt: null,
    resolvedBy: null,
    resolutionNote: '',
  },
  {
    id: 't-124',
    ticketNumber: 'IT-2026-000124',
    name: 'Sara Ibrahim',
    jobTitle: 'Teacher',
    department: 'English Department',
    locationType: 'teachers_room',
    floor: 'second',
    roomName: 'حجرة المدرسين',
    deviceId: 'TR-PC-02',
    problemType: 'Windows Installation / Reinstallation',
    problemDescription: 'The PC is extremely slow and showing blue screen errors on boot.',
    requestedAction: 'Needs fresh Windows 11 installation and Office 365 setup.',
    priority: 'medium',
    status: 'in-progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    resolvedAt: null,
    resolvedBy: 'it-admin@school.edu',
    resolutionNote: '',
  },
  {
    id: 't-123',
    ticketNumber: 'IT-2026-000123',
    name: 'Mahmoud Hassan',
    jobTitle: 'Teacher',
    department: 'English Department',
    locationType: 'lab',
    floor: 'second',
    roomName: 'معمل اللغات',
    labNumber: 2,
    deviceId: 'PC-LANG-14',
    problemType: 'Network / Internet Problem',
    problemDescription: 'No internet access on this language lab workstation.',
    requestedAction: 'Re-crimp or replace the Ethernet patch cord.',
    priority: 'urgent',
    status: 'resolved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    resolvedBy: 'it-admin@school.edu',
    resolutionNote: 'Replaced damaged RJ45 connector and verified gigabit link speed.',
  },
  {
    id: 't-122',
    ticketNumber: 'IT-2026-000122',
    name: 'Khaled Omar',
    jobTitle: 'Accountant',
    department: 'Accounting',
    locationType: 'office',
    floor: 'first',
    roomName: 'مكتب المدير الإداري',
    deviceId: 'F1-ADM-01',
    problemType: 'Printer Problem',
    problemDescription: 'HP LaserJet printer is showing paper jam error even though paper tray is clear.',
    requestedAction: 'Please inspect roller sensor and test print sample invoice.',
    priority: 'high',
    status: 'resolved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    resolvedBy: 'it-admin@school.edu',
    resolutionNote: 'Cleared stuck piece of paper in duplexer and updated printer firmware.',
  },
  {
    id: 't-121',
    ticketNumber: 'IT-2026-000121',
    name: 'Youssef Adel',
    jobTitle: 'Teacher',
    department: 'Science',
    locationType: 'lab',
    floor: 'third',
    roomName: 'معمل 3 كمبيوتر',
    labNumber: 3,
    deviceId: 'PC-03-12',
    problemType: 'Software Problem',
    problemDescription: 'PhET Science simulation software missing from desktop.',
    requestedAction: 'Install science simulation suite on PC-03-12.',
    priority: 'low',
    status: 'resolved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 90).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 90).toISOString(),
    resolvedBy: 'it-admin@school.edu',
    resolutionNote: 'Installed latest PhET desktop packages and verified shortcut icon.',
  },
  {
    id: 't-120',
    ticketNumber: 'IT-2026-000120',
    name: 'Mona Salem',
    jobTitle: 'Administrator',
    department: 'Administration',
    locationType: 'classroom',
    floor: 'second',
    roomName: 'فصل C1',
    classroomName: 'فصل C1',
    problemType: 'Device Setup / Configuration',
    problemDescription: 'Interactive smart screen HDMI audio is not playing through classroom speakers.',
    requestedAction: 'Configure default audio output to external amplifier.',
    priority: 'medium',
    status: 'closed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 110).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 110).toISOString(),
    resolvedBy: 'it-admin@school.edu',
    resolutionNote: 'Updated sound playback device to Realtek Audio output.',
  }
];

export const getStoredTickets = (): Ticket[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TICKETS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TICKETS;
  }
};

export const saveStoredTickets = (tickets: Ticket[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  } catch (err) {
    console.error('Failed to save tickets in local storage', err);
  }
};

export const getStoredDevices = (): Device[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEVICES);
    if (!raw) {
      const generated = generateAllDevices();
      // Sync initial ticket counts to devices
      const tickets = getStoredTickets();
      tickets.forEach(ticket => {
        if (ticket.deviceId) {
          const dev = generated.find(d => d.id === ticket.deviceId);
          if (dev) {
            dev.ticketsCount += 1;
            dev.lastProblem = ticket.problemType;
            dev.lastTicketId = ticket.id;
            dev.lastTicketDate = ticket.createdAt;
            if (ticket.status === 'new' || ticket.status === 'in-progress') {
              dev.status = 'has_issue';
            }
          }
        }
      });
      localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(generated));
      return generated;
    }
    return JSON.parse(raw);
  } catch {
    return generateAllDevices();
  }
};

export const saveStoredDevices = (devices: Device[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices));
  } catch (err) {
    console.error('Failed to save devices in local storage', err);
  }
};

export const getStoredLabs = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LABS);
    if (!raw) {
      const labs = generateAllLabs();
      localStorage.setItem(STORAGE_KEYS.LABS, JSON.stringify(labs));
      return labs;
    }
    return JSON.parse(raw);
  } catch {
    return generateAllLabs();
  }
};
