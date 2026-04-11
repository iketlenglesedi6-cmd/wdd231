const membersContainer = document.querySelector('#member-list');
const gridButton = document.querySelector('#grid-view');
const listButton = document.querySelector('#list-view');
const filterContainer = document.querySelector('#category-filters');
const mapPins = document.querySelector('#map-pins');

const levelLabels = {
  1: 'Bronze',
  2: 'Silver',
  3: 'Gold'
};

let allMembers = [];
let activeCategory = 'All';

function buildMemberCard(member) {
  const card = document.createElement('article');
  card.classList.add('member-card');

  const logo = document.createElement('img');
  logo.src = `images/members/${member.image}`;
  logo.alt = `${member.name} logo`;
  logo.loading = 'lazy';
  logo.width = 88;
  logo.height = 88;

  const title = document.createElement('h2');
  title.textContent = member.name;

  const badges = document.createElement('div');
  badges.classList.add('member-badges');

  const levelBadge = document.createElement('span');
  levelBadge.classList.add('badge', 'badge-level');
  const levelName = levelLabels[member.membershipLevel] || 'Member';
  const levelIcon = document.createElement('span');
  levelIcon.classList.add('badge-icon', `level-${levelName.toLowerCase()}`);
  levelIcon.setAttribute('aria-hidden', 'true');
  levelBadge.append(levelIcon, `${levelName} Member`);

  const categoryBadge = document.createElement('span');
  categoryBadge.classList.add('badge', 'badge-category');
  categoryBadge.textContent = member.category || 'Member';

  badges.append(levelBadge, categoryBadge);

  const highlight = document.createElement('p');
  highlight.classList.add('member-highlight');
  highlight.textContent = member.highlight || member.description;

  const description = document.createElement('p');
  description.classList.add('member-description');
  description.textContent = member.description;

  const info = document.createElement('div');
  info.classList.add('member-meta');

  const address = document.createElement('p');
  address.textContent = member.address;

  const phone = document.createElement('p');
  phone.textContent = member.phone;

  const website = document.createElement('a');
  website.href = member.website;
  website.target = '_blank';
  website.rel = 'noopener noreferrer';
  website.textContent = member.website.replace(/^https?:\/\//, '');

  const hours = document.createElement('p');
  hours.classList.add('member-hours');
  hours.textContent = member.hours || 'Hours: Check website';

  info.append(address, phone, website, hours);
  card.append(logo, title, badges, highlight, description, info);

  return card;
}

function displayMembers(members) {
  if (!membersContainer) return;
  membersContainer.innerHTML = '';
  if (!members.length) {
    membersContainer.textContent = 'No members found for this category.';
    return;
  }
  members.forEach((member) => membersContainer.append(buildMemberCard(member)));
}

function setView(view) {
  if (!membersContainer) return;
  const isList = view === 'list';
  membersContainer.classList.toggle('list', isList);
  if (gridButton && listButton) {
    gridButton.classList.toggle('is-active', !isList);
    listButton.classList.toggle('is-active', isList);
    gridButton.setAttribute('aria-pressed', String(!isList));
    listButton.setAttribute('aria-pressed', String(isList));
  }
}

function renderMapPins(members) {
  if (!mapPins) return;
  mapPins.innerHTML = '';
  const withCoords = members.filter((member) => Number.isFinite(member.lat) && Number.isFinite(member.lon));
  if (!withCoords.length) return;

  const lats = withCoords.map((member) => member.lat);
  const lons = withCoords.map((member) => member.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const latSpan = maxLat - minLat || 0.0001;
  const lonSpan = maxLon - minLon || 0.0001;

  withCoords.forEach((member) => {
    const x = (member.lon - minLon) / lonSpan;
    const y = 1 - (member.lat - minLat) / latSpan;
    const pin = document.createElement('div');
    pin.classList.add('map-pin');
    pin.style.left = `${x * 100}%`;
    pin.style.top = `${y * 100}%`;
    pin.setAttribute('data-name', member.name);
    pin.setAttribute('role', 'img');
    pin.setAttribute('aria-label', member.name);
    pin.setAttribute('title', member.name);
    mapPins.append(pin);
  });
}

function renderFilters(members) {
  if (!filterContainer) return;
  const categories = [...new Set(members.map((member) => member.category).filter(Boolean))].sort();
  const filterLabels = ['All', ...categories];
  filterContainer.innerHTML = '';

  filterLabels.forEach((label) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.classList.toggle('is-active', label === activeCategory);
    button.setAttribute('aria-pressed', String(label === activeCategory));
    button.addEventListener('click', () => {
      activeCategory = label;
      renderFilters(allMembers);
      displayMembers(getFilteredMembers());
    });
    filterContainer.append(button);
  });
}

function getFilteredMembers() {
  if (activeCategory === 'All') return allMembers;
  return allMembers.filter((member) => member.category === activeCategory);
}

async function loadMembers() {
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) {
      throw new Error('Unable to load member data');
    }
    const data = await response.json();
    allMembers = data.members || [];
    renderFilters(allMembers);
    displayMembers(getFilteredMembers());
    renderMapPins(allMembers);
  } catch (error) {
    if (membersContainer) {
      membersContainer.textContent = 'Member data is unavailable at the moment.';
    }
    console.error(error);
  }
}

if (gridButton) {
  gridButton.addEventListener('click', () => setView('grid'));
}

if (listButton) {
  listButton.addEventListener('click', () => setView('list'));
}

setView('grid');
loadMembers();

