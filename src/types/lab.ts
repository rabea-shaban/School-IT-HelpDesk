export interface Lab {
  labNumber: number; // 1 to 4
  name: string; // e.g. "Lab 01 (Computer)", "Language Lab"
  nameAr?: string; // "معمل 1 كمبيوتر", "معمل اللغات"
  nameEn?: string; // "Lab 01 (Computer)", "Language Lab"
  floor?: string; // "Second Floor", "Third Floor", "Fourth Floor"
  totalDevices: number; // 25 or 28
  operationalDevices: number;
  issueDevices: number;
  totalTickets: number;
  activeTickets: number; // new or in-progress
  resolvedTickets: number;
  devices: string[]; // e.g. ["PC-L01-01", ... "PC-L01-25"]
}

export interface LabStats {
  totalLabs: number;
  totalLabDevices: number;
  totalOpenTickets: number;
  mostProblematicLab: {
    labNumber: number;
    name: string;
    ticketsCount: number;
  } | null;
}
