/**
 * Date parsing utilities for WhatsApp exported chat logs.
 * Supports Android & iOS formats across 12-hour and 24-hour conventions.
 */

// Common WhatsApp Date Regex Patterns:
// Android 12h/24h:  "15/01/23, 10:30 am - Sender: Message" or "15/01/2023, 10:30 - Sender: Message"
// Android bracket:  "[15/01/23, 10:30:15 AM] Sender: Message"
// iOS:              "[15.01.23, 10:30:15] Sender: Message" or "[15/01/2023, 10:30:15 AM] Sender: Message"
// Unicode LTR mark: "\u200E" or "\u200F" often prepends WhatsApp dates

export const DATE_REGEX_PATTERNS = [
  // Pattern 1: [DD/MM/YY, HH:MM:SS AM/PM] or [DD.MM.YY, HH:MM:SS]
  /^[\u200E\u200F]?\[?(\d{1,4}[./\-]\d{1,2}[./\-]\d{1,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AaPp][Mm])?)\]?\s*[-:]?\s*/,
  // Pattern 2: DD/MM/YY, HH:MM AM/PM - Sender: Message
  /^[\u200E\u200F]?(\d{1,4}[./\-]\d{1,2}[./\-]\d{1,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AaPp][Mm])?)\s*-\s*/
];

/**
 * Standardize timestamp string for sorting and date badges
 * @param {string} dateStr 
 * @param {string} timeStr 
 * @returns {{ date: Date, formattedDate: string, formattedTime: string }}
 */
export function parseWhatsAppDateTime(dateStr, timeStr) {
  try {
    // Replace dots/hyphens with slashes for consistent parsing
    const normalizedDate = dateStr.replace(/[.\-]/g, '/');
    const parts = normalizedDate.split('/');
    
    let day = 1, month = 1, year = 2023;

    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY/MM/DD
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        day = parseInt(parts[2], 10);
      } else {
        // DD/MM/YY or MM/DD/YY (Assume DD/MM/YY as WhatsApp default)
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        year = parseInt(parts[2], 10);
        if (year < 100) year += 2000;
      }
    }

    // Parse time
    let hours = 0, minutes = 0, seconds = 0;
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AaPp][Mm])?/);
    if (timeMatch) {
      hours = parseInt(timeMatch[1], 10);
      minutes = parseInt(timeMatch[2], 10);
      seconds = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;
      const ampm = timeMatch[4];

      if (ampm) {
        if (ampm.toLowerCase() === 'pm' && hours < 12) hours += 12;
        if (ampm.toLowerCase() === 'am' && hours === 12) hours = 0;
      }
    }

    const dateObj = new Date(year, month, day, hours, minutes, seconds);

    // Formatted time string (e.g. 10:30 AM)
    const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Formatted date string in DD/MM/YY format
    const dayStr = String(dateObj.getDate()).padStart(2, '0');
    const monthStr = String(dateObj.getMonth() + 1).padStart(2, '0');
    const yearStr = String(dateObj.getFullYear()).slice(-2);
    const formattedDate = `${dayStr}/${monthStr}/${yearStr}`;

    return {
      date: isNaN(dateObj.getTime()) ? new Date() : dateObj,
      formattedDate,
      formattedTime
    };
  } catch (err) {
    return {
      date: new Date(),
      formattedDate: dateStr,
      formattedTime: timeStr
    };
  }
}
