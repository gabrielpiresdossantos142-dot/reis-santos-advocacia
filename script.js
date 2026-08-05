// Ano no rodapé
document.getElementById('ano').textContent = new Date().getFullYear();

// Sombra da navbar ao rolar
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 12);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Menu mobile
const toggle = document.querySelector('.nav__toggle');
const mobile = document.getElementById('menu-mobile');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  if (open) {
    mobile.removeAttribute('data-open');
    mobile.hidden = true;
  } else {
    mobile.hidden = false;
    mobile.setAttribute('data-open', '');
  }
});
mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', 'false');
  mobile.removeAttribute('data-open');
  mobile.hidden = true;
}));

// Revelação progressiva com stagger
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.transitionDelay = Math.min(idx * 80, 400) + 'ms';
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// Contadores animados
const counters = document.querySelectorAll('.stat__num[data-count]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const animateCount = (el) => {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const suffix = el.dataset.suffix || '';
  if (reduceMotion) { el.textContent = target.toFixed(decimals).replace('.', ',') + suffix; return; }
  const dur = 1400;
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    el.textContent = val.toFixed(decimals).replace('.', ',') + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target.toFixed(decimals).replace('.', ',') + suffix;
  };
  requestAnimationFrame(step);
};
if ('IntersectionObserver' in window) {
  const cio = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  counters.forEach(c => cio.observe(c));
}

// Leve efeito de tilt/parallax nos cards de área (desktop, sem reduce-motion)
if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}
