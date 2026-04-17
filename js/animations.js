document.addEventListener('DOMContentLoaded', () => {

  // ── 1. PAGINA FADE-TRANSITIE ──────────────────────────────────────────
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('tel:')
        && !href.startsWith('mailto:') && !href.startsWith('http')
        && !href.startsWith('//')) {
      link.addEventListener('click', e => {
        e.preventDefault();
        document.body.classList.add('page-exit');
        setTimeout(() => { window.location.href = href; }, 220);
      });
    }
  });

  // ── 2. SCROLL REVEAL ──────────────────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.card, .price-card, .review-card, .beblitz-section, .contact-item'
  ).forEach((el, i) => {
    el.classList.add('reveal');
    const siblings = Array.from(el.parentElement.children);
    const idx = siblings.indexOf(el);
    el.style.transitionDelay = `${idx * 0.09}s`;
    revealObserver.observe(el);
  });

  // Secties titels + subtitels
  document.querySelectorAll('.section-title, .section-sub, .section-tag').forEach(el => {
    el.classList.add('reveal-text');
    revealObserver.observe(el);
  });

  // ── 3. TELLER ANIMATIE ────────────────────────────────────────────────
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.getAttribute('data-count');
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const startTime = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(ease * target) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  // ── 4. HAMBURGER MENU ─────────────────────────────────────────────────
  const toggle = document.querySelector('.navbar__toggle');
  const links  = document.querySelector('.navbar__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // ── 5. FORMULIER AFHANDELING (Formspree AJAX) ─────────────────────────
  document.querySelectorAll('form').forEach(form => {
    if (!form.action || form.action.includes('#')) return;
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const origHtml = btn.innerHTML;
      btn.innerHTML = 'Versturen…';
      btn.classList.add('btn--loading');
      btn.disabled = true;
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          form.innerHTML = `
            <div class="form-success">
              <div class="form-success__icon">✅</div>
              <h4>Verstuurd!</h4>
              <p>Bedankt voor je bericht. Wij nemen zo snel mogelijk contact met je op — doorgaans binnen 1 uur op werkdagen.</p>
            </div>`;
        } else {
          throw new Error('server');
        }
      } catch {
        btn.innerHTML = origHtml;
        btn.classList.remove('btn--loading');
        btn.disabled = false;
        alert('Er is iets misgegaan. Probeer het opnieuw of bel ons direct op 0598 744 299.');
      }
    });
  });

});
