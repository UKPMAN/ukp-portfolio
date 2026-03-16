/* lightbox.js — Full-screen image viewer */
const Lightbox = (() => {
  let items = [], current = 0;

  const $ = id => document.getElementById(id);

  function init() {
    $('lb-close').addEventListener('click', close);
    $('lb-prev').addEventListener('click', () => nav(-1));
    $('lb-next').addEventListener('click', () => nav(1));
    $('lb-backdrop').addEventListener('click', close);
    document.addEventListener('keydown', e => {
      if (!$('lightbox').classList.contains('open')) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  nav(-1);
      if (e.key === 'ArrowRight') nav(1);
    });
    let tx = 0;
    $('lightbox').addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    $('lightbox').addEventListener('touchend',   e => {
      const d = tx - e.changedTouches[0].clientX;
      if (Math.abs(d) > 50) nav(d > 0 ? 1 : -1);
    });
  }

  function setItems(list) { items = list; }

  function open(i) {
    current = i;
    render();
    $('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    $('lightbox').classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { $('lb-img').src = ''; }, 350);
  }

  function nav(dir) {
    current = ((current + dir) + items.length) % items.length;
    const img = $('lb-img');
    img.style.cssText = 'opacity:0;transform:translateX(' + (dir*18) + 'px);transition:none';
    setTimeout(() => {
      render();
      img.style.cssText = 'opacity:1;transform:translateX(0);transition:opacity .28s,transform .28s';
    }, 180);
  }

  function render() {
    const r = items[current]; if (!r) return;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v || ''; };
    $('lb-img').src = r.image;
    $('lb-img').alt = r.title;
    set('lb-title', r.title);
    set('lb-desc',  r.description);
    set('lb-cat',   r.category);
    set('lb-year',  r.year);
    set('lb-sw',    (r.software||[]).join(', '));
    set('lb-counter', (current+1) + ' / ' + items.length);
    $('lb-tags').innerHTML = (r.software||[]).map(s => `<span class="lb-tag">${s}</span>`).join('');
  }

  return { init, open, close, setItems };
})();
