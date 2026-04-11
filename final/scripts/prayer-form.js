const navToggle = document.querySelector(".tog");
const navLinks = document.querySelector(".links");
const prayerForm = document.querySelector("#prayerForm");
const prayerText = document.querySelector("#prayerText");
const charCount = document.querySelector("#charCount");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

function updateCharCount() {
  if (!prayerText || !charCount) {
    return;
  }

  charCount.textContent = String(prayerText.value.length);
}

function clearErrors() {
  document.querySelectorAll(".field-error").forEach((message) => {
    message.classList.remove("show");
  });

  document.querySelectorAll(".err").forEach((field) => {
    field.classList.remove("err");
  });
}

function showError(fieldId, errorId) {
  const field = document.querySelector(`#${fieldId}`);
  const error = document.querySelector(`#${errorId}`);

  if (field) {
    field.classList.add("err");
  }

  if (error) {
    error.classList.add("show");
  }
}

function validateForm() {
  clearErrors();

  let isValid = true;
  const firstName = document.querySelector("#firstName");
  const email = document.querySelector("#email");
  const prayerType = document.querySelector("#prayerType");

  if (!firstName.value.trim()) {
    showError("firstName", "err-firstName");
    isValid = false;
  }

  if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    showError("email", "err-email");
    isValid = false;
  }

  if (!prayerType.value) {
    showError("prayerType", "err-prayerType");
    isValid = false;
  }

  if (!prayerText.value.trim()) {
    showError("prayerText", "err-prayerText");
    isValid = false;
  }

  return isValid;
}

if (prayerText) {
  prayerText.addEventListener("input", updateCharCount);
}

if (prayerForm) {
  prayerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector(".err");

      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      return;
    }

    const formData = new FormData(prayerForm);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      params.append(key, String(value));
    }

    window.location.href = `prayer-received.html?${params.toString()}`;
  });
}

updateCharCount();
