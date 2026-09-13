/**
 * JSZip-based client-side ZIP archive extractor with Multi-Chat & Master ZIP support
 */
import JSZip from 'jszip';
import { parseWhatsAppChat } from './chatParser.js';

/**
 * Extract single ZIP or multiple ZIP files
 * @param {File | Array<File>} files 
 * @returns {Promise<Array<{ id: string, chatTitle: string, messages: Array, participants: Array, primaryUser: string|null, lastMessage: Object|null }>>}
 */
export async function extractWhatsAppZip(files) {
  const fileArray = Array.isArray(files) ? files : [files];
  const sessions = [];

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    try {
      const extractedSessions = await processSingleZip(file, i);
      sessions.push(...extractedSessions);
    } catch (err) {
      console.warn(`Failed to process zip file ${file.name}:`, err);
    }
  }

  if (sessions.length === 0) {
    throw new Error('No valid WhatsApp chat text files found in the uploaded ZIP file(s).');
  }

  return sessions;
}

async function processSingleZip(zipFile, zipIndex) {
  const zip = new JSZip();
  const contents = await zip.loadAsync(zipFile);

  const txtFiles = [];
  const mediaMap = new Map();

  // Categorize files inside ZIP
  for (const [filename, fileObj] of Object.entries(contents.files)) {
    if (fileObj.dir) continue;
    const cleanName = filename.split('/').pop();

    if (cleanName.endsWith('.txt') && (cleanName.includes('_chat') || cleanName.includes('WhatsApp Chat') || txtFiles.length === 0)) {
      txtFiles.push({ filename: cleanName, fileObj });
    } else {
      mediaMap.set(cleanName.toLowerCase(), fileObj);
    }
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

  const sessions = [];

  for (let j = 0; j < txtFiles.length; j++) {
    const { filename, fileObj } = txtFiles[j];
    const rawText = await fileObj.async('string');
    const parsedData = parseWhatsAppChat(rawText);

    if (parsedData.messages.length === 0) continue;

    // Derive Chat Title from filename or participants
    let chatTitle = filename
      .replace(/^WhatsApp Chat with\s*/i, '')
      .replace(/^_chat/i, '')
      .replace(/\.txt$/i, '')
      .trim();

    if (!chatTitle || chatTitle === '') {
      chatTitle = parsedData.participants.length > 1
        ? parsedData.participants.join(', ')
        : 'WhatsApp Chat';
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
    const isDirectChatMatch = filename.match(/^WhatsApp Chat with\s+(.+)\.txt$/i);
    if (isDirectChatMatch) {
      const otherContact = isDirectChatMatch[1].trim().toLowerCase();
      const meParticipant = parsedData.participants.find(p => p.toLowerCase() !== otherContact);
      if (meParticipant) {
        primaryUser = meParticipant;
      }
    }

    // Find last user message for preview snippet
    const userMsgs = enrichedMessages.filter(m => m.type !== 'system');
    const lastMessage = userMsgs.length > 0 ? userMsgs[userMsgs.length - 1] : enrichedMessages[enrichedMessages.length - 1];

    sessions.push({
      id: `session-${zipIndex}-${j}-${Date.now()}`,
      chatTitle,
      messages: enrichedMessages,
      participants: parsedData.participants,
      primaryUser,
      lastMessage
    });
  }

  return sessions;
}
