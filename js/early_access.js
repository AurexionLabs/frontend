const earlyAccessLink = document.getElementById('earlyAccessLink');
const earlyAccessModal = document.getElementById('earlyAccessModal');
const earlyAccessClose = document.getElementById('earlyAccessClose');

// Open modal
earlyAccessLink.addEventListener('click', (e) => {
  e.preventDefault();
  earlyAccessModal.style.display = 'flex';
});

// Close modal on X
earlyAccessClose.addEventListener('click', () => {
  earlyAccessModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === earlyAccessModal) {
    earlyAccessModal.style.display = 'none';
  }
});

