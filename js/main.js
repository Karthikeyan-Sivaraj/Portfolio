(function () {
  'use strict';

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Navbar scroll state + progress bar */
  const navbar   = document.getElementById('navbar');
  const progress = document.getElementById('scrollProgress');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      progress.style.transform = 'scaleX(' + pct + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav toggle */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* Active nav link on scroll */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sectionObserver.observe(s));

  /* Cursor spotlight on project cards */
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.project-card .card-inner').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }

  /* Technology marquee */
  const track = document.querySelector('.tech-track');

  if (track && !prefersReducedMotion) {
    let position = 0;
    const speed = 0.5;

    function marqueeLoop() {
      position -= speed;
      if (position <= -track.scrollWidth / 2) position = 0;
      track.style.transform = 'translateX(' + position + 'px)';
      requestAnimationFrame(marqueeLoop);
    }
    requestAnimationFrame(marqueeLoop);
  }

  /* Contact form */
  const form       = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name    = form.querySelector('#name').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        formStatus.style.color = '#f87171';
        formStatus.textContent = 'Please fill in all fields.';
        return;
      }

      if (!isValidEmail(email)) {
        formStatus.style.color = '#f87171';
        formStatus.textContent = 'Please enter a valid email address.';
        return;
      }

      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          formStatus.style.color = '#34d399';
          formStatus.textContent =
            '✓ Message sent. I\'ll get back to you within 24 hours.';
          form.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        formStatus.style.color = '#f87171';
        formStatus.textContent =
          '✗ Failed to send message. Please try again later.';
      }

      btn.textContent = 'Send Message →';
      btn.disabled = false;
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* Back to top smooth scroll */
  document.querySelectorAll('a[href="#hero"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

})();
