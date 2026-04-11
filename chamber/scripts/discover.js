import { discoverItems } from "../data/discover.mjs";

const discoverGrid = document.querySelector("#discover-grid");
const visitMessage = document.querySelector("#visit-message");
const lastVisitKey = "braam-discover-last-visit";

function createCard(item, index) {
  const card = document.createElement("article");
  card.className = "discover-card";
  card.style.gridArea = item.id;

  const title = document.createElement("h2");
  title.textContent = item.name;

  const figure = document.createElement("figure");

  const image = document.createElement("img");
  image.src = item.image;
  image.alt = item.imageAlt;
  image.loading = "lazy";
  image.width = 300;
  image.height = 200;

  const caption = document.createElement("figcaption");
  caption.textContent = `Highlight ${index + 1}`;

  figure.append(image, caption);

  const address = document.createElement("address");
  address.textContent = item.address;

  const description = document.createElement("p");
  description.textContent = item.description;

  const extra = document.createElement("p");
  extra.className = "discover-extra";
  extra.hidden = true;
  extra.textContent = item.details;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "discover-button";
  button.textContent = "Learn More";
  button.setAttribute("aria-expanded", "false");

  button.addEventListener("click", () => {
    const isOpen = card.classList.toggle("is-expanded");
    extra.hidden = !isOpen;
    button.setAttribute("aria-expanded", String(isOpen));
    button.textContent = isOpen ? "Show Less" : "Learn More";
  });

  card.append(title, figure, address, description, button, extra);
  return card;
}

function renderCards() {
  if (!discoverGrid) return;
  discoverItems.forEach((item, index) => {
    discoverGrid.append(createCard(item, index));
  });
}

function updateVisitMessage() {
  if (!visitMessage) return;

  const now = Date.now();
  const previousVisit = Number(localStorage.getItem(lastVisitKey));

  if (!previousVisit) {
    visitMessage.textContent = "Welcome! Let us know if you have any questions.";
    localStorage.setItem(lastVisitKey, String(now));
    return;
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const timeDifference = now - previousVisit;

  if (timeDifference < millisecondsPerDay) {
    visitMessage.textContent = "Back so soon! Awesome!";
  } else {
    const days = Math.floor(timeDifference / millisecondsPerDay);
    const dayLabel = days === 1 ? "day" : "days";
    visitMessage.textContent = `You last visited ${days} ${dayLabel} ago.`;
  }

  localStorage.setItem(lastVisitKey, String(now));
}

renderCards();
updateVisitMessage();
