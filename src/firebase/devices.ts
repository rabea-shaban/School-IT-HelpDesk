import { Device, DeviceHistoryItem } from '../types/device';
import { generateAllDevices } from '../utils/deviceGenerator';
import { getTickets, subscribeToTickets } from './tickets';

/**
 * Real-time subscription to Devices computed from live Firestore tickets
 */
export const subscribeToDevices = (
  callback: (devices: Device[]) => void,
  labNumber?: number
) => {
  return subscribeToTickets(liveTickets => {
    const baseDevices = generateAllDevices();
    const computedDevices = baseDevices.map(device => {
      const devTickets = liveTickets.filter(t => t.deviceId === device.id);
      const hasActiveIssue = devTickets.some(
        t => t.status === 'new' || t.status === 'in-progress'
      );
      const lastTicket = devTickets.length > 0 ? devTickets[0] : undefined;

      return {
        ...device,
        ticketsCount: devTickets.length,
        status: hasActiveIssue ? ('has_issue' as const) : ('operational' as const),
        lastProblem: lastTicket ? lastTicket.problemType : undefined,
        lastTicketId: lastTicket ? lastTicket.id : undefined,
        lastTicketDate: lastTicket ? lastTicket.createdAt : undefined,
      };
    });

    if (typeof labNumber === 'number') {
      callback(computedDevices.filter(d => d.labNumber === labNumber));
    } else {
      callback(computedDevices);
    }
  });
};

/**
 * Get all devices with live computed stats from live Firestore tickets
 */
export const getDevices = async (labNumber?: number): Promise<Device[]> => {
  const baseDevices = generateAllDevices();
  const tickets = await getTickets();

  const computedDevices = baseDevices.map(device => {
    const devTickets = tickets.filter(t => t.deviceId === device.id);
    const hasActiveIssue = devTickets.some(
      t => t.status === 'new' || t.status === 'in-progress'
    );
    const lastTicket = devTickets.length > 0 ? devTickets[0] : undefined;

    return {
      ...device,
      ticketsCount: devTickets.length,
      status: hasActiveIssue ? ('has_issue' as const) : ('operational' as const),
      lastProblem: lastTicket ? lastTicket.problemType : undefined,
      lastTicketId: lastTicket ? lastTicket.id : undefined,
      lastTicketDate: lastTicket ? lastTicket.createdAt : undefined,
    };
  });

  if (typeof labNumber === 'number') {
    return computedDevices.filter(d => d.labNumber === labNumber);
  }

  return computedDevices;
};

/**
 * Get device by ID
 */
export const getDeviceById = async (deviceId: string): Promise<Device | null> => {
  const allDevices = await getDevices();
  return allDevices.find(d => d.id.toLowerCase() === deviceId.toLowerCase()) || null;
};

/**
 * Get full ticket history for a specific device directly from Firestore
 */
export const getDeviceHistory = async (deviceId: string): Promise<DeviceHistoryItem[]> => {
  const tickets = await getTickets();
  const matchedTickets = tickets
    .filter(t => t.deviceId && t.deviceId.toLowerCase() === deviceId.toLowerCase())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return matchedTickets.map(t => ({
    ticketId: t.id,
    ticketNumber: t.ticketNumber,
    problemType: t.problemType,
    problemDescription: t.problemDescription,
    requestedAction: t.requestedAction,
    priority: t.priority,
    status: t.status,
    requesterName: t.name,
    createdAt: t.createdAt,
    resolvedAt: t.resolvedAt,
    resolvedBy: t.resolvedBy,
    resolutionNote: t.resolutionNote,
  }));
};
