const weatherTemp = document.querySelector('#current-temp');
const weatherDesc = document.querySelector('#weather-desc');
const forecastList = document.querySelector('#forecast-list');
const spotlightList = document.querySelector('#spotlight-list');
const weatherIcon = document.querySelector('#weather-icon');
const weatherFeels = document.querySelector('#weather-feels');
const weatherHumidity = document.querySelector('#weather-humidity');
const weatherWind = document.querySelector('#weather-wind');

const weatherConfig = {
  apiKey: '449720db2cf2882414754ea87f0294c9',
  lat: -26.1929,
  lon: 28.0337,
  units: 'metric'
};

const levelLabels = {
  1: 'Bronze',
  2: 'Silver',
  3: 'Gold'
};

async function loadWeather() {
  if (!weatherConfig.apiKey || weatherConfig.apiKey === 'YOUR_OPENWEATHERMAP_API_KEY') {
    if (weatherDesc) {
      weatherDesc.textContent = 'Add your OpenWeatherMap API key to load weather.';
    }
    return;
  }

  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${weatherConfig.lat}&lon=${weatherConfig.lon}&units=${weatherConfig.units}&appid=${weatherConfig.apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherConfig.lat}&lon=${weatherConfig.lon}&units=${weatherConfig.units}&appid=${weatherConfig.apiKey}`;

  try {
    const currentResponse = await fetch(currentUrl);
    if (!currentResponse.ok) throw new Error('Weather data unavailable');
    const currentData = await currentResponse.json();

    if (weatherTemp) {
      weatherTemp.textContent = Math.round(currentData.main.temp);
    }
    if (weatherDesc) {
      weatherDesc.textContent = currentData.weather[0].description;
    }
    if (weatherIcon) {
      const iconCode = currentData.weather[0].icon;
      weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      weatherIcon.alt = currentData.weather[0].description;
    }
    if (weatherFeels) {
      weatherFeels.textContent = `${Math.round(currentData.main.feels_like)}°C`;
    }
    if (weatherHumidity) {
      weatherHumidity.textContent = `${currentData.main.humidity}%`;
    }
    if (weatherWind) {
      weatherWind.textContent = `${Math.round(currentData.wind.speed)} m/s`;
    }

    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) throw new Error('Forecast data unavailable');
    const forecastData = await forecastResponse.json();

    const midday = forecastData.list.filter((entry) => entry.dt_txt.includes('12:00:00'));
    const nextThree = midday.slice(0, 3);

    if (forecastList) {
      forecastList.innerHTML = '';
      const formatter = new Intl.DateTimeFormat('en-ZA', { weekday: 'short' });
      nextThree.forEach((entry) => {
        const day = formatter.format(new Date(entry.dt_txt));
        const item = document.createElement('li');
        item.classList.add('forecast-item');

        const icon = document.createElement('img');
        icon.src = `https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`;
        icon.alt = entry.weather[0].description;
        icon.width = 36;
        icon.height = 36;
        icon.loading = 'lazy';

        const text = document.createElement('span');
        text.textContent = `${day}: ${Math.round(entry.main.temp)}°C`;

        item.append(icon, text);
        forecastList.append(item);
      });
    }
  } catch (error) {
    if (weatherDesc) {
      weatherDesc.textContent = 'Unable to load weather right now.';
    }
    console.error(error);
  }
}

function buildSpotlightCard(member) {
  const card = document.createElement('article');
  card.classList.add('spotlight-member');

  const header = document.createElement('div');
  header.classList.add('spotlight-header');

  const logo = document.createElement('img');
  logo.src = `images/members/${member.image}`;
  logo.alt = `${member.name} logo`;
  logo.loading = 'lazy';
  logo.width = 72;
  logo.height = 72;

  const name = document.createElement('h3');
  name.textContent = member.name;

  header.append(logo, name);

  const badge = document.createElement('span');
  badge.classList.add('badge', 'badge-level');
  const levelName = levelLabels[member.membershipLevel] || 'Member';
  const badgeIcon = document.createElement('span');
  badgeIcon.classList.add('badge-icon', `level-${levelName.toLowerCase()}`);
  badgeIcon.setAttribute('aria-hidden', 'true');
  badge.append(badgeIcon, `${levelName} Member`);

  const address = document.createElement('p');
  address.textContent = member.address;

  const phone = document.createElement('p');
  phone.textContent = member.phone;

  const link = document.createElement('a');
  link.href = member.website;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = member.website.replace(/^https?:\/\//, '');

  card.append(header, badge, address, phone, link);
  return card;
}

async function loadSpotlights() {
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error('Member data unavailable');
    const data = await response.json();
    const eligible = (data.members || []).filter((member) => member.membershipLevel >= 2);

    const shuffled = eligible.sort(() => 0.5 - Math.random());
    const selection = shuffled.slice(0, 3);

    if (spotlightList) {
      spotlightList.innerHTML = '';
      selection.forEach((member, index) => {
        const card = buildSpotlightCard(member);
        card.style.transitionDelay = `${index * 120}ms`;
        spotlightList.append(card);
        requestAnimationFrame(() => card.classList.add('is-visible'));
      });
    }
  } catch (error) {
    if (spotlightList) {
      spotlightList.textContent = 'Member spotlights are unavailable right now.';
    }
    console.error(error);
  }
}

loadWeather();
loadSpotlights();

