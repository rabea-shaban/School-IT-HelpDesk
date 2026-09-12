export type DeviceStatus = 'operational' | 'has_issue' | 'under_maintenance';

export type SchoolFloor = 'ground' | 'first' | 'second' | 'third' | 'fourth' | 'other';

export interface Device {
  id: string; // e.g. "PC-L01-01", "PC-LANG-12", "TR-PC-05", "GF-SOC-01"
  name?: string;
  type: 'lab_pc' | 'teachers_room_pc' | 'classroom_equipment' | 'office_device' | 'other';
  floor?: SchoolFloor;
  floorLabel?: string;
  roomName?: string;
  labNumber?: number; // 1 to 4
  location: string; // e.g. "معمل 1 كمبيوتر", "مكتب المدير الإداري", "حجرة المدرسين"
  status: DeviceStatus;
  ticketsCount: number;
  lastProblem?: string;
  lastTicketId?: string;
  lastTicketDate?: string;
}

export interface DeviceHistoryItem {
  ticketId: string;
  ticketNumber: string;
  problemType: string;
  problemDescription: string;
  requestedAction: string;
  priority: string;
  status: string;
  requesterName: string;
  createdAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
  resolutionNote?: string;
}
