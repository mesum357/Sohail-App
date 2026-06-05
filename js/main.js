(function () {
  'use strict';

  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.header__nav-link');
  const header = document.getElementById('header');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function closeMobileNav() {
    navToggle.classList.remove('header__toggle--open');
    mainNav.classList.remove('header__nav--open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function openMobileNav() {
    navToggle.classList.add('header__toggle--open');
    mainNav.classList.add('header__nav--open');
    navToggle.setAttribute('aria-expanded', 'true');
  }

  navToggle.addEventListener('click', function () {
    if (mainNav.classList.contains('header__nav--open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileNav();
    });
  });

  document.addEventListener('click', function (e) {
    if (
      mainNav.classList.contains('header__nav--open') &&
      !mainNav.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeMobileNav();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      closeMobileNav();
    }
  });

  function updateHeaderOnScroll() {
    header.classList.toggle('header--scrolled', window.scrollY > 12);
  }

  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateHeaderOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  function initStaggerDelays() {
    document.querySelectorAll('[data-reveal-stagger]').forEach(function (parent) {
      const step = parseInt(parent.getAttribute('data-reveal-stagger'), 10) || 100;
      const items = parent.querySelectorAll(':scope > .reveal');

      items.forEach(function (el, index) {
        el.style.transitionDelay = index * step + 'ms';
      });
    });
  }

  function revealElement(el) {
    el.classList.add('is-visible');
  }

  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    initStaggerDelays();

    if (prefersReducedMotion) {
      revealElements.forEach(revealElement);
      return;
    }

    const heroReveals = document.querySelectorAll('.hero .reveal');

    requestAnimationFrame(function () {
      setTimeout(function () {
        heroReveals.forEach(revealElement);
      }, 100);
    });

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(revealElement);
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    revealElements.forEach(function (el) {
      if (!el.closest('.hero')) {
        observer.observe(el);
      }
    });
  }

  updateHeaderOnScroll();
  initScrollReveal();
})();
