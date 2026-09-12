/**
 * Generate a clean, unique human-readable ticket number.
 * Format: IT-2026-000125
 */
export const generateTicketNumber = (counter?: number): string => {
  const currentYear = new Date().getFullYear() || 2026;
  
  if (typeof counter === 'number' && counter > 0) {
    const padded = String(counter).padStart(6, '0');
    return `IT-${currentYear}-${padded}`;
  }

  // Generate random 6-digit number if sequential counter is not provided
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `IT-${currentYear}-${randomNum}`;
};
