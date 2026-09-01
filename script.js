const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const BOOKING_URL = "https://book.squareup.com/appointments/0tgtxa0sm9esu3/location/LVQ607CMC13Y8/services?buttonTextColor=ffffff&category_id=GQJ3YKTQRKGEBNOLJSWFXKIU&color=2e2e2e&locale=en&referrer=so";

function setText(selector, value) {
  const el = $(selector);
  if (el && value != null) el.textContent = value;
}
function setHref(selector, value) {
  const el = $(selector);
  if (el && value) el.href = value;
}

async function loadContent() {
  let data;
  try {
    const response = await fetch('content.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('content.json could not be loaded');
    data = await response.json();
  } catch (err) {
    console.warn(err);
    return;
  }

  // Booking buttons are also hard-coded in the HTML as a fallback.
  $$('[data-book]').forEach(a => {
    a.href = (data.business && data.business.booking_url) || BOOKING_URL;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  });

  if (data.hero) {
    setText('[data-hero-eyebrow]', data.hero.eyebrow);
    setText('[data-hero-sub]', data.hero.subheadline);
    setText('[data-announcement]', data.hero.announcement);
  }

  if (data.business) {
    const phone = $('[data-phone]');
    if (phone) {
      phone.textContent = data.business.phone || '';
      phone.href = 'tel:' + (data.business.phone || '').replace(/\D/g,'');
    }
    const email = $('[data-email]');
    if (email) {
      email.textContent = data.business.email || '';
      email.href = 'mailto:' + (data.business.email || '');
    }
    setText('[data-location]', data.business.location);
    setText('[data-instagram]', data.business.instagram);
  }

  const serviceGrid = $('#serviceGrid');
  if (serviceGrid && Array.isArray(data.services)) {
    serviceGrid.innerHTML = data.services.map((s,i)=>`
      <article class="service-card">
        <span class="number">${String(i+1).padStart(2,'0')}</span>
        <h3>${s.name}</h3><p>${s.description}</p><span class="price">${s.price}</span>
      </article>`).join('');
  }

  const packageGrid = $('#packageGrid');
  if (packageGrid && Array.isArray(data.packages)) {
    packageGrid.innerHTML = data.packages.map(p=>`
      <article class="package-card ${p.popular?'popular':''}">
        ${p.popular?'<div class="popular-tag">MOST POPULAR</div>':''}
        <p class="mini">${p.sessions}</p><h3>${p.name}</h3>
        <p class="big-price">${p.price}</p><p class="desc">${p.description}</p>
        <a href="${(data.business && data.business.booking_url) || BOOKING_URL}" target="_blank" rel="noopener noreferrer">Choose Package →</a>
      </article>`).join('');
  }
}

loadContent();

const year = $('#year');
if (year) year.textContent = new Date().getFullYear();

const toggle = $('.menu-toggle');
if (toggle) toggle.addEventListener('click',()=> {
  const nav = $('.nav');
  if (nav) nav.classList.toggle('open');
});

$$('.nav a').forEach(a=>a.addEventListener('click',()=> {
  const nav = $('.nav');
  if (nav) nav.classList.remove('open');
}));
