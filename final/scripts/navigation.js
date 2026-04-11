const navRoot = document.querySelector(".sanctuary-nav");
const navToggleButton = document.querySelector(".sanctuary-nav .nav-toggle, .sanctuary-nav .tog");
const navMenu = document.querySelector(".sanctuary-nav .nav-links, .sanctuary-nav .links");
const navGroups = document.querySelectorAll(".sanctuary-nav .nav-group");
const mobileNavQuery = window.matchMedia("(max-width: 760px)");
const navAnchors = document.querySelectorAll(".sanctuary-nav a[href], .footer-utility a[href]");
const musicPreferenceKey = "caya-music-enabled";
const musicTimeKey = "caya-music-time";

function normalizePath(pathname) {
  const cleanPath = pathname.replace(/\\/g, "/").replace(/\/+$/, "");
  return cleanPath === "" ? "/index.html" : cleanPath;
}

function setWayfinding() {
  const currentPath = normalizePath(window.location.pathname);

  navAnchors.forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || /^https?:/i.test(href)) {
      return;
    }

    const anchorPath = normalizePath(new URL(href, window.location.href).pathname);
    if (anchorPath === currentPath) {
      anchor.setAttribute("aria-current", "page");
    } else {
      anchor.removeAttribute("aria-current");
    }
  });
}

function setupSkipLink() {
  const existingSkipLink = document.querySelector(".skip-link");
  if (existingSkipLink) {
    return;
  }

  const mainTarget =
    document.querySelector("main") ||
    document.querySelector(".hero") ||
    document.querySelector(".wrap") ||
    document.querySelector(".page") ||
    document.querySelector(".main") ||
    document.querySelector(".ph");

  if (!mainTarget) {
    return;
  }

  if (!mainTarget.id) {
    mainTarget.id = "main-content";
  }

  const skipLink = document.createElement("a");
  skipLink.className = "skip-link";
  skipLink.href = `#${mainTarget.id}`;
  skipLink.textContent = "Skip to main content";
  document.body.prepend(skipLink);
}

function setupBackgroundMusic() {
  if (document.querySelector(".music-toggle")) {
    return;
  }

  const player = document.createElement("audio");
  player.className = "music-player";
  player.src = "audio/come-follow-me-pianocover.mpeg";
  player.loop = true;
  player.preload = "none";
  player.volume = 0.35;

  const savedTime = Number(localStorage.getItem(musicTimeKey) || "0");
  const canRestoreTime = Number.isFinite(savedTime) && savedTime > 0;

  function restorePlaybackPosition() {
    if (!canRestoreTime) {
      return;
    }

    try {
      player.currentTime = savedTime;
    } catch (error) {
      // Ignore browsers that block setting currentTime before media is ready.
    }
  }

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "music-toggle";
  toggle.innerHTML = `
    <span class="music-flower" aria-hidden="true"></span>
    <span class="music-text">Music Off</span>
  `;
  toggle.setAttribute("aria-label", "Toggle background music");

  const toggleText = toggle.querySelector(".music-text");

  function setMusicState(isPlaying) {
    toggle.setAttribute("aria-pressed", String(isPlaying));
    toggle.classList.toggle("on", isPlaying);
    if (toggleText) {
      toggleText.textContent = isPlaying ? "Music On" : "Music Off";
    }
    toggle.setAttribute("aria-label", isPlaying ? "Turn background music off" : "Turn background music on");
  }

  async function startMusic() {
    try {
      restorePlaybackPosition();
      await player.play();
      localStorage.setItem(musicPreferenceKey, "true");
      setMusicState(true);
    } catch (error) {
      setMusicState(false);
    }
  }

  function stopMusic() {
    player.pause();
    localStorage.setItem(musicTimeKey, String(player.currentTime));
    localStorage.setItem(musicPreferenceKey, "false");
    setMusicState(false);
  }

  toggle.addEventListener("click", () => {
    if (player.paused) {
      startMusic();
    } else {
      stopMusic();
    }
  });

  document.body.append(player, toggle);

  player.addEventListener("timeupdate", () => {
    if (!player.paused) {
      localStorage.setItem(musicTimeKey, String(player.currentTime));
    }
  });

  player.addEventListener("loadedmetadata", restorePlaybackPosition);
  window.addEventListener("pagehide", () => {
    localStorage.setItem(musicTimeKey, String(player.currentTime));
  });

  const shouldStart = localStorage.getItem(musicPreferenceKey) === "true";
  if (shouldStart) {
    startMusic();
  } else {
    setMusicState(false);
  }
}

function closeAllNavGroups() {
  navGroups.forEach((group) => {
    group.classList.remove("open");
    const trigger = group.querySelector(".nav-group-trigger");
    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
    }
  });
}

function syncMobileNav() {
  if (!navRoot || !navMenu) return;

  if (!mobileNavQuery.matches) {
    closeAllNavGroups();
    navRoot.classList.remove("nav-open");
    navMenu.classList.remove("open");
    if (navToggleButton) {
      navToggleButton.setAttribute("aria-expanded", "false");
    }
  }
}

if (navRoot && navToggleButton && navMenu) {
  navToggleButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const isOpen = navMenu.classList.toggle("open");
    navRoot.classList.toggle("nav-open", isOpen);
    navToggleButton.setAttribute("aria-expanded", String(isOpen));

    if (!isOpen) {
      closeAllNavGroups();
    }
  }, true);
}

navGroups.forEach((group) => {
  const trigger = group.querySelector(".nav-group-trigger");
  if (!trigger) return;

  trigger.addEventListener("click", () => {
    if (!mobileNavQuery.matches) {
      const willOpen = !group.classList.contains("open");
      closeAllNavGroups();
      group.classList.toggle("open", willOpen);
      trigger.setAttribute("aria-expanded", String(willOpen));
      return;
    }

    const willOpen = !group.classList.contains("open");
    closeAllNavGroups();
    group.classList.toggle("open", willOpen);
    trigger.setAttribute("aria-expanded", String(willOpen));
  });
});

document.addEventListener("click", (event) => {
  if (!navRoot || navRoot.contains(event.target)) return;
  closeAllNavGroups();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeAllNavGroups();
  if (navMenu && navToggleButton && navMenu.classList.contains("open")) {
    navMenu.classList.remove("open");
    navRoot.classList.remove("nav-open");
    navToggleButton.setAttribute("aria-expanded", "false");
  }
});

if (typeof mobileNavQuery.addEventListener === "function") {
  mobileNavQuery.addEventListener("change", syncMobileNav);
} else if (typeof mobileNavQuery.addListener === "function") {
  mobileNavQuery.addListener(syncMobileNav);
}

setWayfinding();
setupSkipLink();
setupBackgroundMusic();
