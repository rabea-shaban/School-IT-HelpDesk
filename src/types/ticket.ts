export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketStatus = 'new' | 'in-progress' | 'resolved' | 'closed';

export type LocationType = 'classroom' | 'lab' | 'teachers_room' | 'office' | 'other';

export interface Ticket {
  id: string; // Document ID (e.g. Firestore ID or generated ID)
  ticketNumber: string; // e.g. "IT-2026-000125"
  name: string;
  jobTitle: string;
  jobTitleCustom?: string;
  department: string;
  departmentCustom?: string;
  locationType: LocationType;
  floor?: string; // e.g. "ground", "first", "second", "third", "fourth"
  roomName?: string; // e.g. "مكتب شؤون الطلبة", "معمل اللغات"
  classroomName?: string;
  labNumber?: number; // 1 to 4
  deviceId?: string; // e.g. "PC-L01-05" or "TR-PC-02"
  customLocation?: string;
  problemType: string;
  problemDescription: string;
  requestedAction: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string; // ISO String format
  updatedAt: string; // ISO String format
  resolvedAt: string | null;
  resolvedBy: string | null;
  resolutionNote: string;
}

export type TicketFormData = {
  name: string;
  jobTitle: string;
  jobTitleCustom?: string;
  department: string;
  departmentCustom?: string;
  locationType: LocationType;
  floor?: string;
  roomName?: string;
  classroomName?: string;
  labNumber?: number | '';
  deviceId?: string;
  customLocation?: string;
  problemType: string;
  problemDescription: string;
  requestedAction: string;
  priority: TicketPriority;
};
