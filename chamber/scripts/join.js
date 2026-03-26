const timestampInput = document.querySelector('#timestamp');
if (timestampInput) {
  timestampInput.value = new Date().toISOString();
}

const modalButtons = document.querySelectorAll('[data-modal]');
const closeButtons = document.querySelectorAll('[data-close]');

modalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modalId = button.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    if (modal && typeof modal.showModal === 'function') {
      modal.showModal();
    }
  });
});

closeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modal = button.closest('dialog');
    if (modal) {
      modal.close();
    }
  });
});

document.addEventListener('click', (event) => {
  if (event.target instanceof HTMLDialogElement) {
    event.target.close();
  }
});
