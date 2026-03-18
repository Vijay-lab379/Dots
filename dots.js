/**
 * DOTS — by Vijay B.
 * dots.js
 *
 * 1. Cursor
 * 2. Scroll progress + nav state
 * 3. Hero title reveal
 * 4. Scroll reveal
 * 5. Stagger delays
 * 6. Filter system
 * 7. Project count
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────
     1. CURSOR
     ───────────────────────────── */
  const cur  = document.getElementById('cur');
  const curO = document.getElementById('cur-o');
  let mx = -200, my = -200, rx = -200, ry = -200;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  document.querySelectorAll('a, button, .dot-card, .filter-btn, .card-link').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
  });

  (function loop() {
    if (cur)  { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
    if (curO) {
      rx += (mx - rx) * .1; ry += (my - ry) * .1;
      curO.style.left = rx + 'px'; curO.style.top = ry + 'px';
    }
    requestAnimationFrame(loop);
  })();


  /* ─────────────────────────────
     2. SCROLL PROGRESS + NAV
     ───────────────────────────── */
  const prog = document.getElementById('prog');
  const nav  = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    if (prog) prog.style.width = (total > 0 ? window.scrollY / total * 100 : 0) + '%';
    if (nav)  nav.classList.toggle('s', window.scrollY > 20);
  }, { passive: true });


  /* ─────────────────────────────
     3. HERO TITLE REVEAL
     ───────────────────────────── */
  document.querySelectorAll('.hero-title .line span').forEach((el, i) => {
    setTimeout(() => el.classList.add('up'), i * 100 + 200);
  });


  /* ─────────────────────────────
     4. SCROLL REVEAL
     ───────────────────────────── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));


  /* ─────────────────────────────
     5. STAGGER DELAYS
     ───────────────────────────── */
  document.querySelectorAll('.dot-card').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.07) + 's';
  });


  /* ─────────────────────────────
     6. FILTER SYSTEM
     How it works:
     - Each .dot-card has data-tags="js api dom ..."
     - Filter buttons have data-filter="js" etc.
     - Clicking a filter hides cards that don't match.
     - "all" shows everything.
     - The empty state shows if nothing matches.

     To add a new filter tag:
     1. Add a button in HTML with data-filter="yourtag"
     2. Add that tag to the relevant card's data-tags
     ───────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.dot-card');
  const emptyState = document.getElementById('empty-state');
  const grid       = document.getElementById('dots-grid');

  // Sync the "all" button in empty state too
  if (emptyState) {
    emptyState.querySelector('.filter-btn')?.addEventListener('click', () => {
      applyFilter('all');
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyFilter(btn.dataset.filter);
    });
  });

  function applyFilter(filter) {
    // Update active button state
    filterBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.filter === filter);
    });

    let visible = 0;

    cards.forEach(card => {
      const tags = card.dataset.tags || '';
      const show = filter === 'all' || tags.includes(filter);

      if (show) {
        card.classList.remove('hidden');
        visible++;
      } else {
        card.classList.add('hidden');
      }
    });

    // Show/hide empty state
    if (emptyState) {
      emptyState.classList.toggle('visible', visible === 0);
    }

    // Update visible project count in hero
    const countEl = document.getElementById('project-count');
    if (countEl) countEl.textContent = visible;

    // Rebuild grid border: if only 1 card, remove gap background
    if (grid) {
      grid.style.background = visible <= 1 ? 'transparent' : '';
    }
  }


  /* ─────────────────────────────
     7. PROJECT COUNT (auto)
     Updates hero count to match
     total number of .dot-card els
     ───────────────────────────── */
  const countEl = document.getElementById('project-count');
  if (countEl) countEl.textContent = cards.length;

});
