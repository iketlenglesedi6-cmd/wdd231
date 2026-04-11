const navToggle = document.querySelector(".tog");
const navLinks = document.querySelector(".links");
const tagButtons = document.querySelectorAll(".tag-btn");
const intentionInput = document.querySelector("#intentionInput");
const lightButton = document.querySelector("#lightCandle");
const candlesGrid = document.querySelector("#candlesGrid");
const countNum = document.querySelector("#countNum");
const modalOverlay = document.querySelector("#modalOverlay");
const closeModalButton = document.querySelector("#closeModal");

const STORAGE_KEY = "caya-candles";
let selectedTag = "";
let candles = [];

const tagVerses = {
  Hope: { q: '"For I know the plans I have for you, declares the Lord, plans to give you hope and a future."', ref: "Jeremiah 29:11" },
  Peace: { q: '"Peace I leave with you; my peace I give you. Do not let your hearts be troubled and do not be afraid."', ref: "John 14:27" },
  Healing: { q: '"He heals the brokenhearted and binds up their wounds."', ref: "Psalm 147:3" },
  Strength: { q: '"I can do all this through him who gives me strength."', ref: "Philippians 4:13" },
  Grief: { q: '"Blessed are those who mourn, for they will be comforted."', ref: "Matthew 5:4" },
  Gratitude: { q: '"Give thanks in all circumstances."', ref: "1 Thessalonians 5:18" },
  Courage: { q: '"Be strong and courageous. Do not be afraid."', ref: "Joshua 1:9" },
  "Someone I love": { q: '"The Lord bless you and keep you; the Lord make his face shine on you."', ref: "Numbers 6:24-25" },
  default: { q: '"The Lord is my light and my salvation - whom shall I fear?"', ref: "Psalm 27:1" }
};

const roomVerses = [
  { q: '"The Lord is my light and my salvation - whom shall I fear?"', ref: "Psalm 27:1" },
  { q: '"And the Lord went before them by night in a pillar of fire, to give them light."', ref: "Exodus 13:21" },
  { q: '"Thy word is a lamp unto my feet, and a light unto my path."', ref: "Psalm 119:105" },
  { q: '"Arise, shine; for thy light is come."', ref: "Isaiah 60:1" },
  { q: '"I am the light of the world."', ref: "John 8:12" }
];

let roomVerseIndex = 0;

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

function updateRoomVerse() {
  const verse = roomVerses[roomVerseIndex];
  document.querySelector("#roomVerse").textContent = verse.q;
  document.querySelector("#roomVerseRef").textContent = verse.ref;
  roomVerseIndex = (roomVerseIndex + 1) % roomVerses.length;
}

function loadCandles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    candles = raw ? JSON.parse(raw) : [];
  } catch (error) {
    candles = [];
  }
}

function saveCandles() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candles));
  } catch (error) {
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function closeModal() {
  modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

function openModal(candle) {
  const verse = tagVerses[candle.tag] || tagVerses.default;
  document.querySelector("#modalIntention").textContent = `"${candle.intention}"`;
  document.querySelector("#modalTag").textContent = candle.tag;
  document.querySelector("#modalVerse").textContent = verse.q;
  document.querySelector("#modalVerseRef").textContent = verse.ref;
  document.querySelector("#modalTime").textContent = `Lit at ${candle.time} · ${candle.date}`;
  modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function renderCandles() {
  countNum.textContent = candles.length;

  if (candles.length === 0) {
    candlesGrid.innerHTML = '<div class="empty-room"><p>No candles have been lit yet.<br>Yours will be the first flame in this room.</p></div>';
    return;
  }

  candlesGrid.innerHTML = candles.map((candle, index) => `
    <article class="candle-item" style="animation-delay:${Math.min(index * 0.06, 1.2)}s" tabindex="0">
      <div class="flame-wrap">
        <svg class="flame-svg" width="28" height="44" viewBox="0 0 28 44" overflow="visible" aria-hidden="true">
          <ellipse cx="14" cy="43" rx="9" ry="3.5" fill="rgba(254,218,134,0.15)"/>
          <path class="flame-outer" d="M14,3 C17,9 21,16 21,24 C21,34 18,39 14,42 C10,39 7,34 7,24 C7,16 11,9 14,3Z" fill="#e8a030" opacity=".75"/>
          <path class="flame-inner" d="M14,10 C16,15 18,20 18,25 C18,32 16,37 14,40 C12,37 10,32 10,25 C10,20 12,15 14,10Z" fill="#feda86"/>
        </svg>
        <div class="candle-glow"></div>
      </div>
      <div class="candle-body" style="height:${candle.height}px">
        ${candle.drip ? '<div class="candle-drip" style="left:4px;width:5px;height:10px"></div>' : ""}
      </div>
      <div class="candle-base"></div>
      <div class="candle-label">${escapeHtml(candle.intention.substring(0, 36))}${candle.intention.length > 36 ? "..." : ""}</div>
      <div class="candle-tag-pill">${escapeHtml(candle.tag)}</div>
    </article>
  `).join("");

  candlesGrid.querySelectorAll(".candle-item").forEach((item, index) => {
    const candle = candles[index];
    item.addEventListener("click", () => openModal(candle));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(candle);
      }
    });
  });
}

function lightCandle() {
  const text = intentionInput.value.trim();

  if (!text) {
    intentionInput.focus();
    intentionInput.style.borderColor = "rgba(254,218,134,0.5)";
    window.setTimeout(() => {
      intentionInput.style.borderColor = "";
    }, 1200);
    return;
  }

  const candle = {
    id: Date.now(),
    intention: text,
    tag: selectedTag || "Prayer",
    time: new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }),
    date: new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "short" }),
    height: 48 + Math.floor(Math.random() * 24),
    drip: Math.random() > 0.5
  };

  candles.unshift(candle);

  if (candles.length > 60) {
    candles = candles.slice(0, 60);
  }

  saveCandles();
  intentionInput.value = "";
  selectedTag = "";
  tagButtons.forEach((button) => button.classList.remove("on"));
  renderCandles();
  openModal(candle);
}

tagButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (selectedTag === button.dataset.tag) {
      selectedTag = "";
      button.classList.remove("on");
      return;
    }

    selectedTag = button.dataset.tag;
    tagButtons.forEach((item) => item.classList.remove("on"));
    button.classList.add("on");
  });
});

if (lightButton) {
  lightButton.addEventListener("click", () => {
    lightCandle();
  });
}

if (closeModalButton) {
  closeModalButton.addEventListener("click", () => {
    closeModal();
  });
}

if (modalOverlay) {
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

loadCandles();
renderCandles();
updateRoomVerse();
window.setInterval(updateRoomVerse, 14000);
