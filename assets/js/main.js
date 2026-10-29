'use strict';
/* DOM references stay private; the script is loaded with defer. */
(() => {
  const header = document.getElementById('header');
  const navMenu = document.getElementById('nav-menu');
  const toggle = document.getElementById('nav-toggle');
  const navLinks = [...document.querySelectorAll('.nav__link')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const topLink = document.getElementById('scroll-top');
  const themeButton = document.getElementById('theme-button');
  const readingProgress = document.getElementById('reading-progress');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Mobile menu, including keyboard and outside-click dismissal. */
  function closeMenu(restoreFocus = false) {
    navMenu?.classList.remove('show-menu');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open menu');
    if (restoreFocus) toggle?.focus();
  }
  toggle?.addEventListener('click', () => {
    const open = navMenu?.classList.toggle('show-menu') ?? false;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  navLinks.forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('click', event => {
    if (!header?.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navMenu?.classList.contains('show-menu')) closeMenu(true);
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', () => closeMenu());

  /* One passive scroll listener; selectors match complete section IDs. */
  let ticking = false;
  function updateScrollUI() {
    const scrollY = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (readingProgress) readingProgress.style.transform = `scaleX(${total > 0 ? Math.max(0, Math.min(1, scrollY / total)) : 0})`;
    header?.classList.toggle('scroll-header', scrollY >= 40);
    topLink?.classList.toggle('show-scroll', scrollY >= 560);
    const offset = (header?.offsetHeight ?? 88) + 90;
    let active = sections[0]?.id;
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= offset) active = section.id;
    });
    navLinks.forEach(link => {
      const current = link.getAttribute('href') === `#${active}`;
      link.classList.toggle('active-link', current);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(updateScrollUI); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', updateScrollUI);
  updateScrollUI();

  /* Theme preference survives reloads; storage restrictions never break the UI. */
  const sun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>';
  const moon = themeButton?.innerHTML ?? '';
  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-theme', isDark);
    document.documentElement.style.colorScheme = theme;
    if (themeButton) {
      themeButton.innerHTML = isDark ? sun : moon;
      themeButton.setAttribute('aria-pressed', String(isDark));
      themeButton.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
    }
  }
  let selectedTheme = 'dark';
  try { selectedTheme = localStorage.getItem('selected-theme') || 'dark'; } catch { /* Restricted browser storage. */ }
  applyTheme(selectedTheme === 'light' ? 'light' : 'dark');
  themeButton?.addEventListener('click', () => {
    const theme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
    applyTheme(theme);
    try { localStorage.setItem('selected-theme', theme); } catch { /* Current-tab theme remains available. */ }
  });

  /* Native reveal animation: content stays readable without JS or a CDN. */
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-pending');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('is-pending');
      observer.observe(element);
    });
  }

  /* Search and category filters work together, with accessible result feedback. */
  const search = document.getElementById('skill-search');
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const skillCards = [...document.querySelectorAll('.skill-card')];
  const skillStatus = document.getElementById('skill-status');
  const resetButton = document.getElementById('reset-skills');
  const emptyState = document.getElementById('skills-empty');
  let selectedCategory = 'all';
  let lastQuery = '';
  const expandSkills = document.getElementById('toggle-all-skills');
  const skillIndex = new Map(skillCards.map(card => [card,
    [card.querySelector('h3')?.textContent, ...[...card.querySelectorAll('.skill-tags li')].map(tag => tag.textContent)].join(' ').toLocaleLowerCase()
  ]));
  function updateExpansionControl() {
    const visibleDetails = skillCards.filter(card => !card.hidden).map(card => card.querySelector('details')).filter(Boolean);
    const expanded = visibleDetails.length > 0 && visibleDetails.every(detail => detail.open);
    if (expandSkills) {
      expandSkills.hidden = visibleDetails.length === 0;
      expandSkills.textContent = expanded ? 'Collapse skill details −' : 'Expand skill details +';
      expandSkills.setAttribute('aria-expanded', String(expanded));
    }
  }
  document.querySelectorAll('.skill-details').forEach(detail => detail.addEventListener('toggle', () => {
    updateExpansionControl();
    updateScrollUI();
  }));
  expandSkills?.addEventListener('click', () => {
    const open = expandSkills.getAttribute('aria-expanded') !== 'true';
    skillCards.filter(card => !card.hidden).forEach(card => { const details = card.querySelector('details'); if (details) details.open = open; });
    updateExpansionControl();
  });
  function filterSkills() {
    const query = (search?.value || '').trim().toLocaleLowerCase();
    let visible = 0;
    skillCards.forEach(card => {
      const matchesCategory = selectedCategory === 'all' || card.dataset.category === selectedCategory;
      const matchesQuery = skillIndex.get(card).includes(query);
      card.hidden = !(matchesCategory && matchesQuery);
      card.querySelectorAll('.skill-tags li').forEach(tag => {
        tag.classList.toggle('is-match', query.length > 0 && tag.textContent.toLocaleLowerCase().includes(query));
      });
      const details = card.querySelector('details');
      if (details && (query || lastQuery)) details.open = !!query && !card.hidden;
      if (!card.hidden) visible++;
    });
    filterButtons.forEach(button => {
      const selected = button.dataset.filter === selectedCategory;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    if (skillStatus) skillStatus.textContent = query || selectedCategory !== 'all'
      ? `Showing ${visible} of ${skillCards.length} skill categories`
      : `Showing all ${skillCards.length} skill categories`;
    if (emptyState) emptyState.hidden = visible !== 0;
    if (resetButton) resetButton.hidden = query === '' && selectedCategory === 'all';
    lastQuery = query;
    updateExpansionControl();
    updateScrollUI();
  }
  function resetSkills() {
    selectedCategory = 'all';
    skillCards.forEach(card => { const details = card.querySelector('details'); if (details) details.open = false; });
    if (search) search.value = '';
    filterSkills();
  }
  search?.addEventListener('input', filterSkills);
  filterButtons.forEach(button => button.addEventListener('click', () => {
    selectedCategory = button.dataset.filter;
    filterSkills();
  }));
  resetButton?.addEventListener('click', resetSkills);
  document.getElementById('clear-skills')?.addEventListener('click', () => {
    resetSkills();
    search?.focus();
  });
  filterSkills();

  /* Copy feedback reports actual success; mail and phone links use native apps. */
  const copyButton = document.getElementById('copy-email');
  const copyStatus = document.getElementById('copy-status');
  copyButton?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('sachinpranami92@gmail.com');
      copyStatus.textContent = 'Email address copied.';
    } catch {
      copyStatus.textContent = 'Copy is unavailable in this browser. Select the email address above to copy it manually.';
    }
  });
  /* A native dialog supplies focus containment and Escape dismissal. */
  const portraitDialog = document.getElementById('portrait-dialog');
  document.getElementById('portrait-preview')?.addEventListener('click', () => {
    portraitDialog?.showModal();
    document.body.classList.add('photo-open');
  });
  document.getElementById('close-portrait')?.addEventListener('click', () => portraitDialog?.close());
  portraitDialog?.addEventListener('close', () => document.body.classList.remove('photo-open'));
  portraitDialog?.addEventListener('click', event => {
    const rect = portraitDialog.getBoundingClientRect();
    if (event.target === portraitDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) portraitDialog.close();
  });

  /* Keyboard search never intercepts text entry or browser shortcuts. */
  document.addEventListener('keydown', event => {
    const target = event.target;
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !portraitDialog?.open &&
      !(target instanceof Element && target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'))) {
      event.preventDefault();
      search?.focus({ preventScroll: true });
      search?.scrollIntoView({ behavior: reduceMotion.matches ? 'instant' : 'smooth', block: 'center' });
    }
  });

  /* Small pointer glow; at most one scheduled update per card per frame. */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion.matches) {
    skillCards.forEach(card => {
      let glowFrame = 0;
      let pointerX = 0;
      let pointerY = 0;
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        pointerX = event.clientX - rect.left;
        pointerY = event.clientY - rect.top;
        if (!glowFrame) glowFrame = requestAnimationFrame(() => {
          card.style.setProperty('--glow-x', `${pointerX}px`);
          card.style.setProperty('--glow-y', `${pointerY}px`);
          glowFrame = 0;
        });
      }, { passive: true });
      card.addEventListener('pointerleave', () => {
        cancelAnimationFrame(glowFrame);
        glowFrame = 0;
        card.style.removeProperty('--glow-x');
        card.style.removeProperty('--glow-y');
      });
    });
  }

})();
