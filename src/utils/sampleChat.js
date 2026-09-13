/**
 * Sample WhatsApp Chat Generator returning multiple chat sessions for demo mode
 */

export function generateSampleChat() {
  const sampleImageBase64 = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2300a884"/><stop offset="100%" stop-color="%23005c4b"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><circle cx="300" cy="200" r="80" fill="%23ffffff" opacity="0.2"/><path d="M260 220 L300 160 L340 220 Z" fill="%23ffffff"/><text x="300" y="320" font-family="sans-serif" font-size="24" fill="%23ffffff" text-anchor="middle" font-weight="bold">WhatsApp Chat Viewer Demo</text></svg>';

  // Session 1: Project Alpha Team Group Chat
  const session1Messages = [
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

  // Session 2: 1-on-1 Chat with Sarah Connor
  const session2Messages = [
    {
      id: 'msg-201',
      type: 'system',
      sender: 'System',
      content: '🔒 Messages and calls are end-to-end encrypted.',
      date: new Date(2023, 10, 14, 14, 10),
      formattedDate: '14/11/23',
      formattedTime: '02:10 PM',
      media: null
    },
    {
      id: 'msg-202',
      type: 'user',
      sender: 'Sarah Connor',
      content: 'Hey, did you review the Vercel live deployment guide?',
      date: new Date(2023, 10, 14, 14, 12),
      formattedDate: '14/11/23',
      formattedTime: '02:12 PM',
      media: null
    },
    {
      id: 'msg-203',
      type: 'user',
      sender: 'You',
      content: 'Yes! It builds into static web files in under 1 second.',
      date: new Date(2023, 10, 14, 14, 15),
      formattedDate: '14/11/23',
      formattedTime: '02:15 PM',
      media: null
    }
  ];

  // Session 3: 1-on-1 Chat with Alex Rivera
  const session3Messages = [
    {
      id: 'msg-301',
      type: 'system',
      sender: 'System',
      content: '🔒 Messages and calls are end-to-end encrypted.',
      date: new Date(2023, 10, 13, 18, 0),
      formattedDate: '13/11/23',
      formattedTime: '06:00 PM',
      media: null
    },
    {
      id: 'msg-302',
      type: 'user',
      sender: 'Alex Rivera',
      content: 'The multi-chat sidebar layout looks super clean on desktop!',
      date: new Date(2023, 10, 13, 18, 5),
      formattedDate: '13/11/23',
      formattedTime: '06:05 PM',
      media: null
    }
  ];

  return [
    {
      id: 'demo-session-1',
      chatTitle: 'Project Alpha Team 🚀',
      messages: session1Messages,
      participants: ['You', 'Sarah Connor', 'Alex Rivera', 'David Kim'],
      primaryUser: 'You',
      lastMessage: session1Messages[session1Messages.length - 1]
    },
    {
      id: 'demo-session-2',
      chatTitle: 'Sarah Connor',
      messages: session2Messages,
      participants: ['You', 'Sarah Connor'],
      primaryUser: 'You',
      lastMessage: session2Messages[session2Messages.length - 1]
    },
    {
      id: 'demo-session-3',
      chatTitle: 'Alex Rivera',
      messages: session3Messages,
      participants: ['You', 'Alex Rivera'],
      primaryUser: 'You',
      lastMessage: session3Messages[session3Messages.length - 1]
    }
  ];
}
