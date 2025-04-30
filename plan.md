### ✅ Phase 1: Setup (ASAP)

- Finished all the initial project setup: Tailwind CSS, React Router, Google Fonts
- Set up Git branching — starting on `feat/login`
- Splitting the workload early: will allocate features based on strengths/preference

---

### 🧩 Phase 2: Admin Auth (Login, Register, Logout)

#### Tasks:
- Implement `LoginPage` (`/login`) and `RegisterPage` (`/register`)
- Add validation for form inputs and show relevant error messages
- Set up global context or hook to store token and manage auth
- Add logout button that's available when authenticated

#### Docs to Update:
- `progress.csv`: 2.1.1, 2.1.2, 2.1.3 to be updated accordingly
- `A11Y.md`: Mention keyboard access, aria labels, etc.
- `UIUX.md`: Form validation and error feedback for a better experience
- `TESTING.md`: Component tests for `LoginForm`, `RegisterForm`

---

### 🎯 Phase 3: Game Dashboard & Edit

#### Tasks:
- `/dashboard` route that lists all games
- Create a form/modal to allow adding a new game
- Ability to navigate to `/game/:id` for editing existing games
- Set up the basic page structure for editing a question `/game/:id/question/:questionId`

#### Docs to Update:
- `progress.csv`: Update 2.2.1 and 2.2.2 as they are done
- `UIUX.md`: Write about dashboard design, modals, edit flow
- `A11Y.md`: Ensure accessibility on buttons and list items
- `TESTING.md`: Add component test for `GameCard`, `GameForm`

---

### ⚖️ Phase 4: Session Control (Start/Stop/Results)

#### Tasks:
- Add controls to start/stop game sessions on dashboard
- Show session ID in a modal + copy-to-clipboard feature
- Results page at `/session/:sessionId` that shows score table and graphs

#### Docs to Update:
- `progress.csv`: Update all 2.3 feature rows
- `UIUX.md`: Write about modal design, results readability
- `A11Y.md`: Focus trap and keyboard nav inside modals
- `TESTING.md`: Component tests for session handling

---

### 🧓‍♂️ Phase 5: Player Join & Game View

#### Tasks:
- Join screen that accepts code or uses URL param
- Build the actual question view: countdown, options, etc.
- Implement all three types: single, multiple, judgment questions

#### Docs to Update:
- `progress.csv`: Update section 2.4
- `UIUX.md`: Joining flow, responsive layout
- `A11Y.md`: Explain visual hierarchy, timer accessibility
- `TESTING.md`: Tests for joining flow

---

### 📊 Phase 6: Results & Bonus Features

#### Tasks:
- Final player results page
- Optional: Lobby screen, points system, CSV/JSON upload

#### Docs to Update:
- `BONUS.md`: Document any extra features
- `progress.csv`: Final updates
- `TESTING.md`: Any last test cases
- `UIUX.md`, `A11Y.md`: Final tweaks

---

### ✨ Phase 7: Deployment & Final Polish

- Deploy to Vercel (frontend + backend)
- Follow steps in `deployment.md` to the letter
- Do a dry run: `6080 ass4dryrun presto CHINPOLE`
- Make sure eslint shows no warnings and all tests pass

---

### 📅 Git Commit Strategy

- Commit across at least 4 separate days
- Aim for 20+ commits total
- Don’t push more than 200 lines in one go — split up
- Clear messages using `feat`, `fix`, `chore`, `test`, etc.
