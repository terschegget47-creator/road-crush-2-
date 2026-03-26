:root {
  --bg: #07111b;
  --panel: rgba(9, 24, 39, 0.82);
  --panel-border: rgba(136, 199, 255, 0.16);
  --text: #edf7ff;
  --muted: #9eb7ca;
  --accent: #ffd166;
  --accent-2: #61dafb;
  --danger: #ff6b6b;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  color: var(--text);
  font-family: "Rubik", sans-serif;
  background:
    radial-gradient(circle at top, rgba(255, 209, 102, 0.14), transparent 28%),
    linear-gradient(180deg, #09131e 0%, #10253a 100%);
}

.app-shell {
  width: min(1400px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 20px 0 28px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 18px;
}

.game-panel,
.side-card,
.hud-card,
.screen-card {
  background: var(--panel);
  border: 1px solid var(--panel-border);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(10px);
}

.game-panel,
.side-card {
  border-radius: 28px;
}

.game-panel {
  padding: 18px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 18px;
}

.eyebrow,
.hud-label,
.field-label {
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.74rem;
  color: var(--muted);
}

h1,
h2 {
  margin: 0;
  font-family: "Orbitron", sans-serif;
}

h1 {
  font-size: clamp(2rem, 4vw, 3.2rem);
}

h2 {
  font-size: 1.1rem;
  margin-bottom: 12px;
}

.hud {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.hud-card {
  min-width: 120px;
  border-radius: 18px;
  padding: 12px 14px;
}

.hud-card strong {
  display: block;
  font-size: 1.4rem;
  margin-top: 6px;
}

.canvas-wrap {
  position: relative;
}

canvas {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 30px;
  background: #0d1d2c;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.screen {
  position: absolute;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 24px;
  border-radius: 30px;
  background: rgba(3, 10, 16, 0.56);
}

.screen.visible {
  display: flex;
}

.screen-card {
  width: min(100%, 480px);
  border-radius: 24px;
  padding: 28px;
  text-align: center;
}

.screen-text {
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: 16px;
}

.text-input {
  width: 100%;
  margin: 8px 0 16px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
  font: inherit;
}

.text-input:focus {
  outline: 2px solid rgba(97, 218, 251, 0.35);
  border-color: rgba(97, 218, 251, 0.65);
}

.car-grid {
  display: grid;
  gap: 10px;
  margin: 8px 0 18px;
}

.car-option,
.primary-button,
.secondary-button,
.pause-button,
.quiz-answer {
  border: none;
  font: inherit;
  cursor: pointer;
  transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
}

.car-option {
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
  color: var(--text);
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.08);
}

.car-option.selected {
  border-color: rgba(255, 209, 102, 0.7);
  background: rgba(255, 209, 102, 0.16);
}

.car-option:hover,
.primary-button:hover,
.secondary-button:hover,
.pause-button:hover,
.quiz-answer:hover {
  transform: translateY(-2px);
}

.car-preview {
  width: 54px;
  height: 24px;
  border-radius: 14px 18px 10px 10px;
  position: relative;
  flex: 0 0 auto;
}

.car-preview::before {
  content: "";
  position: absolute;
  left: 16px;
  top: 4px;
  width: 18px;
  height: 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.75);
}

.car-preview::after {
  content: "";
  position: absolute;
  left: 6px;
  bottom: -6px;
  width: 42px;
  height: 10px;
  background:
    radial-gradient(circle at 6px 5px, #101820 0 4px, transparent 4px),
    radial-gradient(circle at 36px 5px, #101820 0 4px, transparent 4px);
}

.car-preview.red {
  background: linear-gradient(135deg, #ffb36b, #ff5a7a);
}

.car-preview.blue {
  background: linear-gradient(135deg, #86f7ff, #4e8dff);
}

.car-preview.green {
  background: linear-gradient(135deg, #d7ff6d, #38d996);
}

.primary-button,
.secondary-button,
.pause-button {
  padding: 14px 22px;
  border-radius: 999px;
  font-weight: 700;
}

.primary-button {
  background: linear-gradient(135deg, var(--accent), #ff9f43);
  color: #1e1f23;
}

.secondary-button {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: var(--text);
}

.pause-button {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: var(--text);
  min-height: 74px;
}

.game-over-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.quiz-card {
  width: min(100%, 620px);
  text-align: left;
  background:
    radial-gradient(circle at top right, rgba(255, 209, 102, 0.18), transparent 28%),
    linear-gradient(180deg, rgba(14, 28, 46, 0.96), rgba(8, 18, 31, 0.96));
  border-color: rgba(255, 214, 120, 0.28);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.34);
}

.quiz-topline {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 10px;
}

.quiz-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #201707;
  background: linear-gradient(135deg, #ffd166, #ff9f43);
}

.quiz-answers {
  display: grid;
  gap: 10px;
  margin: 18px 0 14px;
}

.quiz-answer {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 12px;
  align-items: center;
  text-align: left;
  padding: 14px 16px;
  border-radius: 16px;
  color: var(--text);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.04));
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.quiz-answer-key {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  font-family: "Orbitron", sans-serif;
  font-weight: 800;
  color: #1d2430;
  background: linear-gradient(135deg, #d4ecff, #8ebcff);
}

.quiz-answer-text {
  line-height: 1.45;
}

.quiz-answer.correct {
  background: rgba(90, 200, 140, 0.22);
  border-color: rgba(90, 200, 140, 0.52);
}

.quiz-answer.wrong {
  background: rgba(255, 107, 107, 0.2);
  border-color: rgba(255, 107, 107, 0.45);
}

.quiz-feedback {
  display: none;
  min-height: 72px;
  margin-bottom: 0;
}

.quiz-feedback.visible {
  display: block;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar {
  display: grid;
  gap: 18px;
  align-content: start;
}

.side-card {
  padding: 20px;
}

.champion-box {
  display: grid;
  gap: 6px;
  padding: 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 209, 102, 0.16), rgba(97, 218, 251, 0.12));
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.champion-box strong {
  font-size: 1.3rem;
}

.leaderboard {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.leaderboard li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.leaderboard .empty {
  justify-content: center;
  color: var(--muted);
}

p {
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 1100px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .app-shell {
    width: min(100vw - 20px, 1400px);
    padding-top: 10px;
  }

  .topbar {
    flex-direction: column;
  }

  .hud {
    width: 100%;
    justify-content: flex-start;
  }

  .sidebar {
    grid-template-columns: 1fr;
  }

  .game-over-actions {
    flex-direction: column;
  }
}
