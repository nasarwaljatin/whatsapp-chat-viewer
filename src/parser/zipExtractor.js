/**
 * JSZip-based client-side ZIP archive extractor
 */
import JSZip from 'jszip';
import { parseWhatsAppChat } from './chatParser.js';

/**
 * Extract WhatsApp ZIP archive and process contents
 * @param {File} zipFile 
 * @returns {Promise<{ messages: Array, mediaMap: Map, participants: Array, primaryUser: string, chatTitle: string }>}
 */
export async function extractWhatsAppZip(zipFile) {
  const zip = new JSZip();
  const contents = await zip.loadAsync(zipFile);

  let chatTxtFile = null;
  let chatTxtName = '';
  const mediaMap = new Map();

  // Find chat text file and index media files
  for (const [filename, fileObj] of Object.entries(contents.files)) {
    if (fileObj.dir) continue;

    const cleanName = filename.split('/').pop(); // Remove subfolders if any

    if (cleanName.endsWith('.txt') && (cleanName.includes('_chat') || cleanName.includes('WhatsApp Chat') || !chatTxtFile)) {
      chatTxtFile = fileObj;
      chatTxtName = cleanName;
    } else {
      // It's a media attachment
      mediaMap.set(cleanName.toLowerCase(), fileObj);
    }
  }

  if (!chatTxtFile) {
    throw new Error('No WhatsApp chat text file (_chat.txt) found in the ZIP archive.');
  }

  const rawText = await chatTxtFile.async('string');
  const parsedData = parseWhatsAppChat(rawText);

  // Derive Chat Title from filename or participants
  let chatTitle = chatTxtName
    .replace(/^WhatsApp Chat with\s*/i, '')
    .replace(/^_chat/i, '')
    .replace(/\.txt$/i, '')
    .trim();

  if (!chatTitle || chatTitle === '') {
    chatTitle = parsedData.participants.length > 1
      ? parsedData.participants.join(', ')
      : 'WhatsApp Chat';
  }

  // Create Object URLs for media files asynchronously
  const mediaUrlMap = new Map();
  for (const [filename, fileObj] of mediaMap.entries()) {
    try {
      const blob = await fileObj.async('blob');
      const url = URL.createObjectURL(blob);
      mediaUrlMap.set(filename, url);
    } catch (e) {
      console.warn(`Could not load media file ${filename}:`, e);
    }
  }

  // Map media URLs to messages
  const enrichedMessages = parsedData.messages.map(msg => {
    if (msg.media && msg.media.filename) {
      const lowerName = msg.media.filename.toLowerCase();
      const url = mediaUrlMap.get(lowerName);
      return {
        ...msg,
        media: {
          ...msg.media,
          url: url || null
        }
      };
    }
    return msg;
  });

  // Smart primary user detection:
  let primaryUser = parsedData.primaryUser;

  // If filename starts with "WhatsApp Chat with <Contact>", <Contact> is the OTHER person!
  const isDirectChatMatch = chatTxtName.match(/^WhatsApp Chat with\s+(.+)\.txt$/i);
  if (isDirectChatMatch) {
    const otherContact = isDirectChatMatch[1].trim().toLowerCase();
    const meParticipant = parsedData.participants.find(p => p.toLowerCase() !== otherContact);
    if (meParticipant) {
      primaryUser = meParticipant;
    }
  }

  return {
    messages: enrichedMessages,
    participants: parsedData.participants,
    primaryUser,
    chatTitle
  };
}
