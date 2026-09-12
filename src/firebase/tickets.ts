import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { Ticket, TicketFormData, TicketStatus } from '../types/ticket';
import { generateTicketNumber } from '../utils/generateTicketNumber';
import { getStoredTickets, saveStoredTickets } from './mockStorage';

const COLLECTION_NAME = 'tickets';

const notifyLocalChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('school_tickets_changed'));
  }
};

/**
 * Real-time subscription to all tickets in Firestore / MockStorage
 */
export const subscribeToTickets = (callback: (tickets: Ticket[]) => void) => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        snapshot => {
          const liveTickets: Ticket[] = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data();
            liveTickets.push({
              id: docSnap.id,
              ...data,
            } as Ticket);
          });
          callback(liveTickets);
        },
        error => {
          console.warn('Firestore tickets subscription fallback:', error);
          callback(getStoredTickets());
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn('Firestore subscription error:', err);
    }
  }

  // Local reactive subscription for Mock mode
  callback(getStoredTickets());

  const handleUpdate = () => {
    callback(getStoredTickets());
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('school_tickets_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('school_tickets_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    }
  };
};

/**
 * Submit a new IT Ticket to Firestore / LocalStorage
 */
export const createTicket = async (data: TicketFormData): Promise<Ticket> => {
  const currentTickets = await getTickets();
  const nextSeq = currentTickets.length + 101;
  const ticketNumber = generateTicketNumber(nextSeq);
  const now = new Date().toISOString();

  // Create doc reference
  const docRef =
    isFirebaseConfigured && db
      ? doc(collection(db, COLLECTION_NAME))
      : { id: `ticket_${Date.now()}` };

  const cleanLabNumber =
    data.locationType === 'lab' && data.labNumber && Number(data.labNumber) > 0
      ? Number(data.labNumber)
      : null;

  const newTicket: Ticket = {
    id: docRef.id,
    ticketNumber,
    name: data.name.trim(),
    jobTitle: data.jobTitle === 'Other' ? (data.jobTitleCustom || 'Other') : data.jobTitle,
    jobTitleCustom: data.jobTitleCustom || '',
    department:
      data.department === 'Other' ? (data.departmentCustom || 'Other') : data.department,
    departmentCustom: data.departmentCustom || '',
    locationType: data.locationType,
    floor: data.floor || '',
    roomName: data.roomName || '',
    classroomName: data.classroomName || '',
    labNumber: cleanLabNumber === null ? undefined : cleanLabNumber,
    deviceId: data.deviceId ? data.deviceId.trim() : '',
    customLocation: data.customLocation || '',
    problemType: data.problemType,
    problemDescription: data.problemDescription.trim(),
    requestedAction: data.requestedAction.trim(),
    priority: data.priority,
    status: 'new',
    createdAt: now,
    updatedAt: now,
    resolvedAt: null,
    resolvedBy: null,
    resolutionNote: '',
  };

  if (isFirebaseConfigured && db) {
    try {
      const docPayload: Record<string, any> = {
        id: newTicket.id,
        ticketNumber: newTicket.ticketNumber,
        name: newTicket.name,
        jobTitle: newTicket.jobTitle,
        jobTitleCustom: newTicket.jobTitleCustom,
        department: newTicket.department,
        departmentCustom: newTicket.departmentCustom,
        locationType: newTicket.locationType,
        floor: newTicket.floor || '',
        roomName: newTicket.roomName || '',
        classroomName: newTicket.classroomName,
        labNumber: cleanLabNumber,
        deviceId: newTicket.deviceId || '',
        customLocation: newTicket.customLocation,
        problemType: newTicket.problemType,
        problemDescription: newTicket.problemDescription,
        requestedAction: newTicket.requestedAction,
        priority: newTicket.priority,
        status: newTicket.status,
        createdAt: newTicket.createdAt,
        updatedAt: newTicket.updatedAt,
        resolvedAt: null,
        resolvedBy: null,
        resolutionNote: '',
        firestoreTimestamp: serverTimestamp(),
      };

      // Strip any accidental undefined fields
      Object.keys(docPayload).forEach(key => {
        if (docPayload[key] === undefined) {
          delete docPayload[key];
        }
      });

      await setDoc(doc(db, COLLECTION_NAME, newTicket.id), docPayload);
    } catch (err) {
      console.error('Firestore save error:', err);
      throw err;
    }
  }

  // Also maintain local storage copy
  const stored = getStoredTickets();
  saveStoredTickets([newTicket, ...stored.filter(t => t.id !== newTicket.id)]);
  notifyLocalChange();

  return newTicket;
};

/**
 * Get all tickets from Firestore or fallback to LocalStorage
 */
export const getTickets = async (): Promise<Ticket[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const firestoreTickets: Ticket[] = [];
      snapshot.forEach(docSnap => {
        firestoreTickets.push({ id: docSnap.id, ...docSnap.data() } as Ticket);
      });
      return firestoreTickets;
    } catch (err) {
      console.warn('Firestore fetch tickets warning:', err);
    }
  }

  return getStoredTickets();
};

/**
 * Get single ticket by ID
 */
export const getTicketById = async (id: string): Promise<Ticket | null> => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Ticket;
      }
    } catch (err) {
      console.warn('Firestore fetch ticket by ID warning:', err);
    }
  }

  const all = await getTickets();
  return all.find(t => t.id === id || t.ticketNumber === id) || null;
};

/**
 * Update ticket status (e.g. 'in-progress', 'closed')
 */
export const updateTicketStatus = async (
  ticketId: string,
  status: TicketStatus,
  adminUser?: string
): Promise<Ticket> => {
  const now = new Date().toISOString();
  const updates: Partial<Ticket> = {
    status,
    updatedAt: now,
  };

  if (status === 'in-progress' && adminUser) {
    updates.resolvedBy = adminUser;
  }

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, COLLECTION_NAME, ticketId);
    await updateDoc(docRef, updates);
  }

  // Update local storage copy
  const stored = getStoredTickets();
  const index = stored.findIndex(t => t.id === ticketId);
  if (index !== -1) {
    stored[index] = { ...stored[index], ...updates };
    saveStoredTickets(stored);
    notifyLocalChange();
    return stored[index];
  }

  const fresh = await getTicketById(ticketId);
  if (fresh) {
    notifyLocalChange();
    return fresh;
  }

  throw new Error('Ticket not found');
};

/**
 * Mark ticket as resolved with resolution note
 */
export const resolveTicket = async (
  ticketId: string,
  resolutionNote: string,
  resolvedBy: string
): Promise<Ticket> => {
  const now = new Date().toISOString();
  const updates: Partial<Ticket> = {
    status: 'resolved',
    updatedAt: now,
    resolvedAt: now,
    resolvedBy: resolvedBy || 'IT Admin',
    resolutionNote: resolutionNote.trim(),
  };

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, COLLECTION_NAME, ticketId);
    await updateDoc(docRef, updates);
  }

  // Update local storage copy
  const stored = getStoredTickets();
  const index = stored.findIndex(t => t.id === ticketId);
  if (index !== -1) {
    stored[index] = { ...stored[index], ...updates };
    saveStoredTickets(stored);
    notifyLocalChange();
    return stored[index];
  }

  const fresh = await getTicketById(ticketId);
  if (fresh) {
    notifyLocalChange();
    return fresh;
  }

  throw new Error('Ticket not found');
};

/**
 * Delete a single ticket from Firestore & LocalStorage
 */
export const deleteTicket = async (ticketId: string): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, ticketId));
    } catch (err) {
      console.error('Firestore delete ticket error:', err);
      throw err;
    }
  }

  // Update local storage
  const current = getStoredTickets();
  const updated = current.filter(t => t.id !== ticketId);
  saveStoredTickets(updated);
  notifyLocalChange();
};

/**
 * Delete a batch/array of tickets by their IDs from Firestore & LocalStorage
 */
export const deleteTicketsByIds = async (ticketIds: string[]): Promise<void> => {
  if (ticketIds.length === 0) return;

  if (isFirebaseConfigured && db) {
    try {
      const batchPromises = ticketIds.map(id => deleteDoc(doc(db, COLLECTION_NAME, id)));
      await Promise.all(batchPromises);
    } catch (err) {
      console.error('Firestore delete batch error:', err);
      throw err;
    }
  }

  // Update local storage
  const idsSet = new Set(ticketIds);
  const current = getStoredTickets();
  const updated = current.filter(t => !idsSet.has(t.id));
  saveStoredTickets(updated);
  notifyLocalChange();
};

/**
 * Delete all tickets from Firestore & LocalStorage
 */
export const deleteAllTickets = async (): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, COLLECTION_NAME));
      const snapshot = await getDocs(q);
      const batchPromises: Promise<void>[] = [];
      snapshot.forEach(docSnap => {
        batchPromises.push(deleteDoc(doc(db, COLLECTION_NAME, docSnap.id)));
      });
      await Promise.all(batchPromises);
    } catch (err) {
      console.error('Firestore delete all tickets error:', err);
      throw err;
    }
  }

  // Clear local storage
  saveStoredTickets([]);
  notifyLocalChange();
};
