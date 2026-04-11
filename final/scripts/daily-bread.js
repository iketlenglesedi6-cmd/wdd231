const navToggle = document.querySelector(".tog");
const navLinks = document.querySelector(".links");
const reveals = document.querySelectorAll(".reveal");
const saveTodayButton = document.querySelector("#saveToday");
const saveFromModalButton = document.querySelector("#saveFromModal");
const closeModalButton = document.querySelector("#closeModal");
const modalOverlay = document.querySelector("#modalOverlay");

const library = [
  { q: '"Be still, and know that I am God."', ref: "Psalm 46:10", r: "Let today begin in stillness. You do not have to carry yesterday into this morning." },
  { q: '"Come to me, all who are weary and burdened, and I will give you rest."', ref: "Matthew 11:28", r: "Rest is not earned. It is offered freely. You only have to come." },
  { q: '"The Lord is my shepherd; I shall not want."', ref: "Psalm 23:1", r: "When you are led by a shepherd, you do not need to know the path. You only need to follow." },
  { q: '"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you."', ref: "Jeremiah 29:11", r: "Your story is not finished. The hardest chapters are not the last ones." },
  { q: '"I can do all this through him who gives me strength."', ref: "Philippians 4:13", r: "Not strength you manufacture. Strength that is given, when you need it, as you need it." },
  { q: '"He heals the brokenhearted and binds up their wounds."', ref: "Psalm 147:3", r: "Broken things are not discarded here. They are gathered and tended." },
  { q: '"Trust in the Lord with all your heart and lean not on your own understanding."', ref: "Proverbs 3:5", r: "Understanding will come. For now, trust is enough." },
  { q: '"The Lord is close to the brokenhearted and saves those who are crushed in spirit."', ref: "Psalm 34:18", r: "He is not distant from your worst moments. He is nearest there." },
  { q: '"Do not be anxious about anything, but in every situation present your requests to God."', ref: "Philippians 4:6", r: "Every worry is a prayer waiting to happen. You are allowed to hand it over." },
  { q: '"Your word is a lamp for my feet, a light on my path."', ref: "Psalm 119:105", r: "You do not need to see the whole road. The light is enough for the next step." },
  { q: '"Cast all your anxiety on him because he cares for you."', ref: "1 Peter 5:7", r: "He cares for you, not your performance, not your progress. You." },
  { q: '"Draw near to God and he will draw near to you."', ref: "James 4:8", r: "Even one step toward Him counts. Even this moment counts." },
  { q: '"Peace I leave with you; my peace I give you. Do not let your hearts be troubled."', ref: "John 14:27", r: "The peace being offered is not the absence of trouble. It is a presence greater than the trouble." },
  { q: '"The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you."', ref: "Numbers 6:24-25", r: "Let this be a blessing over your day before it has even begun." },
  { q: '"Be strong and courageous. Do not be afraid; the Lord your God will be with you wherever you go."', ref: "Joshua 1:9", r: "Wherever you go today, you are not going alone." },
  { q: '"Blessed are those who mourn, for they will be comforted."', ref: "Matthew 5:4", r: "Your grief does not disqualify you from comfort. It is the very doorway to it." },
  { q: '"He gives strength to the weary and increases the power of the weak."', ref: "Isaiah 40:29", r: "Weakness is not the end of the story. It is where the gift begins." },
  { q: '"I am the light of the world. Whoever follows me will never walk in darkness."', ref: "John 8:12", r: "You are not walking blind. Even when it feels that way, there is a light ahead." },
  { q: '"The Lord will fight for you; you need only to be still."', ref: "Exodus 14:14", r: "Some battles are not yours to fight. Your only job today may be to stand and let Him work." },
  { q: '"In returning and rest you shall be saved; in quietness and trust shall be your strength."', ref: "Isaiah 30:15", r: "Quiet trust is a form of strength." },
  { q: '"Weeping may stay for the night, but rejoicing comes in the morning."', ref: "Psalm 30:5", r: "Morning comes. It always comes. Hold on through the night." },
  { q: '"Create in me a pure heart, O God, and renew a steadfast spirit within me."', ref: "Psalm 51:10", r: "You do not have to clean yourself up before asking for renewal." },
  { q: '"Are not five sparrows sold for two pennies? Yet not one of them is forgotten by God."', ref: "Luke 12:6", r: "If not one sparrow is forgotten, you are not forgotten." },
  { q: '"Give thanks in all circumstances; for this is God\'s will for you in Christ Jesus."', ref: "1 Thessalonians 5:18", r: "Gratitude is not denial of pain. It is choosing to look for light inside it." },
  { q: '"The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you."', ref: "Zephaniah 3:17", r: "He delights in you, right now." },
  { q: '"I will both lie down and sleep in peace, for you alone, Lord, make me dwell in safety."', ref: "Psalm 4:8", r: "Peace is something you receive when you stop holding everything yourself." },
  { q: '"Come, all you who are thirsty, come to the waters; and you who have no money, come, buy and eat!"', ref: "Isaiah 55:1", r: "You do not have to earn what is freely given." },
  { q: '"My grace is sufficient for you, for my power is made perfect in weakness."', ref: "2 Corinthians 12:9", r: "Your weakness is not disqualifying. It is where grace is most at home." },
  { q: '"The Lord is my light and my salvation - whom shall I fear?"', ref: "Psalm 27:1", r: "You are lit from within by something that cannot be taken." },
  { q: '"Arise, shine; for thy light is come, and the glory of the Lord is risen upon thee."', ref: "Isaiah 60:1", r: "Rise because the light has already come to you." },
  { q: '"Ask and it will be given to you; seek and you will find; knock and the door will be opened."', ref: "Matthew 7:7", r: "The asking is not a test of worthiness. It is an act of trust." },
  { q: '"He restores my soul. He guides me along the right paths for his name\'s sake."', ref: "Psalm 23:3", r: "Restoration is a process. You are already in it." },
  { q: '"For God so loved the world that he gave his one and only Son."', ref: "John 3:16", r: "This love is still reaching for you today." },
  { q: '"The steadfast love of the Lord never ceases; his mercies never come to an end. They are new every morning."', ref: "Lamentations 3:22-23", r: "Whatever yesterday held, today is a new measure of mercy." },
  { q: '"For we are God\'s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do."', ref: "Ephesians 2:10", r: "You are not an accident. You are crafted with purpose." },
  { q: '"Even though I walk through the darkest valley, I will fear no evil, for you are with me."', ref: "Psalm 23:4", r: "The valley is real. So is the presence walking through it with you." },
  { q: '"Delight yourself in the Lord, and he will give you the desires of your heart."', ref: "Psalm 37:4", r: "Delight first. The rest follows." },
  { q: '"The Spirit of God has made me; the breath of the Almighty gives me life."', ref: "Job 33:4", r: "Every breath today is a gift." },
  { q: '"Have I not commanded you? Be strong and courageous. Do not be frightened or dismayed."', ref: "Joshua 1:9", r: "Courage is available to you." },
  { q: '"Neither death nor life, neither angels nor demons, neither the present nor the future, shall separate us from the love of God."', ref: "Romans 8:38-39", r: "Nothing that happens today removes you from this love." },
  { q: '"You are the light of the world. A town built on a hill cannot be hidden."', ref: "Matthew 5:14", r: "You carry light. It is there." },
  { q: '"Let your light shine before others, that they may see your good deeds and glorify your Father in heaven."', ref: "Matthew 5:16", r: "You only have to be present and faithful." },
  { q: '"Humble yourselves, therefore, under God\'s mighty hand, that he may lift you up in due time."', ref: "1 Peter 5:6", r: "Humility is trusting who holds you." },
  { q: '"I have loved you with an everlasting love; I have drawn you with unfailing kindness."', ref: "Jeremiah 31:3", r: "Everlasting means before you knew His name, and after everything you fear." },
  { q: '"For everyone born of God overcomes the world. This is the victory that has overcome the world, even our faith."', ref: "1 John 5:4", r: "Faith is choosing to hold on even when certainty is absent." },
  { q: '"Whatever you do, work at it with all your heart, as working for the Lord, not for human masters."', ref: "Colossians 3:23", r: "What you do today can be an act of worship." },
  { q: '"Praise be to the God and Father of our Lord Jesus Christ, the Father of compassion and the God of all comfort."', ref: "2 Corinthians 1:3", r: "He is the God of comfort." },
  { q: '"And we know that in all things God works for the good of those who love him."', ref: "Romans 8:28", r: "The broken things too are working toward something good." },
  { q: '"I praise you because I am fearfully and wonderfully made."', ref: "Psalm 139:14", r: "Wonderful is the word used for how you were made." },
  { q: '"The name of the Lord is a fortified tower; the righteous run to it and are safe."', ref: "Proverbs 18:10", r: "You have somewhere to run. Always." },
  { q: '"Seek the Lord while he may be found; call on him while he is near."', ref: "Isaiah 55:6", r: "He is near right now." },
  { q: '"God is our refuge and strength, an ever-present help in trouble."', ref: "Psalm 46:1", r: "An ever-present help, already here." },
  { q: '"Let us then approach God\'s throne of grace with confidence, so that we may receive mercy and find grace to help us in our time of need."', ref: "Hebrews 4:16", r: "You are invited to approach with confidence because of who receives you." }
];

const today = new Date();
const STORAGE_KEY = "caya-bread";
let modalCurrentVerse = null;
let state = { streak: 0, lastVisit: "", savedVerses: [], visits: [] };

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

if (reveals.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach((element) => observer.observe(element));
}

try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    state = { ...state, ...JSON.parse(raw) };
  }
} catch (error) {
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
  }
}

function getSeason(month) {
  if ([12, 1, 2].includes(month)) return { name: "Summer", icon: "Sun" };
  if ([3, 4, 5].includes(month)) return { name: "Autumn", icon: "Leaf" };
  if ([6, 7, 8].includes(month)) return { name: "Winter", icon: "Snow" };
  return { name: "Spring", icon: "Bloom" };
}

function getVerseForDate(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return library[dayOfYear % library.length];
}

function setDateDisplay() {
  document.querySelector("#dateDayName").textContent = today.toLocaleDateString("en-ZA", { weekday: "long" });
  document.querySelector("#dateFull").textContent = today.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
}

function renderToday() {
  const verse = getVerseForDate(today);
  const season = getSeason(today.getMonth() + 1);
  document.querySelector("#seasonIcon").textContent = season.icon;
  document.querySelector("#seasonName").textContent = season.name;
  document.querySelector("#mainVerse").textContent = verse.q;
  document.querySelector("#mainRef").textContent = verse.ref;
  document.querySelector("#mainReflection").textContent = verse.r;
}

function updateStreak() {
  const todayString = today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toDateString();

  if (state.lastVisit === todayString) return;

  state.streak = state.lastVisit === yesterdayString ? state.streak + 1 : 1;
  state.lastVisit = todayString;

  if (!state.visits.includes(todayString)) {
    state.visits.push(todayString);
  }

  if (state.visits.length > 30) {
    state.visits = state.visits.slice(-30);
  }

  saveState();
}

function renderStreak() {
  document.querySelector("#streakNum").textContent = state.streak;
  document.querySelector("#streakDots").innerHTML = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const lit = state.visits.includes(date.toDateString());
    return `<div class="streak-dot${lit ? " lit" : ""}"></div>`;
  }).join("");
}

function renderSaved() {
  const savedGrid = document.querySelector("#savedGrid");
  if (!state.savedVerses || state.savedVerses.length === 0) {
    savedGrid.innerHTML = '<p class="saved-empty">Verses you save will be kept here for you to return to.</p>';
    return;
  }

  savedGrid.innerHTML = state.savedVerses.slice().reverse().map((item) => `
    <article class="saved-card">
      <div class="saved-date">${item.date}</div>
      <p class="saved-q">${item.q}</p>
      <div class="saved-ref">${item.ref}</div>
    </article>
  `).join("");
}

function saveVerse(verse) {
  const alreadySaved = state.savedVerses.some((item) => item.ref === verse.ref);
  if (alreadySaved) return;

  state.savedVerses.push({
    q: verse.q,
    ref: verse.ref,
    date: today.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })
  });

  if (state.savedVerses.length > 20) {
    state.savedVerses.shift();
  }

  saveState();
  renderSaved();
}

function closeModal() {
  modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
  modalCurrentVerse = null;
}

function openModal(verse) {
  modalCurrentVerse = verse;
  document.querySelector("#modalDay").textContent = verse.dayLabel || "";
  document.querySelector("#modalVerse").textContent = verse.q;
  document.querySelector("#modalRef").textContent = verse.ref;
  document.querySelector("#modalReflection").textContent = verse.r;
  modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function renderWeek() {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  document.querySelector("#weekGrid").innerHTML = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);

    const verse = getVerseForDate(date);
    const isToday = date.toDateString() === today.toDateString();
    const isPast = date < today && !isToday;
    const classes = ["week-card", isToday ? "today" : "", isPast ? "past" : ""].filter(Boolean).join(" ");
    const preview = verse.q.length > 55 ? `${verse.q.slice(0, 55)}...` : verse.q;

    return `
      <article class="${classes}" tabindex="0">
        <div class="wc-day">${dayNames[date.getDay()]}</div>
        <div class="wc-num">${date.getDate()}</div>
        <div class="wc-preview">${preview}</div>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".week-card").forEach((card, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    const verse = {
      ...getVerseForDate(date),
      dayLabel: date.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "short" })
    };

    card.addEventListener("click", () => openModal(verse));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(verse);
      }
    });
  });
}

if (saveTodayButton) {
  saveTodayButton.addEventListener("click", () => {
    saveVerse(getVerseForDate(today));
  });
}

if (saveFromModalButton) {
  saveFromModalButton.addEventListener("click", () => {
    if (modalCurrentVerse) {
      saveVerse(modalCurrentVerse);
    }
    closeModal();
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

updateStreak();
setDateDisplay();
renderToday();
renderWeek();
renderStreak();
renderSaved();
