const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const bestScoreEl = document.getElementById("bestScore");
const currentPlayerEl = document.getElementById("currentPlayer");
const pauseButton = document.getElementById("pauseButton");
const leaderNameEl = document.getElementById("leaderName");
const leaderScoreEl = document.getElementById("leaderScore");
const leaderboardEl = document.getElementById("leaderboard");
const playerNameInput = document.getElementById("playerName");
const startButton = document.getElementById("startButton");
const retryButton = document.getElementById("retryButton");
const backButton = document.getElementById("backButton");
const gameOverText = document.getElementById("gameOverText");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const quizScreen = document.getElementById("quizScreen");
const quizQuestionEl = document.getElementById("quizQuestion");
const quizAnswersEl = document.getElementById("quizAnswers");
const quizFeedbackEl = document.getElementById("quizFeedback");

const carButtons = Array.from(document.querySelectorAll(".car-option"));

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const LANES = [WIDTH * 0.3, WIDTH * 0.5, WIDTH * 0.7];
const STORAGE_KEY = "streetDropRacer.scores";
const PLAYER_KEY = "streetDropRacer.player";

const CAR_STYLES = {
  red: { body: "#ff6e63", roof: "#ffe7d4", accent: "#bf3753", glow: "rgba(255,110,99,0.3)", tank: "#8ae7ff" },
  blue: { body: "#61c8ff", roof: "#e8fbff", accent: "#426eff", glow: "rgba(97,200,255,0.3)", tank: "#b9f8ff" },
  green: { body: "#97e641", roof: "#f5ffd8", accent: "#12b58d", glow: "rgba(151,230,65,0.3)", tank: "#8df0ff" }
};

const DAY_PHASES = [
  { name: "ochtend", skyTop: "#8fc9f2", skyMid: "#e8f4ff", skyBottom: "#f8dfbf", sun: "#ffe4a8", celestialX: 150, celestialY: 92, night: false },
  { name: "middag", skyTop: "#69b8f5", skyMid: "#d5f0ff", skyBottom: "#f2e6c5", sun: "#fff0b8", celestialX: 300, celestialY: 78, night: false },
  { name: "avond", skyTop: "#4f7fc3", skyMid: "#f1b37d", skyBottom: "#f3d0a4", sun: "#ffbe6b", celestialX: 760, celestialY: 110, night: false },
  { name: "nacht", skyTop: "#081427", skyMid: "#19325a", skyBottom: "#273f66", sun: "#dde8ff", celestialX: 760, celestialY: 88, night: true }
];

const QUIZ_SCORE_STEP = 200;
const LEVEL_SCORE_STEP = 280;
const POWERUP_SCORE_STEP = 230;
const SIGN_TYPES = ["stop", "triangle", "forbidden", "parking", "turn"];
const POWERUP_TYPES = {
  shield: { color: "#6ddcff" },
  magnet: { color: "#ff88d8" },
  slow: { color: "#8fb7ff" },
  score: { color: "#ffd166" },
  pulse: { color: "#7ef29a" }
};
const QUIZ_QUESTIONS = [
  {
    question: "Wanneer is waterstof het best voor het milieu?",
    answers: ["Als het met groene stroom wordt gemaakt", "Als het uit aardgas wordt gemaakt", "Als het in een grotere auto zit"],
    correct: 0,
    explanation: "Groene waterstof uit zon of wind is het schoonst. Grijze waterstof geeft nog CO2-uitstoot."
  },
  {
    question: "Waarom moet een waterstoftank extra stevig zijn?",
    answers: ["Omdat waterstof onder hoge druk zit", "Omdat waterstof zwaarder is dan benzine", "Omdat de auto dan sneller rijdt"],
    correct: 0,
    explanation: "Waterstof wordt onder hoge druk opgeslagen. Daarom moet de tank extra sterk zijn."
  },
  {
    question: "Waarom is een lek van waterstof lastig te ontdekken?",
    answers: ["Omdat waterstof kleurloos en geurloos is", "Omdat waterstof blauw oplicht", "Omdat het alleen 's nachts lekt"],
    correct: 0,
    explanation: "Je ziet en ruikt waterstof niet. Daarom zijn sensoren belangrijk."
  },
  {
    question: "Wat kost het ongeveer om een benzineauto om te bouwen naar waterstof?",
    answers: ["Ongeveer 10.000 tot 15.000 euro", "Ongeveer 1.000 euro", "Meer dan 100.000 euro"],
    correct: 0,
    explanation: "Ombouwen is duur door aanpassingen aan motor, tank, leidingen en veiligheid."
  },
  {
    question: "Welke twee modellen zijn bekende waterstofauto's?",
    answers: ["Toyota Mirai en Hyundai Nexo", "Tesla Model 3 en Kia Picanto", "Volkswagen Golf en Opel Astra"],
    correct: 0,
    explanation: "De Toyota Mirai en Hyundai Nexo zijn bekende voorbeelden van waterstofauto's."
  },
  {
    question: "Hoe reken je waterstof meestal af bij het tanken?",
    answers: ["In kilo's", "In liters", "In ampere"],
    correct: 0,
    explanation: "Waterstof wordt afgerekend in kilo's, niet in liters."
  },
  {
    question: "Wat is een groot technisch probleem bij waterstofauto's?",
    answers: ["Waterstof veilig opslaan onder hoge druk", "Ruiten sneller laten drogen", "Extra ruimte maken voor een radio"],
    correct: 0,
    explanation: "Opslag onder hoge druk is een van de grootste technische uitdagingen."
  },
  {
    question: "Waarom is waterstof in Nederland nog niet voor iedereen aantrekkelijk?",
    answers: ["Auto's zijn duur en tankstations zijn schaars", "Waterstofauto's mogen niet op snelwegen", "Ze werken alleen in de zomer"],
    correct: 0,
    explanation: "De grootste rem zijn nu de hoge prijs en het kleine aantal tankstations."
  },
  {
    question: "Wat stoot een waterstofauto tijdens het rijden uit?",
    answers: ["Geen schadelijke uitlaatgassen tijdens het rijden", "Alleen een beetje dieselrook", "Meer CO2 dan benzine"],
    correct: 0,
    explanation: "Tijdens het rijden stoot een waterstofauto geen schadelijke uitlaatgassen uit."
  },
  {
    question: "Welke soort waterstof is minder goed voor het klimaat dan groene waterstof?",
    answers: ["Grijze waterstof", "Natte waterstof", "Zware waterstof"],
    correct: 0,
    explanation: "Grijze waterstof komt uit aardgas en zorgt nog voor CO2-uitstoot."
  },
  {
    question: "Van welk materiaal worden waterstoftanks vaak gemaakt?",
    answers: ["Koolstofvezel", "Hout", "Dun aluminiumfolie"],
    correct: 0,
    explanation: "Koolstofvezel is sterk genoeg om de tank veilig te houden."
  },
  {
    question: "Waarom is de kans op brand of explosie bij een waterstoflek vaak kleiner?",
    answers: ["Omdat waterstof snel opstijgt en zich verspreidt", "Omdat waterstof niet kan branden", "Omdat de tank vanzelf bevriest"],
    correct: 0,
    explanation: "Waterstof blijft minder lang hangen, omdat het snel opstijgt en verspreidt."
  },
  {
    question: "Waarom zijn nieuwe waterstofauto's nog duur?",
    answers: ["Er worden weinig gemaakt en de techniek is lastig", "Ze zijn gemaakt van dure metalen zoals goud", "Er bestaan alleen sportversies"],
    correct: 0,
    explanation: "De techniek is nieuw, lastig en wordt nog maar in kleine aantallen gebouwd."
  },
  {
    question: "Wat kost een nieuwe waterstofauto ongeveer?",
    answers: ["Tussen 70.000 en 80.000 euro", "Tussen 15.000 en 20.000 euro", "Meer dan 200.000 euro"],
    correct: 0,
    explanation: "Een nieuwe waterstofauto kost ongeveer 70.000 tot 80.000 euro."
  },
  {
    question: "Waarom is waterstof voor sommige autofabrikanten interessant?",
    answers: ["Tanken gaat snel en het stroomnet wordt minder belast", "Je hebt nooit meer banden nodig", "Waterstof is altijd gratis"],
    correct: 0,
    explanation: "Snel tanken en minder belasting van het stroomnet zijn belangrijke voordelen."
  },
  {
    question: "Voor welke voertuigen is waterstof extra interessant?",
    answers: ["Vrachtwagens en bussen", "Alleen scooters", "Alleen raceauto's"],
    correct: 0,
    explanation: "Waterstof is vooral interessant voor grotere voertuigen zoals bussen en vrachtwagens."
  },
  {
    question: "Wat gebeurt er in de brandstofcel van een waterstofauto?",
    answers: ["Waterstof en zuurstof maken samen elektriciteit", "Benzine wordt omgezet in waterstof", "Lucht wordt omgezet in diesel"],
    correct: 0,
    explanation: "In de brandstofcel levert de reactie van waterstof met zuurstof elektriciteit op."
  },
  {
    question: "Waarom moet de ontsteking bij een waterstofmotor goed worden afgesteld?",
    answers: ["Omdat waterstof sneller verbrandt dan benzine", "Omdat waterstof zwaarder is", "Omdat anders de radio uitvalt"],
    correct: 0,
    explanation: "Waterstof verbrandt sneller, dus de timing van de ontsteking moet kloppen."
  },
  {
    question: "Welke motoronderdelen slijten sneller door de hogere temperatuur?",
    answers: ["Cilinderkop en kleppen", "Stoelen en deuren", "Ruitenwissers"],
    correct: 0,
    explanation: "Door de hogere hitte slijten onderdelen zoals cilinderkop en kleppen sneller."
  },
  {
    question: "Wat is nodig voor een betere koeling van een waterstofmotor?",
    answers: ["Een grotere radiator of een aangepast koelsysteem", "Alleen koud water over de motorkap", "Minder motorolie en geen radiator"],
    correct: 0,
    explanation: "Meer hitte vraagt om betere koeling, zoals een grotere radiator."
  },
  {
    question: "Waarom moeten leidingen en kleppen bij waterstof aangepast worden?",
    answers: ["Omdat waterstof makkelijker kan ontsnappen", "Omdat waterstof banden leeg laat lopen", "Omdat waterstof de auto zwaarder maakt"],
    correct: 0,
    explanation: "Waterstof is moeilijker binnen te houden, dus leidingen en kleppen moeten beter afsluiten."
  },
  {
    question: "Hoe ver kun je ongeveer rijden op 1 kilo waterstof?",
    answers: ["Ongeveer 100 kilometer", "Ongeveer 10 kilometer", "Ongeveer 500 kilometer"],
    correct: 0,
    explanation: "Met 1 kilo waterstof kun je ongeveer 100 kilometer rijden."
  },
  {
    question: "Wat is een groot praktisch probleem van waterstof in Nederland?",
    answers: ["Er zijn nog maar weinig waterstoftankstations", "Je mag nergens parkeren met waterstof", "Waterstofauto's mogen alleen in dorpen rijden"],
    correct: 0,
    explanation: "Het kleine aantal tankstations maakt waterstof in de praktijk lastig."
  },
  {
    question: "Wat kan er in de toekomst gebeuren met auto's die nu nog op benzine rijden?",
    answers: ["Oprijden, ombouwen, inruilen of hergebruiken", "Direct allemaal slopen", "Alleen nog in musea zetten"],
    correct: 0,
    explanation: "Mogelijkheden zijn blijven rijden, ombouwen, inruilen of onderdelen hergebruiken."
  },
  {
    question: "Waarom kan ombouwen naar waterstof interessant zijn voor bezorgbussen?",
    answers: ["Omdat ze dan niet lang hoeven te wachten op laden", "Omdat bezorgbussen geen motor hebben", "Omdat ze alleen op waterstof mogen rijden"],
    correct: 0,
    explanation: "Waterstof kan handig zijn voor voertuigen die snel weer de weg op moeten."
  },
  {
    question: "Wat is nodig om waterstof economisch aantrekkelijker te maken?",
    answers: ["Auto's en waterstof moeten goedkoper worden", "Benzine moet morgen verboden worden", "Iedereen moet dezelfde auto kopen"],
    correct: 0,
    explanation: "Lagere prijzen zijn volgens jullie nodig om waterstof aantrekkelijker te maken."
  },
  {
    question: "Wat is belangrijk voor de toekomst van waterstofauto's?",
    answers: ["Meer tankstations, lagere prijzen en meer keuze", "Minder informatie over waterstof", "Alleen grote auto's verkopen"],
    correct: 0,
    explanation: "Meer tankstations, lagere prijzen en meer keuze maken waterstof aantrekkelijker."
  }
];

const state = {
  playerName: loadPlayerName(),
  selectedCar: "red",
  running: false,
  gameOver: false,
  paused: false,
  quizOpen: false,
  score: 0,
  level: 1,
  levelFlash: 0,
  lastLevelAnnounced: 1,
  speed: 300,
  distance: 0,
  spawnTimer: 1.8,
  stripeOffset: 0,
  lastTime: 0,
  warningDuration: 1,
  nextQuizScore: QUIZ_SCORE_STEP,
  nextPowerupScore: POWERUP_SCORE_STEP,
  shieldTime: 0,
  magnetTime: 0,
  slowTime: 0,
  scoreBoostTime: 0,
  pulseBlocks: 0,
  player: {
    lane: 1,
    targetLane: 1,
    hitFlash: 0,
    y: 0,
    vy: 0
  },
  obstacles: [],
  hydrogen: [],
  powerups: [],
  particles: [],
  warnings: []
};

function safeReadScores() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveScores(scores) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {
  }
}

function loadPlayerName() {
  try {
    return localStorage.getItem(PLAYER_KEY) || "";
  } catch {
    return "";
  }
}

function savePlayerName(name) {
  try {
    localStorage.setItem(PLAYER_KEY, name);
  } catch {
  }
}

function getLeaderboard() {
  return safeReadScores()
    .filter((entry) => entry && typeof entry.name === "string" && Number.isFinite(entry.score))
    .map((entry) => ({ name: entry.name.trim() || "Speler", score: Math.max(0, Math.floor(entry.score)) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function submitScore(name, score) {
  const scores = safeReadScores();
  scores.push({
    name: name.trim() || "Speler",
    score: Math.max(0, Math.floor(score))
  });
  scores.sort((a, b) => b.score - a.score);
  saveScores(scores.slice(0, 20));
}

function refreshLeaderboard() {
  const leaderboard = getLeaderboard();
  const best = leaderboard[0] || { name: "Nog niemand", score: 0 };

  leaderNameEl.textContent = best.name;
  leaderScoreEl.textContent = `${best.score} punten`;

  leaderboardEl.innerHTML = "";
  if (!leaderboard.length) {
    const item = document.createElement("li");
    item.className = "empty";
    item.textContent = "Nog geen scores opgeslagen";
    leaderboardEl.appendChild(item);
    return;
  }

  leaderboard.forEach((entry, index) => {
    const item = document.createElement("li");
    item.innerHTML = `<span>${index + 1}. ${entry.name}</span><strong>${entry.score}</strong>`;
    leaderboardEl.appendChild(item);
  });
}

function resetGame() {
  state.running = true;
  state.gameOver = false;
  state.paused = false;
  state.quizOpen = false;
  state.score = 0;
  state.level = 1;
  state.levelFlash = 0;
  state.lastLevelAnnounced = 1;
  state.speed = 300;
  state.distance = 0;
  state.spawnTimer = 1.8;
  state.stripeOffset = 0;
  state.player.lane = 1;
  state.player.targetLane = 1;
  state.player.hitFlash = 0;
  state.player.y = 0;
  state.player.vy = 0;
  state.nextQuizScore = QUIZ_SCORE_STEP;
  state.nextPowerupScore = POWERUP_SCORE_STEP;
  state.shieldTime = 0;
  state.magnetTime = 0;
  state.slowTime = 0;
  state.scoreBoostTime = 0;
  state.pulseBlocks = 0;
  state.obstacles = [];
  state.hydrogen = [];
  state.powerups = [];
  state.particles = [];
  state.warnings = [];
  quizScreen.classList.remove("visible");
  quizFeedbackEl.textContent = "";
  quizFeedbackEl.classList.remove("visible");
  updateHud();
}

function startGame() {
  const name = playerNameInput.value.trim();
  if (!name) {
    playerNameInput.focus();
    return;
  }

  state.playerName = name.slice(0, 18);
  savePlayerName(state.playerName);
  startScreen.classList.remove("visible");
  gameOverScreen.classList.remove("visible");
  resetGame();
}

function finishGame() {
  if (state.gameOver) return;
  state.running = false;
  state.gameOver = true;
  state.paused = false;
  state.quizOpen = false;
  state.player.hitFlash = 1;
  burstParticles(LANES[Math.round(state.player.lane)], HEIGHT - 92, "#ff8d8d", 34);
  submitScore(state.playerName, state.score);
  refreshLeaderboard();
  const leaderboard = getLeaderboard();
  const rank = leaderboard.findIndex((entry) => entry.name === state.playerName && entry.score === Math.floor(state.score));
  const topFiveText = rank >= 0 && rank < 5 ? ` Je staat nu in de top 5 op plek ${rank + 1}.` : "";
  gameOverText.textContent = `${state.playerName}, je score is ${Math.floor(state.score)} punten.${topFiveText}`;
  window.setTimeout(() => {
    gameOverScreen.classList.add("visible");
  }, 350);
}

function updateHud() {
  const leaderboard = getLeaderboard();
  currentPlayerEl.textContent = state.playerName || "-";
  scoreEl.textContent = Math.floor(state.score);
  levelEl.textContent = state.level;
  bestScoreEl.textContent = leaderboard[0] ? leaderboard[0].score : 0;
  pauseButton.textContent = state.paused ? "Verder" : "Pauze";
}

function getRandomQuestion() {
  return QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
}

function createObstacle(lane, type) {
  return {
    lane,
    x: LANES[lane],
    y: -80,
    width: 76,
    speed: 560 + Math.random() * 120 + state.speed * 0.38,
    type,
    sway: Math.random() * Math.PI * 2
  };
}

function createHydrogenCell(lane = Math.floor(Math.random() * 3)) {
  return {
    lane,
    x: LANES[lane],
    y: -30,
    size: 16,
    wobble: Math.random() * Math.PI * 2
  };
}

function createPowerup(lane, kind) {
  return {
    lane,
    kind,
    x: LANES[lane],
    y: -34,
    size: 19,
    wobble: Math.random() * Math.PI * 2
  };
}

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function openQuiz() {
  state.quizOpen = true;
  state.running = false;
  state.paused = false;
  const question = getRandomQuestion();
  quizQuestionEl.textContent = question.question;
  quizAnswersEl.innerHTML = "";
  quizFeedbackEl.textContent = "";
  quizFeedbackEl.classList.remove("visible");
  quizScreen.classList.add("visible");

  const options = shuffle(question.answers.map((answer, index) => ({
    answer,
    isCorrect: index === question.correct
  })));

  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-answer";
    button.innerHTML = `<span class="quiz-answer-key">${String.fromCharCode(65 + index)}</span><span class="quiz-answer-text">${option.answer}</span>`;
    button.addEventListener("click", () => answerQuiz(question, option.isCorrect, button));
    quizAnswersEl.appendChild(button);
  });
}

function answerQuiz(question, isCorrect, button) {
  const buttons = Array.from(quizAnswersEl.children);
  buttons.forEach((item) => {
    item.disabled = true;
    const answerText = item.querySelector(".quiz-answer-text")?.textContent;
    if (answerText === question.answers[question.correct]) {
      item.classList.add("correct");
    }
  });

  if (isCorrect) {
    state.score += 35;
    quizFeedbackEl.textContent = "Goed antwoord. Je krijgt 35 bonuspunten en 1 seconde bescherming.";
  } else {
    button.classList.add("wrong");
    quizFeedbackEl.textContent = `Niet goed. ${question.explanation}`;
  }
  quizFeedbackEl.classList.add("visible");

  state.nextQuizScore += QUIZ_SCORE_STEP;
  state.shieldTime = Math.max(state.shieldTime, 1);
  window.setTimeout(() => {
    quizScreen.classList.remove("visible");
    state.quizOpen = false;
    state.running = true;
  }, 1800);
}

function spawnPowerup() {
  const lane = shuffle([0, 1, 2])[0];
  const kinds = Object.keys(POWERUP_TYPES);
  const kind = kinds[Math.floor(Math.random() * kinds.length)];
  state.powerups.push(createPowerup(lane, kind));
}

function activatePowerup(kind) {
  if (kind === "shield") {
    state.shieldTime = Math.max(state.shieldTime, 8);
    return;
  }
  if (kind === "magnet") {
    state.magnetTime = Math.max(state.magnetTime, 8);
    return;
  }
  if (kind === "slow") {
    state.slowTime = Math.max(state.slowTime, 7);
    return;
  }
  if (kind === "score") {
    state.scoreBoostTime = Math.max(state.scoreBoostTime, 10);
    state.score += 20;
    return;
  }
  if (kind === "pulse") {
    state.obstacles.forEach((obstacle) => {
      burstParticles(obstacle.x, obstacle.y, "#7ef29a", 8);
    });
    state.obstacles = [];
    state.warnings = [];
    state.pulseBlocks = Math.max(state.pulseBlocks, 2);
  }
}

function spawnWarning() {
  const warningCount = state.level >= 3 ? 2 : 1;
  const lanes = shuffle([0, 1, 2]).slice(0, warningCount);
  lanes.forEach((lane) => {
    const type = SIGN_TYPES[Math.floor(Math.random() * SIGN_TYPES.length)];
    state.warnings.push({
      lane,
      type,
      timeLeft: state.warningDuration,
      spawned: false
    });
  });
}

function update(dt) {
  if (state.player.hitFlash > 0) {
    state.player.hitFlash = Math.max(0, state.player.hitFlash - dt * 3);
  }
  if (state.levelFlash > 0) {
    state.levelFlash = Math.max(0, state.levelFlash - dt);
  }

  if (state.shieldTime > 0) {
    state.shieldTime = Math.max(0, state.shieldTime - dt);
  }
  if (state.magnetTime > 0) {
    state.magnetTime = Math.max(0, state.magnetTime - dt);
  }
  if (state.slowTime > 0) {
    state.slowTime = Math.max(0, state.slowTime - dt);
  }
  if (state.scoreBoostTime > 0) {
    state.scoreBoostTime = Math.max(0, state.scoreBoostTime - dt);
  }

  if (!state.running || state.paused || state.quizOpen) {
    updateParticles(dt);
    return;
  }

  state.score += dt * (state.scoreBoostTime > 0 ? 28 : 18);
  state.level = 1 + Math.floor(state.score / LEVEL_SCORE_STEP);
  if (state.level > state.lastLevelAnnounced) {
    state.levelFlash = 2.2;
    state.lastLevelAnnounced = state.level;
  }
  state.speed += dt * 7;
  state.distance += dt * state.speed;
  state.stripeOffset = (state.stripeOffset + dt * state.speed * 0.45) % 80;

  if (state.score >= state.nextQuizScore) {
    openQuiz();
    updateHud();
    return;
  }

  if (state.score >= state.nextPowerupScore) {
    spawnPowerup();
    state.nextPowerupScore += POWERUP_SCORE_STEP;
  }

  if (!state.hydrogen.length && Math.random() < dt * 1.8) {
    state.hydrogen.push(createHydrogenCell());
  }

  state.spawnTimer -= dt;
  if (state.spawnTimer <= 0) {
    if (state.pulseBlocks > 0) {
      state.pulseBlocks -= 1;
    } else {
      spawnWarning();
    }
    state.spawnTimer = state.level >= 3
      ? Math.max(0.9, 1.45 - Math.min(0.35, state.score / 2600))
      : Math.max(1.15, 1.95 - Math.min(0.55, state.score / 2200));
  }

  const laneDiff = state.player.targetLane - state.player.lane;
  state.player.lane += laneDiff * Math.min(1, dt * 10);

  state.player.vy += 1500 * dt;
  state.player.y += state.player.vy * dt;
  if (state.player.y > 0) {
    state.player.y = 0;
    state.player.vy = 0;
  }

  const playerX = getPlayerX();
  const playerY = HEIGHT - 88 + state.player.y;

  state.warnings = state.warnings.filter((warning) => {
    warning.timeLeft -= dt;
    if (!warning.spawned && warning.timeLeft <= 0.4) {
      state.obstacles.push(createObstacle(warning.lane, warning.type));
      warning.spawned = true;
    }
    return warning.timeLeft > 0;
  });

  state.obstacles = state.obstacles.filter((obstacle) => {
    obstacle.y += obstacle.speed * (state.slowTime > 0 ? 0.38 : 1) * dt;
    obstacle.x = LANES[obstacle.lane] + Math.sin(state.distance * 0.005 + obstacle.sway) * 3;

    const hitX = Math.abs(obstacle.x - playerX) < 58;
    const hitY = Math.abs(obstacle.y - playerY) < 50;
    if (hitX && hitY && state.shieldTime <= 0) {
      finishGame();
      return false;
    }

    return obstacle.y < HEIGHT + 120;
  });

  state.hydrogen = state.hydrogen.filter((cell) => {
    const targetX = state.magnetTime > 0 ? playerX : LANES[cell.lane];
    cell.x += (targetX - cell.x) * Math.min(1, dt * (state.magnetTime > 0 ? 4.5 : 1));
    cell.y += 300 * dt;
    if (cell.y > HEIGHT + 40) return false;
    if (Math.abs(cell.x - playerX) < 42 && Math.abs(cell.y - playerY) < 40) {
      state.score += 5;
      burstParticles(cell.x, cell.y, "#8feeff", 6);
      return false;
    }
    return true;
  });

  state.powerups = state.powerups.filter((powerup) => {
    powerup.x = LANES[powerup.lane] + Math.sin(state.distance * 0.01 + powerup.wobble) * 5;
    powerup.y += 260 * dt;
    if (powerup.y > HEIGHT + 40) return false;
    if (Math.abs(powerup.x - playerX) < 44 && Math.abs(powerup.y - playerY) < 42) {
      activatePowerup(powerup.kind);
      burstParticles(powerup.x, powerup.y, POWERUP_TYPES[powerup.kind].color, 10);
      return false;
    }
    return true;
  });

  updateParticles(dt);
  updateHud();
}

function updateParticles(dt) {
  state.particles = state.particles.filter((particle) => {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.life -= dt;
    return particle.life > 0;
  });
}

function getPlayerX() {
  if (state.player.lane <= 0) return LANES[0];
  if (state.player.lane >= 2) return LANES[2];
  const leftIndex = Math.floor(state.player.lane);
  const rightIndex = Math.ceil(state.player.lane);
  const progress = state.player.lane - leftIndex;
  return LANES[leftIndex] + (LANES[rightIndex] - LANES[leftIndex]) * progress;
}

function burstParticles(x, y, color, amount) {
  for (let i = 0; i < amount; i += 1) {
    state.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 240,
      vy: (Math.random() - 0.5) * 240,
      life: 0.4 + Math.random() * 0.5,
      color
    });
  }
}

function draw() {
  drawSky();
  drawCity();
  drawRoad();
  drawSideRoadSigns();
  drawWarnings();
  drawRoadSignsShadow();
  drawHydrogen();
  drawPowerups();
  drawObstacles();
  drawPlayerCar();
  drawParticles();
  drawCanvasOverlay();
}

function drawSky() {
  const phase = DAY_PHASES[Math.floor(state.score / 700) % DAY_PHASES.length];
  const highLevelSky = state.level >= 8;
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  sky.addColorStop(0, highLevelSky ? "#120b2f" : phase.skyTop);
  sky.addColorStop(0.45, highLevelSky ? "#254b8f" : phase.skyMid);
  sky.addColorStop(1, highLevelSky ? "#f18f6c" : phase.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  if (highLevelSky) {
    const aura = ctx.createRadialGradient(WIDTH * 0.5, HEIGHT * 0.18, 30, WIDTH * 0.5, HEIGHT * 0.18, 280);
    aura.addColorStop(0, "rgba(255, 220, 150, 0.35)");
    aura.addColorStop(0.45, "rgba(122, 214, 255, 0.18)");
    aura.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  const bubbleDrift = state.distance * 0.03;
  for (let i = 0; i < 10; i += 1) {
    const x = (80 + i * 96 + bubbleDrift) % (WIDTH + 60) - 30;
    const y = 50 + (i * 37) % 170;
    ctx.fillStyle = highLevelSky ? "rgba(170, 235, 255, 0.18)" : phase.night ? "rgba(180,210,255,0.12)" : "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.arc(x, y, 10 + (i % 3) * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = highLevelSky ? "#ffe7a3" : phase.sun;
  ctx.beginPath();
  ctx.arc(phase.celestialX, phase.celestialY, 34, 0, Math.PI * 2);
  ctx.fill();

  if (phase.night && !highLevelSky) {
    ctx.fillStyle = "rgba(8, 20, 39, 0.42)";
    ctx.beginPath();
    ctx.arc(phase.celestialX + 10, phase.celestialY - 6, 28, 0, Math.PI * 2);
    ctx.fill();
  }

  if (highLevelSky) {
    for (let i = 0; i < 28; i += 1) {
      const starX = (i * 37 + 22) % WIDTH;
      const starY = 26 + (i * 31) % 180;
      const twinkle = 0.45 + Math.sin(state.distance * 0.02 + i) * 0.25;
      ctx.fillStyle = `rgba(255,255,255,${twinkle})`;
      ctx.fillRect(starX, starY, 2, 2);
    }

    for (let i = 0; i < 3; i += 1) {
      const ribbon = ctx.createLinearGradient(0, 0, WIDTH, 0);
      ribbon.addColorStop(0, "rgba(0, 0, 0, 0)");
      ribbon.addColorStop(0.35, `rgba(${i === 0 ? "118, 255, 237" : i === 1 ? "255, 169, 116" : "179, 130, 255"}, 0.16)`);
      ribbon.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = ribbon;
      ctx.beginPath();
      ctx.moveTo(0, 66 + i * 26);
      ctx.bezierCurveTo(WIDTH * 0.22, 42 + i * 30, WIDTH * 0.65, 106 + i * 18, WIDTH, 72 + i * 28);
      ctx.lineTo(WIDTH, 90 + i * 28);
      ctx.bezierCurveTo(WIDTH * 0.7, 120 + i * 18, WIDTH * 0.3, 60 + i * 24, 0, 92 + i * 20);
      ctx.closePath();
      ctx.fill();
    }
  } else if (phase.night) {
    ctx.fillStyle = "rgba(235, 244, 255, 0.8)";
    for (let i = 0; i < 24; i += 1) {
      ctx.fillRect((i * 41 + 18) % WIDTH, 30 + (i * 29) % 140, 2, 2);
    }
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.52)";
    for (let i = 0; i < 4; i += 1) {
      const cloudX = (120 + i * 220 - (state.distance * 0.02) % 250 + WIDTH) % (WIDTH + 140) - 70;
      const cloudY = 82 + (i % 2) * 32;
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, 26, Math.PI, 0);
      ctx.arc(cloudX + 28, cloudY, 22, Math.PI, 0);
      ctx.arc(cloudX - 30, cloudY + 4, 18, Math.PI, 0);
      ctx.fill();
    }
  }
}

function drawCity() {
  const phase = DAY_PHASES[Math.floor(state.score / 700) % DAY_PHASES.length];
  const horizon = HEIGHT - 190;

  ctx.fillStyle = phase.night ? "#4f6a4a" : "#7ca06f";
  ctx.fillRect(0, horizon - 10, WIDTH, 34);

  ctx.fillStyle = phase.night ? "#314053" : "#718391";
  for (let i = 0; i < 11; i += 1) {
    const x = ((i * 104) - (state.distance * 0.06) % 130 + WIDTH) % (WIDTH + 130) - 65;
    const w = 46 + (i % 3) * 18;
    const h = 58 + ((i * 21) % 75);
    ctx.fillRect(x, horizon - h, w, h);

    ctx.fillStyle = phase.night ? "rgba(255, 230, 156, 0.7)" : "rgba(233, 241, 248, 0.58)";
    for (let wy = 0; wy < h - 12; wy += 16) {
      for (let wx = 0; wx < w - 12; wx += 14) {
        if ((wx + wy + i) % 2 === 0) {
          ctx.fillRect(x + 6 + wx, horizon - h + 8 + wy, 5, 7);
        }
      }
    }
    ctx.fillStyle = phase.night ? "#314053" : "#718391";
  }

  ctx.fillStyle = phase.night ? "#355335" : "#496f43";
  for (let i = 0; i < 7; i += 1) {
    const x = ((i * 150) - (state.distance * 0.1) % 170 + WIDTH) % (WIDTH + 160) - 80;
    ctx.fillRect(x + 7, horizon - 8, 6, 34);
    ctx.beginPath();
    ctx.arc(x + 10, horizon - 20, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = phase.night ? "rgba(111, 153, 203, 0.18)" : "rgba(52, 129, 171, 0.22)";
  for (let i = 0; i < 7; i += 1) {
    const x = (i * 155 - state.distance * 0.05 + WIDTH) % (WIDTH + 120) - 60;
    roundRect(x, HEIGHT - 206, 72, 16, 8);
    ctx.fill();
  }
}

function drawRoad() {
  ctx.fillStyle = "#393d43";
  ctx.beginPath();
  ctx.moveTo(WIDTH * 0.16, HEIGHT);
  ctx.lineTo(WIDTH * 0.84, HEIGHT);
  ctx.lineTo(WIDTH * 0.64, HEIGHT * 0.24);
  ctx.lineTo(WIDTH * 0.36, HEIGHT * 0.24);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 4;
  [0.43, 0.57].forEach((lineX) => {
    ctx.beginPath();
    ctx.moveTo(WIDTH * lineX, HEIGHT);
    ctx.lineTo(WIDTH * (lineX + (lineX < 0.5 ? -0.06 : 0.06)), HEIGHT * 0.24);
    ctx.stroke();
  });

  ctx.strokeStyle = "#fff5c9";
  ctx.lineWidth = 5;
  for (let i = 0; i < 8; i += 1) {
    const y = HEIGHT - i * 88 + state.stripeOffset;
    ctx.beginPath();
    ctx.moveTo(WIDTH * 0.5, y);
    ctx.lineTo(WIDTH * 0.5, y - 42);
    ctx.stroke();
  }

  ctx.fillStyle = "#8f948f";
  ctx.beginPath();
  ctx.moveTo(0, HEIGHT);
  ctx.lineTo(WIDTH * 0.16, HEIGHT);
  ctx.lineTo(WIDTH * 0.36, HEIGHT * 0.24);
  ctx.lineTo(0, HEIGHT * 0.24);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(WIDTH, HEIGHT);
  ctx.lineTo(WIDTH * 0.84, HEIGHT);
  ctx.lineTo(WIDTH * 0.64, HEIGHT * 0.24);
  ctx.lineTo(WIDTH, HEIGHT * 0.24);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i += 1) {
    const edgeY = HEIGHT - i * 72 + state.stripeOffset * 0.8;
    ctx.beginPath();
    ctx.moveTo(WIDTH * 0.11, edgeY);
    ctx.lineTo(WIDTH * 0.15, edgeY - 18);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(WIDTH * 0.89, edgeY);
    ctx.lineTo(WIDTH * 0.85, edgeY - 18);
    ctx.stroke();
  }
}

function drawRoadSignsShadow() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  state.obstacles.forEach((obstacle) => {
    const size = obstacle.width;
    ctx.beginPath();
    ctx.ellipse(obstacle.x, HEIGHT - 24, size * 0.36, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawSideRoadSigns() {
  const horizon = HEIGHT * 0.24;
  const signOffset = (state.distance * 0.09) % 220;
  const leftSigns = [
    { x: 120, y: HEIGHT - 150, scale: 1.05, type: "arrow" },
    { x: 210, y: HEIGHT - 250, scale: 0.72, type: "triangle" }
  ];
  const rightSigns = [
    { x: WIDTH - 120, y: HEIGHT - 160, scale: 1.02, type: "forbidden" },
    { x: WIDTH - 210, y: HEIGHT - 265, scale: 0.7, type: "arrow" }
  ];

  [...leftSigns, ...rightSigns].forEach((sign, index) => {
    const drift = (index % 2 === 0 ? signOffset : signOffset * 0.75) % 220;
    const y = sign.y + drift;
    if (y < horizon + 30 || y > HEIGHT - 35) return;
    const scale = sign.scale + drift / 700;
    const poleHeight = 42 * scale;
    const poleWidth = 7 * scale;

    ctx.fillStyle = "#7b858f";
    roundRect(sign.x - poleWidth / 2, y, poleWidth, poleHeight, 3);
    ctx.fill();
    roundRect(sign.x - 10 * scale, y + poleHeight - 2, 20 * scale, 6 * scale, 3);
    ctx.fill();

    if (sign.type === "arrow") {
      drawRoadsideArrow(sign.x, y - 10 * scale, 16 * scale);
    } else if (sign.type === "triangle") {
      drawTriangleSign(sign.x, y - 10 * scale, 18 * scale);
    } else {
      drawForbiddenSign(sign.x, y - 10 * scale, 16 * scale);
    }
  });
}

function drawRoadsideArrow(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#f7fbff";
  ctx.fill();
  ctx.strokeStyle = "#d64545";
  ctx.lineWidth = Math.max(3, radius * 0.24);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y + radius * 0.48);
  ctx.lineTo(x - radius * 0.48, y - radius * 0.08);
  ctx.lineTo(x - radius * 0.16, y - radius * 0.08);
  ctx.lineTo(x - radius * 0.16, y - radius * 0.5);
  ctx.lineTo(x + radius * 0.16, y - radius * 0.5);
  ctx.lineTo(x + radius * 0.16, y - radius * 0.08);
  ctx.lineTo(x + radius * 0.48, y - radius * 0.08);
  ctx.closePath();
  ctx.fillStyle = "#20242a";
  ctx.fill();
}

function drawWarnings() {
  state.warnings.forEach((warning) => {
    const laneX = LANES[warning.lane];
    const alpha = Math.max(0.3, warning.timeLeft / state.warningDuration);
    const pulse = 0.72 + Math.sin(state.distance * 0.03 + warning.lane * 1.6) * 0.08;
    const topY = 82;
    const warningHeight = HEIGHT - topY;

    const laneGlow = ctx.createLinearGradient(0, topY, 0, topY + warningHeight);
    laneGlow.addColorStop(0, `rgba(255, 120, 120, ${0.2 * alpha * pulse})`);
    laneGlow.addColorStop(0.35, `rgba(255, 78, 78, ${0.32 * alpha * pulse})`);
    laneGlow.addColorStop(1, `rgba(185, 20, 20, ${0.18 * alpha})`);
    ctx.fillStyle = laneGlow;
    ctx.fillRect(laneX - 74, topY, 148, warningHeight);

    ctx.fillStyle = "#2a3038";
    roundRect(laneX - 52, 24, 104, 42, 14);
    ctx.fill();

    ctx.strokeStyle = `rgba(255, 220, 120, ${0.85 * alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#fff5c8";
    ctx.font = "bold 17px Orbitron";
    ctx.textAlign = "center";
    ctx.fillText("1 sec", laneX, 51);

    drawWarningArrowSign(laneX, 94, alpha);
  });
}

function drawWarningArrowSign(x, y, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;

  ctx.fillStyle = "#697580";
  roundRect(x - 4, y + 20, 8, 24, 3);
  ctx.fill();
  roundRect(x - 9, y + 42, 18, 6, 3);
  ctx.fill();

  ctx.fillStyle = "#f7fbff";
  ctx.beginPath();
  ctx.arc(x, y, 23, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#d64545";
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y + 13);
  ctx.lineTo(x - 11, y - 2);
  ctx.lineTo(x - 4, y - 2);
  ctx.lineTo(x - 4, y - 11);
  ctx.lineTo(x + 4, y - 11);
  ctx.lineTo(x + 4, y - 2);
  ctx.lineTo(x + 11, y - 2);
  ctx.closePath();
  ctx.fillStyle = "#20242a";
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.42)";
  ctx.beginPath();
  ctx.arc(x - 6, y - 8, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawObstacles() {
  state.obstacles.forEach((obstacle) => {
    ctx.fillStyle = "#6d7782";
    roundRect(obstacle.x - 5, obstacle.y + 28, 10, 64, 4);
    ctx.fill();

    if (obstacle.type === "stop") {
      drawStopSign(obstacle.x, obstacle.y, obstacle.width * 0.42);
    } else if (obstacle.type === "triangle") {
      drawTriangleSign(obstacle.x, obstacle.y, obstacle.width * 0.56);
    } else if (obstacle.type === "parking") {
      drawParkingSign(obstacle.x, obstacle.y, obstacle.width * 0.46);
    } else if (obstacle.type === "turn") {
      drawTurnSign(obstacle.x, obstacle.y, obstacle.width * 0.46);
    } else {
      drawForbiddenSign(obstacle.x, obstacle.y, obstacle.width * 0.42);
    }
  });
}

function drawHydrogen() {
  state.hydrogen.forEach((cell) => {
    const floatY = Math.sin(state.distance * 0.015 + cell.wobble + cell.y * 0.02) * 4;
    const x = cell.x + Math.cos(state.distance * 0.01 + cell.wobble) * 3;
    const y = cell.y + floatY;
    const grad = ctx.createLinearGradient(x - 12, y - 16, x + 12, y + 16);
    grad.addColorStop(0, "#dffcff");
    grad.addColorStop(0.45, "#86efff");
    grad.addColorStop(1, "#2ea6d8");
    ctx.shadowColor = "rgba(120, 235, 255, 0.65)";
    ctx.shadowBlur = 18;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x - 10, y - 14, 20, 28, 8);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.roundRect(x - 6, y - 10, 5, 12, 3);
    ctx.fill();

    ctx.fillStyle = "#0d3850";
    ctx.font = "bold 9px Orbitron";
    ctx.textAlign = "center";
    ctx.fillText("H2", x, y + 4);
  });
}

function drawPowerups() {
  state.powerups.forEach((powerup) => {
    const config = POWERUP_TYPES[powerup.kind];
    const x = powerup.x + Math.cos(state.distance * 0.012 + powerup.wobble) * 4;
    const y = powerup.y + Math.sin(state.distance * 0.018 + powerup.wobble) * 5;
    ctx.shadowColor = config.color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = config.color;
    ctx.beginPath();
    ctx.arc(x, y, powerup.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.62)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;
    drawPowerupIcon(powerup, x, y);
  });
}

function drawPowerupIcon(powerup, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = "#18202b";
  ctx.fillStyle = "#18202b";
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (powerup.kind === "shield") {
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(7, -4);
    ctx.lineTo(6, 4);
    ctx.quadraticCurveTo(0, 11, -6, 4);
    ctx.lineTo(-7, -4);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "rgba(24,32,43,0.16)";
    ctx.fill();
  } else if (powerup.kind === "magnet") {
    ctx.beginPath();
    ctx.moveTo(-6, -7);
    ctx.lineTo(-6, 2);
    ctx.quadraticCurveTo(0, 9, 6, 2);
    ctx.lineTo(6, -7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-6, -7);
    ctx.lineTo(-2, -7);
    ctx.moveTo(6, -7);
    ctx.lineTo(2, -7);
    ctx.stroke();
  } else if (powerup.kind === "slow") {
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -4);
    ctx.moveTo(0, 0);
    ctx.lineTo(4, 2);
    ctx.stroke();
  } else if (powerup.kind === "score") {
    ctx.font = "bold 13px Orbitron";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("+5", 0, 1);
  } else if (powerup.kind === "pulse") {
    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 3, Math.sin(angle) * 3);
      ctx.lineTo(Math.cos(angle) * 8, Math.sin(angle) * 8);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawStopSign(x, y, radius) {
  polygon(x, y, 8, radius);
  ctx.fillStyle = "#e53935";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 14px Orbitron";
  ctx.textAlign = "center";
  ctx.fillText("STOP", x, y + 5);
}

function drawTriangleSign(x, y, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y - radius);
  ctx.lineTo(x - radius * 0.9, y + radius * 0.8);
  ctx.lineTo(x + radius * 0.9, y + radius * 0.8);
  ctx.closePath();
  ctx.fillStyle = "#ffe066";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#222";
  ctx.stroke();
  ctx.fillStyle = "#222";
  ctx.font = "bold 26px Orbitron";
  ctx.fillText("!", x, y + 12);
}

function drawForbiddenSign(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.strokeStyle = "#ff4d4d";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.62, y + radius * 0.62);
  ctx.lineTo(x + radius * 0.62, y - radius * 0.62);
  ctx.stroke();
}

function drawParkingSign(x, y, radius) {
  roundRect(x - radius * 0.8, y - radius * 0.8, radius * 1.6, radius * 1.6, 8);
  ctx.fillStyle = "#2f7de1";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${Math.max(18, radius * 1.05)}px Orbitron`;
  ctx.textAlign = "center";
  ctx.fillText("P", x, y + radius * 0.35);
}

function drawTurnSign(x, y, radius) {
  roundRect(x - radius * 0.82, y - radius * 0.82, radius * 1.64, radius * 1.64, 8);
  ctx.fillStyle = "#1f56a8";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - radius * 0.35, y + radius * 0.2);
  ctx.lineTo(x + radius * 0.05, y + radius * 0.2);
  ctx.lineTo(x + radius * 0.05, y - radius * 0.18);
  ctx.lineTo(x + radius * 0.34, y - radius * 0.18);
  ctx.lineTo(x, y - radius * 0.56);
  ctx.lineTo(x - radius * 0.34, y - radius * 0.18);
  ctx.lineTo(x - radius * 0.1, y - radius * 0.18);
  ctx.lineTo(x - radius * 0.1, y - radius * 0.02);
  ctx.lineTo(x - radius * 0.35, y - radius * 0.02);
  ctx.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.fill();
}

function drawPlayerCar() {
  const style = CAR_STYLES[state.selectedCar];
  const x = getPlayerX();
  const y = HEIGHT - 92 + state.player.y;
  const tilt = (state.player.targetLane - state.player.lane) * 0.12;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.shadowColor = style.glow;
  ctx.shadowBlur = 24;

  const bodyGrad = ctx.createLinearGradient(-40, -18, 40, 18);
  bodyGrad.addColorStop(0, style.roof);
  bodyGrad.addColorStop(0.45, style.body);
  bodyGrad.addColorStop(1, style.accent);
  ctx.fillStyle = bodyGrad;
  roundRect(-44, -17, 88, 28, 12);
  ctx.fill();

  ctx.fillStyle = style.tank;
  roundRect(-10, -23, 20, 7, 4);
  ctx.fill();

  ctx.fillStyle = "rgba(21, 44, 62, 0.74)";
  roundRect(-18, -14, 36, 13, 7);
  ctx.fill();

  ctx.fillStyle = "#0f1720";
  ctx.beginPath();
  ctx.arc(-27, 15, 9, 0, Math.PI * 2);
  ctx.arc(27, 15, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#737d88";
  roundRect(-41, -2, 82, 7, 3);
  ctx.fill();

  ctx.fillStyle = "#ffefad";
  roundRect(-41, -8, 7, 5, 2);
  roundRect(34, -8, 7, 5, 2);
  ctx.fill();

  ctx.fillStyle = "#ff5d5d";
  roundRect(-39, 1, 6, 4, 2);
  roundRect(33, 1, 6, 4, 2);
  ctx.fill();

  ctx.fillStyle = "rgba(173, 246, 255, 0.92)";
  ctx.font = "bold 10px Orbitron";
  ctx.textAlign = "center";
  ctx.fillText("H2", 0, -18);

  ctx.strokeStyle = "rgba(144, 237, 255, 0.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(10, -20);
  ctx.lineTo(22, -30);
  ctx.lineTo(30, -24);
  ctx.stroke();

  if (state.player.hitFlash > 0) {
    ctx.strokeStyle = `rgba(255,255,255,${state.player.hitFlash})`;
    ctx.lineWidth = 4;
    ctx.strokeRect(-48, -26, 96, 58);
  }

  if (state.shieldTime > 0) {
    ctx.strokeStyle = "rgba(130, 233, 255, 0.85)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 58, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.beginPath();
  ctx.ellipse(0, 24, 42, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawParticles() {
  state.particles.forEach((particle) => {
    ctx.globalAlpha = Math.max(0, particle.life);
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, 4, 4);
  });
  ctx.globalAlpha = 1;
}

function drawCanvasOverlay() {
  const panel = ctx.createLinearGradient(18, 18, 320, 96);
  panel.addColorStop(0, "rgba(10, 22, 36, 0.9)");
  panel.addColorStop(1, "rgba(22, 45, 68, 0.82)");
  ctx.fillStyle = panel;
  roundRect(18, 18, 320, 88, 22);
  ctx.fill();

  ctx.strokeStyle = "rgba(143, 220, 255, 0.28)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 210, 110, 0.95)";
  ctx.font = "bold 12px Orbitron";
  ctx.textAlign = "left";
  ctx.fillText("ROAD RUSH TIP", 34, 42);

  ctx.fillStyle = "#edf7ff";
  ctx.font = "bold 16px Rubik";
  ctx.fillText("Ontwijk de borden", 34, 65);

  ctx.fillStyle = "#bfe7ff";
  ctx.font = "15px Rubik";
  ctx.fillText("Maak de quiz goed voor 35 bonuspunten", 34, 88);

  const activeEffects = [];
  if (state.shieldTime > 0) activeEffects.push("Shield");
  if (state.magnetTime > 0) activeEffects.push("Magnet");
  if (state.slowTime > 0) activeEffects.push("Slow");
  if (state.scoreBoostTime > 0) activeEffects.push("Score+");
  if (activeEffects.length) {
    ctx.fillStyle = "rgba(18, 31, 46, 0.88)";
    roundRect(18, 112, 250, 36, 16);
    ctx.fill();
    ctx.fillStyle = "#8feeff";
    ctx.font = "13px Rubik";
    ctx.textAlign = "left";
    ctx.fillText(`Actief: ${activeEffects.join(", ")}`, 30, 135);
  }

  ctx.fillStyle = "rgba(120, 228, 255, 0.18)";
  roundRect(282, 34, 38, 38, 12);
  ctx.fill();

  ctx.strokeStyle = "rgba(120, 228, 255, 0.42)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#8ff0ff";
  ctx.font = "bold 14px Orbitron";
  ctx.textAlign = "center";
  ctx.fillText("H2", 301, 58);

  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.arc(314, 32, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.arc(328, 92, 10, 0, Math.PI * 2);
  ctx.fill();

  const scorePanel = ctx.createLinearGradient(WIDTH - 214, 18, WIDTH - 18, 82);
  scorePanel.addColorStop(0, "rgba(12, 24, 39, 0.92)");
  scorePanel.addColorStop(1, "rgba(28, 52, 76, 0.84)");
  ctx.fillStyle = scorePanel;
  roundRect(WIDTH - 214, 18, 196, 64, 20);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 214, 120, 0.26)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255, 214, 120, 0.95)";
  ctx.font = "bold 12px Orbitron";
  ctx.fillText("SCORE", WIDTH - 34, 40);

  ctx.fillStyle = "#f4fbff";
  ctx.font = "bold 24px Orbitron";
  ctx.fillText(Math.floor(state.score), WIDTH - 34, 68);

  if (state.levelFlash > 0) {
    const alpha = Math.min(1, state.levelFlash);
    ctx.fillStyle = `rgba(6, 14, 28, ${0.28 * alpha})`;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.textAlign = "center";
    ctx.fillStyle = `rgba(255, 225, 155, ${0.95 * alpha})`;
    ctx.font = "bold 18px Orbitron";
    ctx.fillText(`LEVEL ${state.level}`, WIDTH / 2, 108);

    ctx.fillStyle = `rgba(244, 251, 255, ${0.92 * alpha})`;
    ctx.font = "bold 40px Orbitron";
    ctx.fillText(state.level >= 8 ? "SKY UNLOCKED" : "LEVEL UP", WIDTH / 2, 148);

    ctx.fillStyle = `rgba(155, 233, 255, ${0.85 * alpha})`;
    ctx.font = "16px Rubik";
    ctx.fillText(
      state.level >= 8 ? "Je hebt de speciale lucht vrijgespeeld" : "De game wordt nu een stukje moeilijker",
      WIDTH / 2,
      176
    );
  }

  if (state.paused) {
    ctx.fillStyle = "rgba(4, 10, 18, 0.5)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "#f4f8ff";
    ctx.font = "bold 42px Orbitron";
    ctx.textAlign = "center";
    ctx.fillText("GEPAUZEERD", WIDTH / 2, HEIGHT / 2 - 10);
    ctx.font = "18px Rubik";
    ctx.fillText("Druk op Esc of op de knop om verder te gaan", WIDTH / 2, HEIGHT / 2 + 28);
  }
}

function polygon(x, y, points, radius) {
  ctx.beginPath();
  for (let i = 0; i < points; i += 1) {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / points;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function gameLoop(timestamp) {
  if (!state.lastTime) state.lastTime = timestamp;
  const dt = Math.min(0.033, (timestamp - state.lastTime) / 1000);
  state.lastTime = timestamp;
  update(dt);
  draw();
  requestAnimationFrame(gameLoop);
}

function moveLeft() {
  if (!state.running) return;
  state.player.targetLane = Math.max(0, state.player.targetLane - 1);
}

function moveRight() {
  if (!state.running) return;
  state.player.targetLane = Math.min(2, state.player.targetLane + 1);
}

function jump() {
  if (!state.running || state.paused || state.gameOver) return;
  if (state.player.y >= -2 && Math.abs(state.player.vy) < 20) {
    state.player.vy = -720;
  }
}

function togglePause() {
  if ((!state.running && !state.paused) || state.gameOver || state.quizOpen) return;
  state.paused = !state.paused;
  state.running = !state.paused;
  updateHud();
}

carButtons.forEach((button) => {
  button.addEventListener("click", () => {
    carButtons.forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    state.selectedCar = button.dataset.car;
  });
});

playerNameInput.value = state.playerName;

startButton.addEventListener("click", startGame);
retryButton.addEventListener("click", () => {
  gameOverScreen.classList.remove("visible");
  resetGame();
});
backButton.addEventListener("click", () => {
  gameOverScreen.classList.remove("visible");
  startScreen.classList.add("visible");
  state.running = false;
  state.gameOver = false;
  state.paused = false;
  state.quizOpen = false;
  state.score = 0;
  updateHud();
});

pauseButton.addEventListener("click", togglePause);

window.addEventListener("keydown", (event) => {
  const isNameInput = document.activeElement === playerNameInput;
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
  }
  if (event.key === "Escape") {
    event.preventDefault();
    togglePause();
    return;
  }
  if (!isNameInput && (event.key === "ArrowUp" || event.key === " ")) {
    event.preventDefault();
    jump();
  }
  if (!isNameInput && (event.key === "ArrowLeft" || event.key.toLowerCase() === "a")) moveLeft();
  if (!isNameInput && (event.key === "ArrowRight" || event.key.toLowerCase() === "d")) moveRight();
});

refreshLeaderboard();
updateHud();
draw();
requestAnimationFrame(gameLoop);
