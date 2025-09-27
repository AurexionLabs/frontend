
let currentProduct = {};
let paymentStarted = false;

function openCheckout(productName, price, productId) {
  currentProduct = { productName, price, productId };
  const modal = document.getElementById('checkoutModal');
  modal.style.display = 'flex';

  // Lock background scroll
  document.body.style.overflow = 'hidden';
  
  document.getElementById('modalProductName').textContent = productName;
  document.getElementById('modalProductPrice').textContent = `$${price}`;
  document.getElementById('checkoutContainer').innerHTML = '';
  document.getElementById('checkoutEmail').value = '';
  
  // Reset disclaimers
  document.getElementById('checkoutDisclaimer').style.display = 'none';
  const tradingDisclaimer = document.getElementById('tradingDisclaimer');
  if (tradingDisclaimer) tradingDisclaimer.style.display = 'block';

  // Setup button
  const btn = document.getElementById('checkoutProceedBtn');
  btn.textContent = "Proceed to Payment";
  btn.disabled = false;
  btn.style.pointerEvents = "auto";
  btn.onclick = proceedToPayment;
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Proceed to payment
async function proceedToPayment() {
  const emailInput = document.getElementById('checkoutEmail');
  const btn = document.getElementById('checkoutProceedBtn');
  const email = emailInput.value.trim();

  if (!isValidEmail(email)) {
    alert('Please enter a valid email address!');
    return;
  }

  // Hide trading/risk disclaimer when proceeding
  const tradingDisclaimer = document.getElementById('tradingDisclaimer');
  if (tradingDisclaimer) tradingDisclaimer.style.display = 'none';

  paymentStarted = true;

  // Show checkout disclaimer
  document.getElementById('checkoutDisclaimer').style.display = 'block';

  // Disable button during loading
  btn.textContent = "Loading Payment...";
  btn.disabled = true;
  btn.style.pointerEvents = "none";

  // Show loading spinner
  document.getElementById('checkoutContainer').innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <span>Loading checkout...</span>
    </div>
  `;

  try {
    const res = await fetch('/.netlify/functions/create-nowpayments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        productName: currentProduct.productName,
        productId: currentProduct.productId,
        email 
      })
    });

    const data = await res.json();
    if (!data.id) throw new Error("No invoice ID returned");

    // Embed NowPayments iframe
    document.getElementById('checkoutContainer').innerHTML = `
      <iframe class="checkout-iframe" 
              src="https://nowpayments.io/embeds/payment-widget?iid=${data.id}" 
              width="100%" height="620px" frameborder="0" scrolling="auto" 
              style="overflow-y: hidden;">
        Can't load widget
      </iframe>
    `;

    // Update button after iframe loads
    btn.textContent = "Change Email";
    btn.disabled = false;
    btn.style.pointerEvents = "auto";
  } catch (err) {
    console.error("Error creating payment:", err);
    document.getElementById('checkoutContainer').innerHTML = `
      <div class="loading">
        <span>Failed to load checkout. Please try again.</span>
      </div>
    `;
    btn.textContent = "Proceed to Payment";
    btn.disabled = false;
    btn.style.pointerEvents = "auto";
    paymentStarted = false;
    document.getElementById('checkoutDisclaimer').style.display = 'none';
    
    // Optionally show trading/risk disclaimer again on error
    if (tradingDisclaimer) tradingDisclaimer.style.display = 'block';
  }
}


// Close modal
function closeCheckout() {
  if (paymentStarted) {
    const confirmed = confirm(
      "Are you sure you want to close? Any pending payments might fail."
    );
    if (!confirmed) return;
  }

  const modal = document.getElementById('checkoutModal');
  modal.style.display = 'none';

  // Unlock background scroll
  document.body.style.overflow = '';

  document.getElementById('checkoutContainer').innerHTML = '';
  document.getElementById('checkoutEmail').value = '';
  document.getElementById('checkoutDisclaimer').style.display = 'none';
  paymentStarted = false;
}

// Close button
document.getElementById('checkoutCloseBtn').addEventListener('click', closeCheckout);

// Close modal when clicking outside
window.addEventListener('click', (event) => {
  const modal = document.getElementById('checkoutModal');
  if (event.target === modal && !paymentStarted) {
    closeCheckout();
  }
});

// Optional: handle messages from iframe (if NowPayments sends them)
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'payment_completed') {
    closeCheckout();
    alert('Thank you for your purchase! You will receive an email with your license shortly.');
  }
});

// ------------------ MOBILE HAMBURGER MENU ------------------
// Hamburger icon is automatically added to all pages
const hamburger = document.createElement('div');
hamburger.classList.add('hamburger');
hamburger.innerHTML = '&#9776;'; // hamburger icon
document.querySelector('.header-content').prepend(hamburger);

// Toggle nav visibility on mobile
hamburger.addEventListener('click', () => {
  const nav = document.querySelector('nav');
  nav.classList.toggle('active');

  // Toggle visibility of the lower menu-divider
  const lowerDivider = document.querySelector('header nav + .menu-divider');
  if (nav.classList.contains('active')) {
    lowerDivider.style.display = 'block';
  } else {
    lowerDivider.style.display = 'none';
  }
});

// Mobile submenu toggle (flattened menu: only first submenu "Store" is interactive)
document.querySelectorAll('.submenu-btn').forEach((btn, index) => {
  btn.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      // Only allow toggle for the first submenu ("Store")
      if (index !== 0) return;

      e.preventDefault(); // prevent default link behavior
      btn.classList.toggle('active');
    }
  });
});

