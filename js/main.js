/* ============================================================
   Cafe Parco — interactions
   Lenis smooth scroll · GSAP ScrollTrigger · Splitting headings
   · Swiper gallery · menu tabs · mobile nav · live open status
   ============================================================ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 1. Splitting headings ---------- */
Splitting();

/* ---------- 2. Lenis + GSAP, kept in lockstep ---------- */
let lenis;
if (!reduceMotion) {
  gsap.registerPlugin(ScrollTrigger);

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* Anchor links route through Lenis for a smooth glide */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -70 });
      closeMobileNav();
    });
  });
}

/* ---------- 3. Scroll reveals ---------- */
if (!reduceMotion) {
  /* Split-heading character rise */
  document.querySelectorAll('[data-splitting]').forEach((heading) => {
    const chars = heading.querySelectorAll('.char');
    gsap.from(chars, {
      yPercent: 110,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.018,
      scrollTrigger: { trigger: heading, start: 'top 85%' },
    });
  });

  /* Generic fade-up for blocks */
  const reveals = [
    '.hero__lede', '.hero__cta', '.hero__meta',
    '.story__text p', '.story__signs', '.story__figure',
    '.favs__head',
    '.menu__note', '.menu__tabs', '.menu__cta',
    '.gallery__note', '.gallery__swiper',
    '.reviews__head', '.reviews__score', '.reviews__cta', '.reviews__swiper',
    '.visit__addr', '.visit__phone', '.visit__tags', '.hours', '.visit__map',
  ];
  reveals.forEach((sel) => {
    gsap.utils.toArray(sel).forEach((el) => {
      gsap.from(el, {
        y: 30, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });
  });

  /* Favourite cards: fade + image scale-in (transform on card is reserved for the editorial offset) */
  gsap.utils.toArray('.fav').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, duration: 0.8, ease: 'power2.out', delay: (i % 4) * 0.08,
      scrollTrigger: { trigger: '.favs__grid', start: 'top 80%' },
    });
    gsap.from(card.querySelector('.fav__img img'), {
      scale: 1.12, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.favs__grid', start: 'top 80%' },
    });
  });

  /* Hero image: gentle scale on scroll (no translate — avoids gaps in the split layout) */
  gsap.to('.hero__media img', {
    scale: 1.06, ease: 'none', transformOrigin: 'center',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
}

/* ---------- 4. Header state on scroll ---------- */
const header = document.querySelector('.site-header');
const setHeader = () => header.classList.toggle('scrolled', window.scrollY > 60);
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

/* ---------- 5. Mobile nav ---------- */
const toggle = document.querySelector('.nav-toggle');
const drawer = document.querySelector('.mobile-nav');
function openMobileNav() {
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  toggle.setAttribute('aria-expanded', 'true');
}
function closeMobileNav() {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  toggle.setAttribute('aria-expanded', 'false');
}
toggle.addEventListener('click', () => {
  drawer.classList.contains('open') ? closeMobileNav() : openMobileNav();
});

/* ---------- 6. Menu tabs ---------- */
const tabs = document.querySelectorAll('.menu__tab');
const panels = document.querySelectorAll('.menu__panel');
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const name = tab.dataset.tab;
    tabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.forEach((p) => {
      const show = p.dataset.panel === name;
      p.classList.toggle('is-active', show);
      p.hidden = !show;
    });
    const active = document.querySelector(`.menu__panel[data-panel="${name}"]`);
    if (active && !reduceMotion) {
      gsap.fromTo(active.querySelectorAll('li'),
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.05 });
    }
    if (lenis) ScrollTrigger.refresh();
  });
});

/* ---------- 7. Swiper gallery ---------- */
new Swiper('.gallery__swiper', {
  slidesPerView: 'auto',
  spaceBetween: 20,
  grabCursor: true,
  speed: 600,
  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
  pagination: { el: '.gallery__dots', clickable: true },
  breakpoints: { 768: { spaceBetween: 28 } },
});

/* ---------- 7b. Swiper reviews ---------- */
new Swiper('.reviews__swiper', {
  slidesPerView: 'auto',
  spaceBetween: 20,
  grabCursor: true,
  speed: 600,
  pagination: { el: '.reviews__dots', clickable: true },
  breakpoints: { 768: { spaceBetween: 28 } },
});

/* ---------- 8. Live open / closed status ---------- */
/* Hours: Mon–Fri 08:30–18:00, Sat 09:00–18:00, Sun 09:00–18:00.
   Confirm these with the café and adjust here if they change. */
const HOURS = {
  0: [9 * 60, 18 * 60],            // Sunday
  1: [8 * 60 + 30, 18 * 60],       // Monday
  2: [8 * 60 + 30, 18 * 60],
  3: [8 * 60 + 30, 18 * 60],
  4: [8 * 60 + 30, 18 * 60],
  5: [8 * 60 + 30, 18 * 60],
  6: [9 * 60, 18 * 60],            // Saturday
};

function fmt(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const am = h < 12 || h === 24;
  const hh = ((h + 11) % 12) + 1;
  return `${hh}${m ? ':' + String(m).padStart(2, '0') : ''}${am ? 'am' : 'pm'}`;
}

function updateStatus() {
  const now = new Date();
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const [open, close] = HOURS[day];
  const isOpen = mins >= open && mins < close;

  let label;
  if (isOpen) {
    label = close - mins <= 30 ? `Open · closes ${fmt(close)}` : `Open now · until ${fmt(close)}`;
  } else if (mins < open) {
    label = `Closed · opens ${fmt(open)}`;
  } else {
    const next = HOURS[(day + 1) % 7][0];
    label = `Closed · opens ${fmt(next)} tomorrow`;
  }

  document.querySelectorAll('[data-open-status]').forEach((node) => {
    node.classList.remove('is-open', 'is-closed');
    node.classList.add(isOpen ? 'is-open' : 'is-closed');
    const text = node.querySelector('.status__text');
    if (text) text.textContent = label;
  });
}
updateStatus();
setInterval(updateStatus, 60 * 1000);

/* Highlight today's row in the hours list */
const todayIndex = new Date().getDay();
document.querySelectorAll('.hours li').forEach((li) => {
  const spec = li.dataset.day;
  const days = spec.includes('-')
    ? (() => { const [a, b] = spec.split('-').map(Number); const r = []; for (let i = a; i <= b; i++) r.push(i); return r; })()
    : [Number(spec)];
  if (days.includes(todayIndex)) li.classList.add('is-today');
});

/* ---------- 9. Footer year ---------- */
const yearEl = document.querySelector('[data-year]');
if (yearEl) yearEl.textContent = new Date().getFullYear();
