/**
 * Sample WhatsApp Chat Generator for instant live preview / demo mode
 */

export function generateSampleChat() {
  const primaryUser = 'You';
  const participants = ['You', 'Sarah Connor', 'Alex Rivera', 'David Kim'];
  const chatTitle = 'Project Alpha Team 🚀';

  // Base64 SVGs & Canvas-generated sample media URLs
  const sampleImageBase64 = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2300a884"/><stop offset="100%" stop-color="%23005c4b"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><circle cx="300" cy="200" r="80" fill="%23ffffff" opacity="0.2"/><path d="M260 220 L300 160 L340 220 Z" fill="%23ffffff"/><text x="300" y="320" font-family="sans-serif" font-size="24" fill="%23ffffff" text-anchor="middle" font-weight="bold">WhatsApp Chat Viewer Demo</text></svg>';

  const messages = [
    {
      id: 'msg-1',
      type: 'system',
      sender: 'System',
      content: '🔒 Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.',
      date: new Date(2023, 10, 15, 9, 30),
      formattedDate: '15/11/23',
      formattedTime: '09:30 AM',
      media: null
    },
    {
      id: 'msg-2',
      type: 'system',
      sender: 'System',
      content: 'Sarah Connor created group "Project Alpha Team 🚀"',
      date: new Date(2023, 10, 15, 9, 31),
      formattedDate: '15/11/23',
      formattedTime: '09:31 AM',
      media: null
    },
    {
      id: 'msg-3',
      type: 'user',
      sender: 'Sarah Connor',
      content: 'Hey team! Welcome to the new WhatsApp viewer project. Are we ready for the launch today? 🎉',
      date: new Date(2023, 10, 15, 9, 32),
      formattedDate: '15/11/23',
      formattedTime: '09:32 AM',
      media: null
    },
    {
      id: 'msg-4',
      type: 'user',
      sender: 'Alex Rivera',
      content: 'Absolutely! I just finished testing the ZIP parser and client-side extraction. Everything runs 100% locally in browser!',
      date: new Date(2023, 10, 15, 9, 34),
      formattedDate: '15/11/23',
      formattedTime: '09:34 AM',
      media: null
    },
    {
      id: 'msg-5',
      type: 'user',
      sender: 'You',
      content: 'Here is a preview screenshot of the design system we are using for the message bubbles and light/dark theme! 👇',
      date: new Date(2023, 10, 15, 9, 36),
      formattedDate: '15/11/23',
      formattedTime: '09:36 AM',
      media: {
        filename: 'demo-ui-preview.png',
        mediaType: 'image',
        url: sampleImageBase64,
        omitted: false
      }
    },
    {
      id: 'msg-6',
      type: 'user',
      sender: 'David Kim',
      content: 'Wow, that green and dark mode look spot on! 🔥 Does it support audio voice notes and stickers as well?',
      date: new Date(2023, 10, 15, 9, 38),
      formattedDate: '15/11/23',
      formattedTime: '09:38 AM',
      media: null
    },
    {
      id: 'msg-7',
      type: 'user',
      sender: 'Sarah Connor',
      content: 'Yes! Check out this voice note demo:',
      date: new Date(2023, 10, 15, 9, 40),
      formattedDate: '15/11/23',
      formattedTime: '09:40 AM',
      media: {
        filename: 'AUD-20231115-WA0001.opus',
        mediaType: 'audio',
        url: null,
        omitted: false
      }
    },
    {
      id: 'msg-8',
      type: 'user',
      sender: 'Alex Rivera',
      content: 'I attached the design spec sheet document below as well.',
      date: new Date(2023, 10, 15, 9, 42),
      formattedDate: '15/11/23',
      formattedTime: '09:42 AM',
      media: {
        filename: 'WhatsApp_UI_Specifications_v2.pdf',
        mediaType: 'document',
        url: '#',
        omitted: false
      }
    },
    {
      id: 'msg-9',
      type: 'user',
      sender: 'You',
      content: 'Awesome! Let us test uploading real WhatsApp ZIP exports now.',
      date: new Date(2023, 10, 15, 9, 45),
      formattedDate: '15/11/23',
      formattedTime: '09:45 AM',
      media: null
    }
  ];

  return {
    messages,
    participants,
    primaryUser,
    chatTitle
  };
}
