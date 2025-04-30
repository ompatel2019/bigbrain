```markdown
# BigBrain – Real-Time Quiz Game Frontend (React.js)

> _Note: This project was originally developed in a private repository and later migrated here. That’s why commit history appears minimal._

BigBrain is a real-time multiplayer quiz game. This frontend, built with **React.js**, enables admins to manage games and players to participate in fast-paced live quizzes. It supports features like live sessions, timed questions, instant feedback, and performance analytics.

---

## 🔗 Quick Links

- **Frontend**: React.js SPA (this repo)  
- **Backend API**: [localhost:5005](http://localhost:5005)  
- **Live Demo**: _(add your deployed link here if available)_

---

## ⚙️ Features

### 👤 Admin Panel
- **Auth**: Register, login, logout
- **Game Dashboard**: Create, edit, and delete games
- **Question Editor**: Supports text, images, videos, MCQ, judgement types
- **Session Control**: Start, advance, and end sessions live
- **Live Dashboard**: Real-time player count, question status, timer

### 🎮 Player View
- **Join Session**: Enter session code or use shared URL
- **Lobby**: Waiting screen until session starts
- **Play Game**:
  - Display questions with text/media
  - Countdown timer
  - Single, multiple, and judgement answer types
  - Submit manually or auto-submit on interaction
- **Results View**: Per-question feedback, time taken, and points

---

## 🚀 Getting Started

### 📦 Prerequisites
- Node.js (v18+)
- npm
- Backend server running on `http://localhost:5005`

### 🔧 Installation

```bash
cd frontend
npm install
```

### 🧪 Run Locally

```bash
npm run dev
# Then open http://localhost:3000
```

---

## 📁 Project Structure

```
frontend/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI blocks
│   ├── layouts/           # Shared layout structure
│   ├── pages/             # Routeable views
│   ├── utils/             # API configs & helpers
│   ├── __tests__/         # Unit tests
│   └── App.jsx            # App entry & routing
├── backend.config.json    # API base URL
├── package.json
└── README.md
```

---

## 📜 Scripts

| Script              | Description                           |
|---------------------|---------------------------------------|
| `npm run dev`       | Run Vite dev server                   |
| `npm run build`     | Create optimized production build     |
| `npm run preview`   | Preview production build locally      |
| `npm run lint`      | Run ESLint (must pass with 0 errors)  |
| `npm run test`      | Run unit/component tests via Vitest   |

---

## ✅ Testing

Testing is done using **Vitest** + **React Testing Library**.

```bash
npm run test
```

- All test files are under `src/__tests__/`
- Includes tests for core UI components and the login flow

---

## 🧹 Clean Git Practices (Optional)

This project previously included a Git hook to:
- Reject commits over 200+ insertions (excluding lockfiles)
- Encourage smaller, more focused commits

You can choose to re-enable this by restoring `setup.sh` and `pre-commit.sh` under `util/`.

---

## 🙌 Contribution & Notes

This project is part of a university assignment (COMP6080), restructured and improved for personal portfolio use.  
Original task requirements were followed strictly and all frontend logic is implemented using React without external templates or builders.