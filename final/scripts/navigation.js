const navRoot = document.querySelector(".sanctuary-nav");
const navToggleButton = document.querySelector(".sanctuary-nav .nav-toggle, .sanctuary-nav .tog");
const navMenu = document.querySelector(".sanctuary-nav .nav-links, .sanctuary-nav .links");
const navGroups = document.querySelectorAll(".sanctuary-nav .nav-group");
const mobileNavQuery = window.matchMedia("(max-width: 760px)");

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
