const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');

if (menuToggle && primaryNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const yearSpan = document.querySelector('#currentyear');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const lastModified = document.querySelector('#lastModified');
if (lastModified) {
  lastModified.textContent = `Last Modified: ${document.lastModified}`;
}

const gallerySlide = document.querySelector('#gallery-slide');
const galleryCaption = document.querySelector('#gallery-caption');

if (gallerySlide && galleryCaption) {
  const slides = [
    {
      src: 'images/gallery/braam-rooftop-lights.jpg',
      alt: 'Night city view with illuminated hotel signage and towers',
      caption: 'Braam rooftop lights after dark'
    },
    {
      src: 'images/gallery/joburg-sunset-skyline.jpg',
      alt: 'Johannesburg skyline at sunset with warm clouds',
      caption: 'Sunset glow over Joburg'
    },
    {
      src: 'images/gallery/braam-cafe-interior.jpg',
      alt: 'Coffee bar interior with chalkboard menus and Edison bulbs',
      caption: 'Café conversations and warm light'
    },
    {
      src: 'images/gallery/braam-street-mural.jpg',
      alt: 'Street view with a large colorful mural on a building wall',
      caption: 'Street art on a lively block'
    },
    {
      src: 'images/gallery/braam-riverside-market.jpg',
      alt: 'Night market with light-wrapped stalls beside a river',
      caption: 'Riverside night market'
    },
    {
      src: 'images/gallery/braam-lantern-food-market.jpg',
      alt: 'Lantern-lit night market with food stalls and crowds',
      caption: 'Lantern-lit food market'
    },
    {
      src: 'images/gallery/braam-after-hours-alley.jpg',
      alt: 'Dim alleyway with shuttered shops and a lit walkway',
      caption: 'After-hours alley glow'
    },
    {
      src: 'images/gallery/braam-mural-doors.jpg',
      alt: 'Brick wall mural with orange birds framing a metal door',
      caption: 'Mural doors on brick'
    },
    {
      src: 'images/gallery/braam-story-mural.jpg',
      alt: 'Tall building mural of two people dining in a painted scene',
      caption: 'Story mural on a city façade'
    },
    {
      src: 'images/gallery/braam-community-mural-market.jpg',
      alt: 'Large cityscape mural with people and street activity below',
      caption: 'Community mural and market energy'
    }
  ];
  let currentSlide = 0;
  const fadeDuration = 900;
  let autoTimer;

  function applySlide(index) {
    const slide = slides[index];
    gallerySlide.classList.add('is-fading');
    gallerySlide.classList.remove('is-zooming');
    setTimeout(() => {
      gallerySlide.src = slide.src;
      gallerySlide.alt = slide.alt;
      galleryCaption.textContent = slide.caption;
      gallerySlide.classList.remove('is-fading');
      requestAnimationFrame(() => gallerySlide.classList.add('is-zooming'));
    }, fadeDuration);
  }

  function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    applySlide(currentSlide);
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function startAuto() {
    autoTimer = setInterval(nextSlide, 6500);
  }

  function restartAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  gallerySlide.classList.add('is-zooming');
  startAuto();

  window.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(autoTimer);
    } else {
      restartAuto();
    }
  });
}


