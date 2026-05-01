/* ============================================
   THEO NOGUEIRA V2 — JS
============================================ */

(() => {
  'use strict';

  /* ── Nav scroll state ── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu toggle ── */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open);
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  /* ── Scroll reveal with IntersectionObserver ── */
  const reveals = document.querySelectorAll('.reveal, .reveal-soft, .reveal-side');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ── Films section scroll-spy ── */
  const spyLinks = document.querySelectorAll('.films-section-nav a[data-spy]');
  const spyTargets = Array.from(spyLinks)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (spyLinks.length && spyTargets.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          spyLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    spyTargets.forEach(t => spyObserver.observe(t));
  }

  /* ── Video lightbox ── */
  const lightbox = document.querySelector('.video-lightbox');
  const lightboxTriggers = document.querySelectorAll('[data-video-trigger]');
  const lightboxClose = document.querySelector('.video-lightbox-close');
  const lightboxTitle = document.querySelector('.video-lightbox-title');
  const lightboxMeta = document.querySelector('.video-lightbox-meta');
  const lightboxDescription = document.querySelector('.video-lightbox-description');
  const lightboxPlaceholder = document.querySelector('.video-lightbox-placeholder');

  const syncLightboxCopy = (trigger) => {
    if (!trigger) return;
    if (lightboxTitle) {
      lightboxTitle.textContent = trigger.dataset.videoTitle || 'reel';
    }
    if (lightboxMeta) {
      lightboxMeta.textContent = trigger.dataset.videoMeta || 'selected works';
    }
    if (lightboxDescription) {
      lightboxDescription.textContent = trigger.dataset.videoDescription || 'Vimeo embed can drop in here when the final links are ready.';
    }
  };

  const openLightbox = (trigger) => {
    if (!lightbox) return;
    syncLightboxCopy(trigger);

    const videoId = trigger.dataset.videoId;

    if (lightboxPlaceholder && videoId) {
      lightboxPlaceholder.innerHTML = `
      <iframe
        src="https://player.vimeo.com/video/${videoId}"
        width="100%"
        height="500"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen>
      </iframe>
    `;
    }

    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    if (!lightbox) return;

    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';

    if (lightboxPlaceholder) {
      lightboxPlaceholder.innerHTML = '';
    }
  };
  function bindLightboxTriggers() {
    const triggers = document.querySelectorAll('[data-video-trigger]');

    triggers.forEach(t => {
      if (t.dataset.bound) return;

      t.dataset.bound = "true";

      t.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(t);
      });

      t.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(t);
        }
      });
    });
  }

  window.bindLightboxTriggers = bindLightboxTriggers;

  bindLightboxTriggers();

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ── Back to top ── */
  const topLinks = document.querySelectorAll('[data-back-to-top]');
  topLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
})();
