const navToggle = document.querySelector(".tog");
const navLinks = document.querySelector(".links");
const patternButtons = document.querySelectorAll(".pat-btn");
const breathCircle = document.querySelector("#breathCircle");
const phaseWord = document.querySelector("#phaseWord");
const phaseCount = document.querySelector("#phaseCount");
const startButton = document.querySelector("#startBtn");
const startButtonText = document.querySelector("#startBtnText");
const verseCard = document.querySelector("#verseCard");
const verseQ = document.querySelector("#verseQ");
const verseRef = document.querySelector("#verseRef");
const verseNote = document.querySelector("#verseNote");
const cycleCount = document.querySelector("#cycleCount");
const sessionMin = document.querySelector("#sessionMin");
const totalSessions = document.querySelector("#totalSessions");
const completeBanner = document.querySelector("#completeBanner");
const completeBannerText = document.querySelector("#completeBannerText");
const gr1 = document.querySelector("#gr1");
const gr2 = document.querySelector("#gr2");
const gr3 = document.querySelector("#gr3");

const patterns = {
  box: { phases: [4, 4, 4, 4], labels: ["Breathe in", "Hold", "Breathe out", "Hold"] },
  calm: { phases: [4, 7, 8, 0], labels: ["Breathe in", "Hold", "Breathe out", ""] },
  gentle: { phases: [5, 2, 5, 0], labels: ["Breathe in", "Hold", "Breathe out", ""] },
  rest: { phases: [6, 0, 6, 0], labels: ["Breathe in", "", "Breathe out", ""] }
};

const verses = [
  { q: '"Be still, and know that I am God."', ref: "Psalm 46:10", note: "Hold this verse gently as you breathe. You do not have to do anything with it." },
  { q: '"He gives strength to the weary and increases the power of the weak."', ref: "Isaiah 40:29", note: "Let your exhale carry what is heavy. Let your inhale receive what is new." },
  { q: '"Come to me, all who are weary and burdened, and I will give you rest."', ref: "Matthew 11:28", note: "Each breath is an act of trust. You are not doing this alone." },
  { q: '"The Lord is my shepherd; I shall not want. He makes me lie down in green pastures."', ref: "Psalm 23:1-2", note: "Green pastures. Still waters. This moment is that place." },
  { q: '"Do not be anxious about anything, but in every situation, present your requests to God. And the peace of God will guard your hearts."', ref: "Philippians 4:6-7", note: "Your breath is a prayer. Your stillness is worship." },
  { q: '"In returning and rest you shall be saved; in quietness and trust shall be your strength."', ref: "Isaiah 30:15", note: "Quietness is not emptiness. It is the fullest kind of presence." },
  { q: '"The Lord will fight for you; you need only to be still."', ref: "Exodus 14:14", note: "You do not have to carry this. You only have to breathe." },
  { q: '"I will both lie down and sleep in peace, for you alone, Lord, make me dwell in safety."', ref: "Psalm 4:8", note: "Peace is not something you achieve. It is something you receive." }
];

let currentPattern = "box";
let isRunning = false;
let phaseIndex = 0;
let countdown = 0;
let cyclesDone = 0;
let sessionSeconds = 0;
let sessionTimer = null;
let breathTimer = null;
let verseIndex = 0;

let stats = { totalCycles: 0, totalSessions: 0, todayCycles: 0, todayDate: "" };

try {
  const raw = localStorage.getItem("caya-breath");
  if (raw) {
    stats = { ...stats, ...JSON.parse(raw) };
  }
  const today = new Date().toDateString();
  if (stats.todayDate !== today) {
    stats.todayCycles = 0;
    stats.todayDate = today;
  }
} catch (error) {
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

function saveStats() {
  try {
    localStorage.setItem("caya-breath", JSON.stringify(stats));
  } catch (error) {
  }
}

function updateStatDisplay() {
  cycleCount.textContent = stats.todayCycles;
  totalSessions.textContent = stats.totalSessions;
  sessionMin.textContent = Math.floor(sessionSeconds / 60);
}

function setCircleToRest() {
  breathCircle.style.transition = "transform 1.2s ease";
  gr1.style.transition = "transform 1.2s ease, opacity 1.2s ease";
  gr2.style.transition = "transform 1.4s ease";
  gr3.style.transition = "transform 1.6s ease";
  breathCircle.style.transform = "scale(1)";
  gr1.style.transform = "scale(1)";
  gr1.style.opacity = "0.5";
  gr2.style.transform = "scale(1)";
  gr3.style.transform = "scale(1)";
  phaseWord.textContent = "Begin";
  phaseCount.textContent = "";
}

function animateCircle(phase, duration) {
  const ms = duration * 1000;
  const ease = phase === 0 ? "cubic-bezier(0.4,0,0.2,1)" : phase === 2 ? "cubic-bezier(0.4,0,0.6,1)" : "linear";

  breathCircle.style.transition = `transform ${ms}ms ${ease}`;
  gr1.style.transition = `transform ${ms}ms ${ease}, opacity ${ms}ms ${ease}`;
  gr2.style.transition = `transform ${ms * 1.1}ms ${ease}`;
  gr3.style.transition = `transform ${ms * 1.2}ms ${ease}`;

  if (phase === 0) {
    breathCircle.style.transform = "scale(1.38)";
    gr1.style.transform = "scale(1.3)";
    gr1.style.opacity = "1";
    gr2.style.transform = "scale(1.22)";
    gr3.style.transform = "scale(1.1)";
  } else if (phase === 2) {
    breathCircle.style.transform = "scale(1)";
    gr1.style.transform = "scale(1)";
    gr1.style.opacity = "0.4";
    gr2.style.transform = "scale(1)";
    gr3.style.transform = "scale(1)";
  }
}

function updatePhaseUI(label, count) {
  phaseWord.style.opacity = "0";
  window.setTimeout(() => {
    phaseWord.textContent = label;
    phaseWord.style.opacity = "1";
  }, 150);
  phaseCount.textContent = count;
}

function nextVerse() {
  verseIndex = (verseIndex + 1) % verses.length;
  const verse = verses[verseIndex];
  verseCard.style.opacity = "0";
  window.setTimeout(() => {
    verseQ.textContent = verse.q;
    verseRef.textContent = verse.ref;
    verseNote.textContent = verse.note;
    verseCard.style.opacity = "1";
  }, 500);
}

function showComplete(message) {
  completeBannerText.textContent = message;
  completeBanner.classList.add("show");
  window.setTimeout(() => {
    completeBanner.classList.remove("show");
  }, 4000);
}

function runPhase() {
  if (!isRunning) {
    return;
  }

  const pattern = patterns[currentPattern];

  while (pattern.phases[phaseIndex] === 0 && phaseIndex < pattern.phases.length) {
    phaseIndex = (phaseIndex + 1) % pattern.phases.length;
  }

  const duration = pattern.phases[phaseIndex];
  const label = pattern.labels[phaseIndex];
  countdown = duration;

  animateCircle(phaseIndex, duration);
  updatePhaseUI(label, countdown);

  const tick = () => {
    if (!isRunning) {
      return;
    }

    countdown -= 1;
    phaseCount.textContent = countdown > 0 ? countdown : "";

    if (countdown <= 0) {
      phaseIndex = (phaseIndex + 1) % pattern.phases.length;

      if (phaseIndex === 0) {
        cyclesDone += 1;
        stats.todayCycles += 1;
        stats.totalCycles += 1;
        saveStats();
        updateStatDisplay();

        if (cyclesDone % 3 === 0) {
          nextVerse();
        }
      }

      runPhase();
    } else {
      breathTimer = window.setTimeout(tick, 1000);
    }
  };

  breathTimer = window.setTimeout(tick, 1000);
}

function startBreath() {
  isRunning = true;
  phaseIndex = 0;
  cyclesDone = 0;
  startButtonText.textContent = "Pause";
  stats.totalSessions += 1;
  saveStats();
  updateStatDisplay();
  sessionTimer = window.setInterval(() => {
    sessionSeconds += 1;
    updateStatDisplay();
  }, 1000);
  runPhase();
}

function stopBreath() {
  isRunning = false;
  window.clearTimeout(breathTimer);
  window.clearInterval(sessionTimer);
  startButtonText.textContent = "Begin breathing";
  setCircleToRest();
  showComplete(`You breathed through ${cyclesDone} cycle${cyclesDone !== 1 ? "s" : ""}. Carry this stillness with you.`);
}

patternButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (isRunning) {
      return;
    }

    currentPattern = button.dataset.key;
    patternButtons.forEach((item) => item.classList.remove("on"));
    button.classList.add("on");
    phaseIndex = 0;
    countdown = 0;
    setCircleToRest();
  });
});

if (startButton) {
  startButton.addEventListener("click", () => {
    if (isRunning) {
      stopBreath();
    } else {
      startBreath();
    }
  });
}

updateStatDisplay();
setCircleToRest();
