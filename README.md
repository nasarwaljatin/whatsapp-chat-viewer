# 💬 WhatsApp Chat Viewer

> Upload your exported WhatsApp chat `.zip` file and relive your conversations in a pixel-perfect WhatsApp-style UI — complete with images, media, timestamps, and the authentic look & feel.

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)
![Platform](https://img.shields.io/badge/Platform-Web-green)

---

## 🎯 What Is This?

WhatsApp Chat Viewer is a **client-side web application** that takes a WhatsApp exported chat ZIP file and renders the entire conversation in an **exact replica of the WhatsApp UI**. No data leaves your browser — everything is processed locally.

### The Problem

WhatsApp lets you export chats as `.zip` files containing a `.txt` chat log and media attachments. But reading a raw text file is painful — you lose all context, formatting, and the visual flow of the conversation.

### The Solution

Drop your `.zip` file into this app, and instantly see your chat rendered exactly as it appeared in WhatsApp — with:

- 💬 Message bubbles (sent vs received) with proper alignment
- 🖼️ Images and media displayed inline at the correct position in the timeline
- ⏰ Accurate timestamps and date separators
- ✅ Read receipts styling
- 👤 Contact names with distinct colors (for group chats)
- 🔒 100% client-side — your data never leaves your browser

---

## 📸 Preview

> *Screenshots will be added once the UI is built.*

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   Browser (Client-Side)         │
│                                                 │
│  ┌───────────┐    ┌──────────────┐              │
│  │  ZIP File  │───▶│  ZIP Parser  │              │
│  │  (Upload)  │    │  (JSZip)     │              │
│  └───────────┘    └──────┬───────┘              │
│                          │                      │
│               ┌──────────▼───────────┐          │
│               │   Chat Text Parser   │          │
│               │  (Regex-based .txt   │          │
│               │   message extractor) │          │
│               └──────────┬───────────┘          │
│                          │                      │
│               ┌──────────▼───────────┐          │
│               │   Media Mapper       │          │
│               │  (Links media files  │          │
│               │   to messages)       │          │
│               └──────────┬───────────┘          │
│                          │                      │
│               ┌──────────▼───────────┐          │
│               │   WhatsApp UI        │          │
│               │   Renderer           │          │
│               │  (Pixel-perfect      │          │
│               │   chat interface)    │          │
│               └──────────────────────┘          │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Tech Stack

| Layer         | Technology         | Why                                                    |
| ------------- | ------------------ | ------------------------------------------------------ |
| **Bundler**   | Vite               | Fast dev server, HMR, optimized builds                 |
| **UI**        | Vanilla HTML/CSS/JS | Maximum control for pixel-perfect WhatsApp UI replica  |
| **ZIP Parse** | JSZip              | Client-side ZIP extraction, no server needed           |
| **Styling**   | Vanilla CSS        | Custom properties, animations, glassmorphism for landing|
| **Fonts**     | Google Fonts       | Segoe UI / Helvetica fallback to match WhatsApp        |

---

## 📦 WhatsApp Export Format (Reference)

When you export a chat from WhatsApp, you get a `.zip` file containing:

```
WhatsApp Chat - Contact Name.zip
├── _chat.txt                         # The chat log
├── IMG-20230115-WA0001.jpg           # Attached images
├── IMG-20230116-WA0002.jpg
├── VID-20230120-WA0001.mp4           # Videos (if exported with media)
├── AUD-20230121-WA0001.opus          # Voice notes
├── STK-20230122-WA0001.webp          # Stickers
├── DOC-20230123-WA0001.pdf           # Documents
└── ...
```

### Chat Text Format

The `_chat.txt` file follows this pattern (varies slightly by OS/locale):

```
[DD/MM/YY, HH:MM:SS AM/PM] Sender Name: Message text here
[DD/MM/YY, HH:MM:SS AM/PM] Sender Name: <Media omitted>
[DD/MM/YY, HH:MM:SS AM/PM] Sender Name: image attached  (1 file attached)
[DD/MM/YY, HH:MM:SS AM/PM] Sender Name: ‎Messages and calls are end-to-end encrypted.
```

#### Known Format Variations

| Platform | Date Format                | Separator |
| -------- | -------------------------- | --------- |
| Android  | `DD/MM/YY, HH:MM:SS AM/PM`| ` - `     |
| iOS      | `[DD/MM/YY, HH:MM:SS]`    | `] `      |
| Android (24h) | `DD/MM/YY, HH:MM`    | ` - `     |
| Some locales | `MM/DD/YY, HH:MM`    | ` - `     |

---

## 🗺️ Development Roadmap

### Phase 1: Foundation 🏠
> *Core infrastructure and project setup*

- [ ] Initialize Vite project with vanilla JS
- [ ] Set up project structure (components, utils, styles)
- [ ] Create landing/upload page with drag-and-drop zone
- [ ] Implement ZIP file extraction using JSZip
- [ ] Build chat text parser with regex (handle multiple date formats)
- [ ] Create data model for parsed messages

### Phase 2: WhatsApp UI Replica 💬
> *Pixel-perfect recreation of the WhatsApp interface*

- [ ] **Chat Header** — Contact name/group name, avatar, online status bar
- [ ] **Message Bubbles** — Sent (green) vs Received (white) with proper tails
- [ ] **Timestamps** — Per-message timestamps in WhatsApp style (bottom-right of bubble)
- [ ] **Date Separators** — "Today", "Yesterday", "DD/MM/YYYY" divider pills
- [ ] **Chat Background** — WhatsApp doodle wallpaper pattern
- [ ] **System Messages** — "Messages are end-to-end encrypted", "X joined", etc.
- [ ] **Message Input Bar** — Static decorative input bar at the bottom (non-functional)
- [ ] **Scrollbar Styling** — Thin, WhatsApp-style custom scrollbar

### Phase 3: Media Integration 🖼️
> *Display images, videos, and other media inline*

- [ ] **Image Messages** — Display images inline with thumbnail + lightbox viewer
- [ ] **Video Messages** — Video player with play button overlay (WhatsApp style)
- [ ] **Audio/Voice Notes** — Waveform-style audio player
- [ ] **Stickers** — Display `.webp` stickers with transparent background
- [ ] **Documents** — File attachment cards with icon, name, size
- [ ] **Media-to-Message Mapping** — Correctly associate media files with their timeline position

### Phase 4: Group Chat Support 👥
> *Handle multi-participant conversations*

- [ ] Detect group vs individual chat from the export
- [ ] Assign distinct colors to each participant's name
- [ ] Show sender name above message bubble (group chat only)
- [ ] Participant avatar generation (initials-based or identicon)

### Phase 5: Polish & UX ✨
> *Elevate the experience to premium quality*

- [ ] **Dark Mode / Light Mode** toggle (WhatsApp has both)
- [ ] **Search** — Search through messages with highlight
- [ ] **Jump to Date** — Date picker to jump to specific dates in the chat
- [ ] **Lazy Loading / Virtualization** — Handle chats with 50k+ messages smoothly
- [ ] **Smooth Scroll** — Momentum scrolling with "scroll to bottom" FAB
- [ ] **Loading Animation** — Skeleton screens while parsing
- [ ] **Responsive Design** — Mobile-friendly layout
- [ ] **Keyboard Shortcuts** — Navigate with keyboard
- [ ] **Export / Screenshot** — Save rendered chat sections as images

### Phase 6: Advanced Features 🔬
> *Nice-to-have features for power users*

- [ ] **Chat Statistics** — Message count, most active hours, emoji usage, word clouds
- [ ] **Multi-Chat Support** — Upload multiple ZIPs, switch between chats (sidebar)
- [ ] **Emoji Rendering** — Native emoji with proper sizing
- [ ] **Link Previews** — Detect URLs and show them as clickable links
- [ ] **Reply/Quote Messages** — Detect and render quoted messages
- [ ] **Starred Messages** — Filter/highlight important messages
- [ ] **PWA Support** — Install as a standalone app

---

## 📂 Proposed Project Structure

```
whatsapp-chat-viewer/
├── index.html                  # Entry point
├── vite.config.js              # Vite configuration
├── package.json
│
├── src/
│   ├── main.js                 # App entry, routing
│   │
│   ├── parser/
│   │   ├── zipExtractor.js     # JSZip-based ZIP extraction
│   │   ├── chatParser.js       # Regex-based chat text parser
│   │   ├── mediaMapper.js      # Map media files to messages
│   │   └── dateFormats.js      # Multi-format date parsing utils
│   │
│   ├── components/
│   │   ├── UploadScreen.js     # Landing page with drag-and-drop
│   │   ├── ChatView.js         # Main chat container
│   │   ├── ChatHeader.js       # Top bar (contact info)
│   │   ├── MessageBubble.js    # Individual message renderer
│   │   ├── MediaMessage.js     # Image/Video/Audio/Doc renderer
│   │   ├── DateSeparator.js    # Date divider pills
│   │   ├── SystemMessage.js    # System/info messages
│   │   ├── SearchBar.js        # Message search
│   │   └── Lightbox.js         # Full-screen image viewer
│   │
│   ├── styles/
│   │   ├── index.css           # Global styles & CSS variables
│   │   ├── upload.css          # Upload/landing page styles
│   │   ├── chat.css            # Chat view styles
│   │   ├── bubbles.css         # Message bubble styles
│   │   ├── media.css           # Media message styles
│   │   └── animations.css      # Transitions & micro-animations
│   │
│   ├── assets/
│   │   ├── wa-bg-light.png     # WhatsApp doodle wallpaper (light)
│   │   ├── wa-bg-dark.png      # WhatsApp doodle wallpaper (dark)
│   │   └── icons/              # UI icons (send, attach, etc.)
│   │
│   └── utils/
│       ├── constants.js        # Colors, config values
│       ├── helpers.js          # Utility functions
│       └── virtualScroll.js    # Virtual scrolling for performance
│
├── public/
│   └── favicon.ico
│
└── tests/
    ├── parser.test.js          # Chat parser unit tests
    └── sample-exports/         # Sample WhatsApp exports for testing
```

---

## 🎨 UI Design Reference

### Color Palette

| Element                 | Light Mode   | Dark Mode    |
| ----------------------- | ------------ | ------------ |
| **Sent Bubble**         | `#d9fdd3`    | `#005c4b`    |
| **Received Bubble**     | `#ffffff`    | `#202c33`    |
| **Chat Background**     | `#efeae2`    | `#0b141a`    |
| **Header Bar**          | `#008069`    | `#202c33`    |
| **Timestamp Text**      | `#667781`    | `#8696a0`    |
| **Sender Name (Group)** | Various      | Various      |
| **System Message**      | `#ffd279` bg | `#1d282f` bg |
| **Date Separator**      | `#e1f2fb`    | `#182229`    |

### Typography

| Element          | Font                      | Size   | Weight |
| ---------------- | ------------------------- | ------ | ------ |
| Messages         | Segoe UI, Helvetica, sans | 14.2px | 400    |
| Timestamps       | Same                      | 11px   | 400    |
| Sender Names     | Same                      | 12.8px | 500    |
| Date Separators  | Same                      | 12.5px | 400    |
| Header Title     | Same                      | 16px   | 500    |

---

## 🔒 Privacy First

This application is **100% client-side**. Your chat data:

- ❌ Is **never uploaded** to any server
- ❌ Is **never stored** anywhere permanently
- ❌ Is **never shared** with anyone
- ✅ Is processed **entirely in your browser**
- ✅ Is **discarded** when you close/refresh the tab

---

## 🛠️ Getting Started (Development)

```bash
# Clone the repository
git clone https://github.com/your-username/whatsapp-chat-viewer.git
cd whatsapp-chat-viewer

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🧪 How to Export a WhatsApp Chat

1. Open WhatsApp on your phone
2. Open the chat you want to export
3. Tap **⋮** (three dots) → **More** → **Export Chat**
4. Choose **"Include Media"** for the full experience
5. Save/share the resulting `.zip` file
6. Upload it to this app!

---

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting a PR.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>Built with ❤️ for nostalgia</b><br/>
  <i>Because every conversation deserves to be remembered beautifully.</i>
</p>
