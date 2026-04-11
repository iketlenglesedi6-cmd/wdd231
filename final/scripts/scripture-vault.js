import { getSourceLabel, loadScriptureLibrary } from "./scripture-library.js";

const navToggle = document.querySelector(".tog");
const navLinks = document.querySelector(".links");
const searchInput = document.querySelector("#searchInput");
const searchClear = document.querySelector("#searchClear");
const filterButtons = document.querySelectorAll(".filter-btn");
const sortButtons = document.querySelectorAll(".sort-btn");
const resultsCount = document.querySelector("#resultsCount");
const vaultGrid = document.querySelector("#vaultGrid");
const modalOverlay = document.querySelector("#modalOverlay");
const modalClose = document.querySelector("#modalClose");
const closeModalButton = document.querySelector("#closeModalButton");
const copyVerseButton = document.querySelector("#copyVerse");
const copyBtnText = document.querySelector("#copyBtnText");

const modalTag = document.querySelector("#modalTag");
const modalSource = document.querySelector("#modalSource");
const modalVerse = document.querySelector("#modalVerse");
const modalRef = document.querySelector("#modalRef");
const modalAffirmation = document.querySelector("#modalAffirmation");
const modalContext = document.querySelector("#modalContext");

let scriptureData = [];

const state = {
  activeFilterType: "all",
  activeFilterValue: "All",
  sortMode: "default",
  searchQuery: "",
  activeVerse: null
};

function toggleMobileMenu() {
  if (navLinks) {
    navLinks.classList.toggle("open");
  }
}

function getFilteredVerses() {
  const query = state.searchQuery.trim().toLowerCase();

  let verses = scriptureData.filter((verse) => {
    if (state.activeFilterType === "all") {
      return true;
    }

    return verse[state.activeFilterType] === state.activeFilterValue;
  });

  if (query) {
    verses = verses.filter((verse) => {
      return [verse.quote, verse.reference, verse.category, verse.source, verse.affirmation, verse.context]
        .some((field) => field.toLowerCase().includes(query));
    });
  }

  if (state.sortMode === "alpha") {
    verses = [...verses].sort((firstVerse, secondVerse) => firstVerse.reference.localeCompare(secondVerse.reference));
  }

  return verses;
}

async function loadScriptures() {
  try {
    scriptureData = await loadScriptureLibrary();
    renderGrid();
  } catch (error) {
    console.error("Scripture Vault data error:", error);
    resultsCount.textContent = "Unable to load the library";
    vaultGrid.innerHTML = `
      <div class="state-msg">
        <p>The scripture library could not be loaded right now. Please refresh and try again.</p>
      </div>
    `;
  }
}

function updateResultsCount(count) {
  const label = count === 1 ? "verse" : "verses";
  const hasFilter = state.searchQuery || state.activeFilterType !== "all";

  resultsCount.textContent = hasFilter
    ? `${count} ${label} found`
    : `${count} ${label} in the library`;
}

function renderGrid() {
  const verses = getFilteredVerses();

  updateResultsCount(verses.length);

  if (!verses.length) {
    vaultGrid.innerHTML = `
      <div class="state-msg">
        <p>No verses found for that search. Try different words or clear the filter.</p>
      </div>
    `;
    return;
  }

  vaultGrid.innerHTML = verses.map((verse) => {
    const preview = verse.quote.length > 140 ? `${verse.quote.slice(0, 140)}...` : verse.quote;
    const sourceName = verse.source === "Scripture of Mormon" ? "Book of Mormon" : verse.source;

    return `
      <article class="verse-card" data-verse-id="${verse.id}" tabindex="0">
        <div class="card-top">
          <span class="vc-tag">${verse.category}</span>
          <span class="vc-source">${sourceName}</span>
        </div>
        <p class="vc-q">${preview}</p>
        <div class="vc-ref">${verse.reference}</div>
        <p class="vc-affirmation">${verse.affirmation}</p>
      </article>
    `;
  }).join("");

  vaultGrid.querySelectorAll(".verse-card").forEach((card) => {
    const verseId = Number(card.dataset.verseId);

    card.addEventListener("click", () => openModal(verseId));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(verseId);
      }
    });
  });
}

function openModal(verseId) {
  const verse = scriptureData.find((item) => item.id === verseId);

  if (!verse) {
    return;
  }

  state.activeVerse = verse;
  modalTag.textContent = verse.category;
  modalSource.textContent = getSourceLabel(verse.source);
  modalVerse.textContent = verse.quote;
  modalRef.textContent = verse.reference;
  modalAffirmation.textContent = verse.affirmation;
  modalContext.textContent = verse.context;
  copyBtnText.textContent = "Copy verse";
  if (typeof modalOverlay.showModal === "function") {
    modalOverlay.showModal();
  } else {
    modalOverlay.classList.add("open");
  }
}

function closeModal() {
  if (typeof modalOverlay.close === "function") {
    modalOverlay.close();
  } else {
    modalOverlay.classList.remove("open");
  }
  state.activeVerse = null;
}

async function copyVerse() {
  if (!state.activeVerse) {
    return;
  }

  const verseText = `${state.activeVerse.quote} - ${state.activeVerse.reference}`;

  try {
    await navigator.clipboard.writeText(verseText);
    copyBtnText.textContent = "Copied";
  } catch (error) {
    copyBtnText.textContent = "Copy failed";
  }
}

if (navToggle) {
  navToggle.addEventListener("click", toggleMobileMenu);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("on"));
    button.classList.add("on");
    state.activeFilterType = button.dataset.filterType;
    state.activeFilterValue = button.dataset.filterValue;
    renderGrid();
  });
});

sortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sortButtons.forEach((item) => item.classList.remove("on"));
    button.classList.add("on");
    state.sortMode = button.dataset.sort;
    renderGrid();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", () => {
    state.searchQuery = searchInput.value;
    searchClear.classList.toggle("show", Boolean(searchInput.value));
    renderGrid();
  });
}

if (searchClear) {
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    state.searchQuery = "";
    searchClear.classList.remove("show");
    renderGrid();
    searchInput.focus();
  });
}

if (modalOverlay) {
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });
}

if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}

if (closeModalButton) {
  closeModalButton.addEventListener("click", closeModal);
}

if (copyVerseButton) {
  copyVerseButton.addEventListener("click", copyVerse);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && (modalOverlay.open || modalOverlay.classList.contains("open"))) {
    closeModal();
  }
});

loadScriptures();
