# TechLingo - Learn Technical English Like Duolingo 🚀

A modern, interactive web application for learning technical English vocabulary tailored for computer science professionals. Built with React, TypeScript, and Web APIs - completely free and offline-first.

## ✨ Features

### 🎮 Gamified Learning
- **Level Progression**: 6 levels from Novato 🌱 to Architect 🏗️
- **XP System**: Earn points for every exercise completed
- **Streaks**: Build daily learning streaks with fire 🔥 multipliers
- **Achievements**: Unlock badges as you progress

### 📚 6 Technical Areas
- **🔐 Cybersecurity** - Firewall, encryption, phishing, vulnerabilities
- **🌐 Web Frontend** - DOM, React, CSS, responsive design
- **⚙️ Backend** - APIs, REST, databases, microservices
- **🗄️ Databases** - SQL, schemas, transactions, optimization
- **🚀 DevOps** - CI/CD, Docker, Kubernetes, monitoring
- **🌍 Networking** - Protocols, IP, DNS, VPN, CDN

### 🗣️ Speech Features (100% Free)
- **Text-to-Speech (TTS)**: Hear correct pronunciation via Web Speech API
- **Speech Recognition (STT)**: Practice pronunciation with AI evaluation
- **Pronunciation Scoring**: 0-100% accuracy feedback

### 💪 Exercise Types
- Multiple choice questions
- Fill-in-the-blank code snippets
- Pronunciation practice
- Listening & typing
- Code context reading
- True/False definitions

### 📊 Progress Tracking
- Activity heatmap (GitHub contributions style)
- Per-area progress dashboard
- Detailed statistics by difficulty level
- Estimated time to next level

### ⚙️ Customization
- Light/Dark theme (dark optimized)
- Sound effects toggle
- Speech rate adjustment (0.5x to 2x)
- Accent preference (US/UK English)

## 🛠️ Tech Stack

- **React 18+** with TypeScript (strict mode)
- **Vite** for lightning-fast builds
- **Tailwind CSS** for responsive design
- **Framer Motion** for smooth animations
- **Zustand** for state management
- **React Router v6** for navigation
- **Web Speech API** (native browser - no costs!)
- **localStorage** for offline persistence

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/techlingo.git
cd techlingo

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🚀 Deployment

TechLingo is optimized for free deployment on Vercel, Netlify, or GitHub Pages:

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable components (Button, Card, Badge, etc)
│   ├── layout/          # Header, Sidebar, BottomNav
│   └── features/        # PronunciationCard, Exercises, etc
├── pages/               # Route pages (Home, Areas, Glossary, Progress)
├── hooks/               # Custom hooks (useSpeechSynthesis, useSpeechRecognition)
├── store/               # Zustand stores (userStore, lessonStore, settingsStore)
├── data/                # Term definitions for all 6 areas (90+ terms)
├── types/               # TypeScript interfaces
├── utils/               # Helper functions
└── App.tsx             # Main router
```

## 📝 Data Format

Each term includes:
```typescript
{
  id: string;                    // Unique identifier
  english: string;               // English term
  spanish: string;               // Spanish translation
  phonetic: string;              // IPA notation
  pronunciation_guide: string;   // Spanish pronunciation guide
  definition_en: string;         // Full English definition
  definition_es: string;         // Full Spanish definition
  codeExample?: string;          // Real code where term is used
  contextSentence: string;       // Example sentence
  tags: string[];                // Search tags
  relatedTerms: string[];        // Links to related terms
}
```

## 🎯 Key Hooks

### useSpeechSynthesis
```typescript
const { speak, stop, isSupported } = useSpeechSynthesis();
speak("firewall", "en-US"); // Read term aloud
```

### useSpeechRecognition
```typescript
const { startListening, isListening, isSupported } = useSpeechRecognition();
startListening((result) => {
  console.log(`Score: ${result.score}%`); // 0-100
}, "firewall");
```

### useProgress
```typescript
const { profile, getLevelInfo, getAreaProgress, getTotalLearned } = useProgress();
```

## 🏗️ State Management

### User Store (Zustand)
- Profile (name, XP, level, streak)
- Term progress (times correct/wrong, learned flag)
- Completed lessons
- Achievements

### Settings Store
- Theme preference
- Sound enabled/disabled
- Speech rate
- Accent preference

### Lesson Store
- Current lesson state
- Lives/health
- XP earned in session
- Exercise progress

## 🔐 Privacy & Offline

✅ **Zero server dependency** - all data stored in browser localStorage  
✅ **Completely offline** - works without internet connection  
✅ **No tracking** - no analytics or telemetry  
✅ **Private** - no data shared or uploaded  

## 🤝 Contributing

Contributions welcome! Areas needing help:

- [ ] More exercise types (matching, drag-drop, multiple select)
- [ ] Mobile app (React Native)
- [ ] Additional languages
- [ ] Sound effect library
- [ ] Lesson sequencing algorithm
- [ ] Community term suggestions

## 📄 License

MIT License - feel free to use, modify, and distribute

## 🙏 Credits

- **Inspired by**: Duolingo's gamification approach
- **Speech API**: Browser's native Web Speech API
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS

## 📧 Support

Found a bug or have a feature request? Open an issue on GitHub!

---

Made with ❤️ for tech professionals learning English. Happy learning! 🚀
