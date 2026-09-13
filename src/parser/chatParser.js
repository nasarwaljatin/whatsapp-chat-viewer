/**
 * Regex-based WhatsApp chat log parser
 */
import { DATE_REGEX_PATTERNS, parseWhatsAppDateTime } from './dateFormats.js';

// Clean invisible Unicode control characters (LTR/RTL marks)
function cleanUnicode(str) {
  return str.replace(/[\u200E\u200F\u202A-\u202E]/g, '').trim();
}

/**
 * Parses raw text from WhatsApp export _chat.txt
 * @param {string} rawText 
 * @returns {{ messages: Array, participants: Array, primaryUser: string }}
 */
export function parseWhatsAppChat(rawText) {
  const lines = rawText.split(/\r?\n/);
  const messages = [];
  const participantCountMap = {};

  let currentMsg = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    if (!rawLine.trim()) continue;

    // Check if line starts with a date pattern
    let dateMatch = null;
    let matchedPattern = null;

    for (const pattern of DATE_REGEX_PATTERNS) {
      const match = rawLine.match(pattern);
      if (match) {
        dateMatch = match;
        matchedPattern = pattern;
        break;
      }
    }

    if (dateMatch) {
      // Push previous message if it exists
      if (currentMsg) {
        messages.push(currentMsg);
      }

      const dateStr = dateMatch[1];
      const timeStr = dateMatch[2];
      const restOfLine = rawLine.slice(dateMatch[0].length);

      const dateTimeInfo = parseWhatsAppDateTime(dateStr, timeStr);

      // Check if rest of line contains "Sender: Message" or if it's a System Message
      const colonIndex = restOfLine.indexOf(':');

      if (colonIndex !== -1) {
        const sender = cleanUnicode(restOfLine.substring(0, colonIndex));
        const content = cleanUnicode(restOfLine.substring(colonIndex + 1));

        // Count sender frequency to auto-detect primary user or participants
        participantCountMap[sender] = (participantCountMap[sender] || 0) + 1;

        currentMsg = {
          id: `msg-${messages.length + 1}`,
          type: 'user',
          sender,
          content,
          date: dateTimeInfo.date,
          formattedDate: dateTimeInfo.formattedDate,
          formattedTime: dateTimeInfo.formattedTime,
          media: detectMediaAttachment(content)
        };
      } else {
        // System message (e.g. Encryption notice, group events)
        const systemContent = cleanUnicode(restOfLine);
        currentMsg = {
          id: `msg-${messages.length + 1}`,
          type: 'system',
          sender: 'System',
          content: systemContent,
          date: dateTimeInfo.date,
          formattedDate: dateTimeInfo.formattedDate,
          formattedTime: dateTimeInfo.formattedTime,
          media: null
        };
      }
    } else if (currentMsg) {
      // Multiline message append
      currentMsg.content += '\n' + cleanUnicode(rawLine);
      // Re-evaluate media detection if new line added
      if (!currentMsg.media) {
        currentMsg.media = detectMediaAttachment(currentMsg.content);
      }
    }
  }

  if (currentMsg) {
    messages.push(currentMsg);
  }

  // Determine participants list
  const participants = Object.keys(participantCountMap);
  
  // Primary user is ONLY set if explicitly 'You' is present in chat log
  let primaryUser = null;
  if (participants.includes('You')) {
    primaryUser = 'You';
  }

  return {
    messages,
    participants,
    primaryUser
  };
}

/**
 * Detect media attachments referenced in message content
 * Common formats:
 * - "IMG-20230115-WA0001.jpg (file attached)"
 * - "VID-20230115-WA0001.mp4 (file attached)"
 * - "AUD-20230115-WA0001.opus (file attached)"
 * - "STK-20230115-WA0001.webp (file attached)"
 * - "<Media omitted>"
 * - "image attached" / "video attached"
 */
function detectMediaAttachment(content) {
  // Regex for attached filename patterns
  const fileAttachedMatch = content.match(/([\w\-]+\.(?:jpg|jpeg|png|gif|webp|mp4|opus|m4a|aac|ogg|mp3|pdf|docx|txt))\s*(?:\(file attached\)|<attached>|attached)?/i);
  
  if (fileAttachedMatch) {
    const filename = fileAttachedMatch[1];
    const ext = filename.split('.').pop().toLowerCase();

    let mediaType = 'document';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) mediaType = 'image';
    else if (ext === 'webp') mediaType = 'sticker';
    else if (['mp4', 'mkv', 'avi', 'mov'].includes(ext)) mediaType = 'video';
    else if (['opus', 'm4a', 'aac', 'ogg', 'mp3', 'wav'].includes(ext)) mediaType = 'audio';

    return {
      filename,
      mediaType,
      omitted: false
    };
  }

  if (content.includes('<Media omitted>') || content.includes('Media omitted')) {
    return {
      filename: null,
      mediaType: 'omitted',
      omitted: true
    };
  }

  return null;
}
