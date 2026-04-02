/* ═══════════════════════════════════════════════════════════════
   F1 Oficial 2026 — main.js
   Funcionalidades: hamburger, scroll-reveal, countdown, video play
═══════════════════════════════════════════════════════════════ */

/* ── 1. Menú hamburguesa (móvil) ─────────────────────────────── */
(function initHamburger() {
  const btn    = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  if (!btn || !mobileNav) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    if (isOpen) {
      mobileNav.classList.remove('open');
      mobileNav.hidden = true;
    } else {
      mobileNav.hidden = false;
      mobileNav.classList.add('open');
    }
  });

  /* Cierra el drawer al hacer clic fuera */
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !mobileNav.contains(e.target)) {
      btn.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      mobileNav.hidden = true;
    }
  });

  /* Cierra el drawer al presionar Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
      btn.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      mobileNav.hidden = true;
      btn.focus();
    }
  });
})();


/* ── 2. Scroll reveal (IntersectionObserver) ─────────────────── */
(function initReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('vis');
          io.unobserve(entry.target); /* dispara una sola vez */
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();


/* ── 3. Cuenta regresiva — próxima carrera ───────────────────── */
(function initCountdown() {
  const raceDate = new Date('2026-04-12T17:00:00+03:00');

  const elD = document.getElementById('cd-d');
  const elH = document.getElementById('cd-h');
  const elM = document.getElementById('cd-m');
  const elS = document.getElementById('cd-s');

  if (!elD) return;

  const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

  function tick() {
    const diff = raceDate - Date.now();
    if (diff <= 0) {
      elD.textContent = elH.textContent = elM.textContent = elS.textContent = '00';
      return;
    }
    elD.textContent = pad(Math.floor(diff / 86_400_000));
    elH.textContent = pad(Math.floor(diff % 86_400_000 / 3_600_000));
    elM.textContent = pad(Math.floor(diff % 3_600_000  / 60_000));
    elS.textContent = pad(Math.floor(diff % 60_000     / 1_000));
  }

  tick();
  setInterval(tick, 1000);
})();


/* ── 4. Reproducción de video con clic ───────────────────────── */
(function initVideoCards() {
  /*
   * Los .video-card[data-video-id] reemplazan su thumbnail
   * por un iframe de YouTube al hacer clic o presionar Enter.
   */
  document.querySelectorAll('.video-card[data-video-id]').forEach((card) => {
    const videoId = card.dataset.videoId;
    const thumb   = card.querySelector('.video-card__thumb');
    const img     = card.querySelector('.video-card__thumb img');

    function loadVideo() {
      if (card.dataset.loaded) return;
      card.dataset.loaded = 'true';

      const iframe = document.createElement('iframe');
      iframe.src          = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.title        = card.querySelector('.video-card__title')?.textContent || 'Video F1';
      iframe.allow        = 'autoplay; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.loading      = 'lazy';
      iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;';

      if (img) img.style.display = 'none';
      const overlay = card.querySelector('.video-card__overlay');
      if (overlay) overlay.style.display = 'none';
      thumb.appendChild(iframe);
    }

    card.addEventListener('click',  loadVideo);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadVideo(); } });
  });
})();


/* ── 5. Activo de navegación (marca el enlace actual) ─────────── */
(function highlightActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.primary-nav a, .mobile-nav a').forEach((a) => {
    if (a.getAttribute('href') === path) {
      a.setAttribute('aria-current', 'page');
      a.style.color = 'var(--red)';
    }
  });
})();
