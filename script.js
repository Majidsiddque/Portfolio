document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- FOOTER YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- TERMINAL TYPEWRITER ---------- */
  const terminalBody = document.getElementById('terminalBody');
  const heroReveal = document.getElementById('heroReveal');

  const lines = [
    { text: '> initializing profile.json', cls: 'comment' },
    { text: '{' },
    { text: '  "name": ', cls: 'k', append: '"Abdul Majid Siddque",', appendCls: 's' },
    { text: '  "role": ', cls: 'k', append: '"Full-Stack · Backend · AI/Web",', appendCls: 's' },
    { text: '  "based_in": ', cls: 'k', append: '"Bhubaneswar, Odisha",', appendCls: 's' },
    { text: '  "status": ', cls: 'k', append: '"seeking full-time SWE roles, 2027"', appendCls: 's' },
    { text: '}' },
    { text: '> render(profile) ✓', cls: 'comment' },
  ];

  function typeTerminal() {
    if (!terminalBody) { revealHero(); return; }

    if (reduceMotion) {
      terminalBody.innerHTML = lines.map(l =>
        (l.cls ? `<span class="${l.cls}">${l.text}</span>` : l.text) +
        (l.append ? `<span class="${l.appendCls || ''}">${l.append}</span>` : '')
      ).join('\n');
      revealHero();
      return;
    }

    let lineIdx = 0;
    let charIdx = 0;
    let building = '';

    function buildLineHTML(segments, upto) {
      // segments: array of {text, cls}; upto: total chars to reveal across segments
      let remaining = upto;
      let html = '';
      for (const seg of segments) {
        if (remaining <= 0) break;
        const take = Math.min(seg.text.length, remaining);
        const chunk = seg.text.slice(0, take);
        html += seg.cls ? `<span class="${seg.cls}">${chunk}</span>` : chunk;
        remaining -= take;
      }
      return html;
    }

    function nextChar() {
      if (lineIdx >= lines.length) {
        terminalBody.innerHTML = building + '<span class="caret"></span>';
        setTimeout(revealHero, 380);
        return;
      }
      const line = lines[lineIdx];
      const segments = [{ text: line.text, cls: line.cls }];
      if (line.append) segments.push({ text: line.append, cls: line.appendCls });
      const totalLen = segments.reduce((a, s) => a + s.text.length, 0);

      charIdx += 2;
      const partial = buildLineHTML(segments, charIdx);
      terminalBody.innerHTML = building + partial + '<span class="caret"></span>';

      if (charIdx >= totalLen) {
        building += buildLineHTML(segments, totalLen) + '\n';
        lineIdx++;
        charIdx = 0;
        setTimeout(nextChar, 90);
      } else {
        setTimeout(nextChar, 14);
      }
    }
    nextChar();
  }

  function revealHero() {
    if (heroReveal) heroReveal.classList.add('show');
    animateStats();
  }

  typeTerminal();

  /* ---------- STAT COUNTERS ---------- */
  let statsAnimated = false;
  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseFloat(el.dataset.count);
      const isDecimal = el.dataset.decimal === 'true';
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();

      if (reduceMotion) {
        el.textContent = (isDecimal ? target.toFixed(2) : target) + suffix;
        return;
      }

      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = (isDecimal ? val.toFixed(2) : Math.round(val)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  const revealTargets = document.querySelectorAll('.section-head, .profile-text, .profile-card, .layer, .found-col, .tl-item, .pcard, .edu-card, .two-col > div, .cert-card');
  revealTargets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(el => io.observe(el));

  /* ---------- TIMELINE FILL ---------- */
  const timeline = document.getElementById('timeline');
  const timelineFill = document.querySelector('.timeline-fill');
  if (timeline && timelineFill) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timelineFill.style.height = '100%';
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    timelineObserver.observe(timeline);
  }

  /* ---------- NAV: active link + hide on scroll down ---------- */
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('main .section, header.hero, footer.footer');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (nav) {
      if (current > lastScroll && current > 200) {
        nav.classList.add('nav-hidden');
      } else {
        nav.classList.remove('nav-hidden');
      }
    }
    lastScroll = current;
  }, { passive: true });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(sec => { if (sec.id) sectionObserver.observe(sec); });

  /* ---------- MOBILE MENU ---------- */
  const burger = document.getElementById('navBurger');
  if (burger) {
    burger.addEventListener('click', () => {
      const linksEl = document.querySelector('.nav-links');
      const ctaEl = document.querySelector('.nav-cta');
      const open = linksEl.style.display === 'flex';
      linksEl.style.display = open ? 'none' : 'flex';
      linksEl.style.cssText += open ? '' : 'flex-direction:column;position:absolute;top:100%;left:0;right:0;background:rgba(11,22,34,.98);padding:20px 32px;gap:18px;';
      if (ctaEl) ctaEl.style.display = open ? 'none' : 'inline-flex';
    });
  }

  /* ---------- CERTIFICATE LIGHTBOX ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, title) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxImg.alt = title || 'Certificate';
    lightboxCaption.textContent = title || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-cert]').forEach(el => {
    el.addEventListener('click', () => openLightbox(el.dataset.cert, el.dataset.title));
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ---------- PROJECT CARD TILT ---------- */
  if (!reduceMotion && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.pcard').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-4px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }
});
