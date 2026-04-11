const navToggle = document.querySelector(".tog");
const navLinks = document.querySelector(".links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

const journal = document.getElementById("jta");
const wordCount = document.getElementById("cc");
const dateLabel = document.getElementById("dl");
const saveButton = document.getElementById("save-entry");
const clearButton = document.getElementById("clear-entry");
const italicButton = document.getElementById("bi");
const plainButton = document.getElementById("bn");
const toast = document.getElementById("toast");
const savedList = document.getElementById("sl");
const storageKey = "caya-e";

if (dateLabel) {
  const today = new Date();
  dateLabel.textContent = today.toLocaleDateString("en-ZA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function setStyle(mode) {
  if (!journal) return;
  journal.classList.remove("fi", "fn");
  journal.classList.add(mode);
  italicButton.classList.toggle("on", mode === "fi");
  plainButton.classList.toggle("on", mode === "fn");
}

function updateCount() {
  if (!journal || !wordCount) return;
  const text = journal.value.trim();
  const count = text === "" ? 0 : text.split(/\s+/).length;
  wordCount.textContent = `${count} ${count === 1 ? "word" : "words"}`;
}

function showToast() {
  if (!toast) return;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

function getEntries() {
  return JSON.parse(localStorage.getItem(storageKey) || "[]");
}

function renderEntries() {
  if (!savedList) return;
  const entries = getEntries();

  if (entries.length === 0) {
    savedList.innerHTML = '<p class="se0">Your saved entries will appear here.</p>';
    return;
  }

  savedList.innerHTML = entries
    .map((entry, index) => `
      <div class="se" data-index="${index}">
        <span class="sep">${entry.t.substring(0, 80)}${entry.t.length > 80 ? "..." : ""}</span>
        <span class="sem">${entry.d}</span>
      </div>
    `)
    .join("");

  savedList.querySelectorAll(".se").forEach((entry) => {
    entry.addEventListener("click", () => {
      const selected = entries[Number(entry.dataset.index)];
      journal.value = selected.t;
      updateCount();
      journal.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function saveEntry() {
  if (!journal) return;
  const text = journal.value.trim();
  if (!text) return;

  const entries = getEntries();
  entries.unshift({
    t: text,
    d: new Date().toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  });

  if (entries.length > 10) {
    entries.pop();
  }

  localStorage.setItem(storageKey, JSON.stringify(entries));
  showToast();
  renderEntries();
}

function clearEntry() {
  if (!journal) return;
  journal.value = "";
  updateCount();
}

italicButton?.addEventListener("click", () => setStyle("fi"));
plainButton?.addEventListener("click", () => setStyle("fn"));
journal?.addEventListener("input", updateCount);
saveButton?.addEventListener("click", saveEntry);
clearButton?.addEventListener("click", clearEntry);

updateCount();
renderEntries();
