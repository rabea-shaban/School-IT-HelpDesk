import { Lab, LabStats } from '../types/lab';
import { generateAllLabs } from '../utils/deviceGenerator';
import { getTickets, subscribeToTickets } from './tickets';
import { TOTAL_LABS_COUNT } from '../utils/constants';

/**
 * Real-time subscription to Labs computed from live Firestore tickets
 */
export const subscribeToLabs = (callback: (labs: Lab[]) => void) => {
  return subscribeToTickets(liveTickets => {
    const baseLabs = generateAllLabs();
    const computed = baseLabs.map(lab => {
      const labTickets = liveTickets.filter(t => t.labNumber === lab.labNumber);
      const activeTickets = labTickets.filter(
        t => t.status === 'new' || t.status === 'in-progress'
      );
      const resolvedTickets = labTickets.filter(
        t => t.status === 'resolved' || t.status === 'closed'
      );

      const activeDeviceIds = new Set(activeTickets.map(t => t.deviceId).filter(Boolean));
      const issueDevices = activeDeviceIds.size;
      const operationalDevices = Math.max(0, lab.totalDevices - issueDevices);

      return {
        ...lab,
        totalTickets: labTickets.length,
        activeTickets: activeTickets.length,
        resolvedTickets: resolvedTickets.length,
        issueDevices,
        operationalDevices,
      };
    });

    callback(computed);
  });
};

/**
 * Get all 4 Labs with live calculated ticket metrics from Firestore
 */
export const getLabs = async (): Promise<Lab[]> => {
  const baseLabs = generateAllLabs();
  const tickets = await getTickets();

  return baseLabs.map(lab => {
    const labTickets = tickets.filter(t => t.labNumber === lab.labNumber);
    const activeTickets = labTickets.filter(
      t => t.status === 'new' || t.status === 'in-progress'
    );
    const resolvedTickets = labTickets.filter(
      t => t.status === 'resolved' || t.status === 'closed'
    );

    const activeDeviceIds = new Set(activeTickets.map(t => t.deviceId).filter(Boolean));
    const issueDevices = activeDeviceIds.size;
    const operationalDevices = Math.max(0, lab.totalDevices - issueDevices);

    return {
      ...lab,
      totalTickets: labTickets.length,
      activeTickets: activeTickets.length,
      resolvedTickets: resolvedTickets.length,
      issueDevices,
      operationalDevices,
    };
  });
};

/**
 * Get aggregate Lab statistics
 */
export const getLabStats = async (): Promise<LabStats> => {
  const labs = await getLabs();
  let totalOpenTickets = 0;
  let highestTickets = -1;
  let mostProblematic: { labNumber: number; name: string; ticketsCount: number } | null = null;

  labs.forEach(lab => {
    totalOpenTickets += lab.activeTickets;
    if (lab.totalTickets > highestTickets && lab.totalTickets > 0) {
      highestTickets = lab.totalTickets;
      mostProblematic = {
        labNumber: lab.labNumber,
        name: lab.name,
        ticketsCount: lab.totalTickets,
      };
    }
  });

  return {
    totalLabs: TOTAL_LABS_COUNT,
    totalLabDevices: labs.reduce((sum, lab) => sum + lab.totalDevices, 0),
    totalOpenTickets,
    mostProblematicLab: mostProblematic,
  };
};
