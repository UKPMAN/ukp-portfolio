/* gallery.js — Loads gallery.json and renders the masonry grid */
const Gallery = (() => {
  let all = [], currentFilter = 'all', observer;

  const gridEl    = () => document.getElementById('gallery-grid');
  const filtersEl = () => document.getElementById('gallery-filters');
  const emptyEl   = () => document.getElementById('gallery-empty');

  async function init() {
    try {
      const res  = await fetch('gallery.json?v=' + Date.now());
      if (!res.ok) throw new Error('gallery.json not found');
      const data = await res.json();
      all = data.renders || [];
      applyArtistMeta(data.artist);
      buildFilters();
      renderGrid('all');
    } catch (e) {
      console.error('[Gallery]', e);
      if (gridEl()) gridEl().innerHTML = '<div class="gallery-empty">Gallery loading soon.</div>';
    }
  }

  function applyArtistMeta(a) {
    if (!a) return;
    const set = (id, v) => { const el = document.getElementById(id); if (el && v) el.textContent = v; };
    const href = (id, v) => { const el = document.getElementById(id); if (el && v) el.href = v; };

    set('artist-tagline', a.tagline);
    set('artist-bio',     a.bio);
    set('artist-bio-2',   a.bio);
    set('stat-count',     all.length + '+');

    href('clink-email',  'mailto:' + (a.email  || ''));
    href('clink-insta',  a.instagram  || '#');
    href('clink-artstn', a.artstation || '#');

    set('clink-email-label',  a.email       || '');
    set('clink-insta-label',  a.instagram   || '');
    set('clink-artstn-label', a.artstation  || '');
  }

  function buildFilters() {
    const cats = ['all', ...new Set(all.map(r => r.category).filter(Boolean))];
    filtersEl().innerHTML = cats.map(c =>
      `<button class="filter-btn${c==='all'?' active':''}" data-filter="${c}">${c==='all'?'All Work':c}</button>`
    ).join('');
    filtersEl().addEventListener('click', e => {
      const b = e.target.closest('.filter-btn');
      if (!b) return;
      filtersEl().querySelectorAll('.filter-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      currentFilter = b.dataset.filter;
      renderGrid(currentFilter);
    });
  }

  function renderGrid(filter) {
    const filtered = filter === 'all' ? all : all.filter(r => r.category === filter);
    gridEl().innerHTML = '';
    if (!filtered.length) { emptyEl().style.display = 'block'; return; }
    emptyEl().style.display = 'none';
    filtered.forEach((r, i) => gridEl().appendChild(makeCard(r, i)));
    setupObserver();
    Lightbox.setItems(filtered);
  }

  function makeCard(r, i) {
    const el = document.createElement('div');
    el.className = 'gallery-item';
    el.dataset.index = i;
    const ar = (r.height && r.width) ? (r.height/r.width*100).toFixed(2)+'%' : '70%';
    el.innerHTML = `
      ${r.featured ? '<div class="gi-featured"></div>' : ''}
      <div style="position:relative;padding-top:${ar};background:var(--bg-card)">
        <img class="gallery-item-img" src="${r.image}" alt="${r.title}" loading="lazy"
             style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover"/>
      </div>
      <div class="gallery-item-overlay">
        <div class="gi-title">${r.title}</div>
        <div class="gi-meta">
          <span class="gi-cat">${r.category||''}</span>
          <span class="gi-year">${r.year||''}</span>
        </div>
      </div>`;
    el.addEventListener('click', () => Lightbox.open(i));
    return el;
  }

  function setupObserver() {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.gallery-item').forEach(el => observer.observe(el));
  }

  return { init };
})();
