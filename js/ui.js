/* ui.js — Loading screen, header scroll, scroll-reveal, nav highlight */
const UI = (() => {
  function initLoader() {
    const screen = document.getElementById('loading-screen');
    const fill   = document.getElementById('loader-fill');
    if (!screen) return;
    let p = 0;
    const t = setInterval(() => { p += Math.random()*22; if (fill) fill.style.width = Math.min(p,88)+'%'; }, 130);
    window.addEventListener('load', () => {
      clearInterval(t);
      if (fill) fill.style.width = '100%';
      setTimeout(() => screen.classList.add('out'), 450);
    });
  }

  function initHeader() {
    const h = document.getElementById('site-header');
    if (!h) return;
    window.addEventListener('scroll', () => h.classList.toggle('scrolled', scrollY > 30), { passive: true });
  }

  function initReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
  }

  function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.header-nav a[href^="#"]');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(a => a.style.color = '');
          const a = document.querySelector(`.header-nav a[href="#${e.target.id}"]`);
          if (a) a.style.color = 'var(--accent)';
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => obs.observe(s));
  }

  function init() {
    initLoader();
    initHeader();
    initReveal();
    initNavHighlight();
  }

  return { init };
})();
