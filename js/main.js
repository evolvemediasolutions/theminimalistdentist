/**
 * The Minimalist Dentist — Global Components & Mobile Navigation System
 * Automatically renders global Header (<nav>) and Footer (<footer>) across all pages,
 * displaying ONLY the new brand logo image (no text), and highlighting active page links.
 */

(function () {
  // Determine current active page
  const path = window.location.pathname.split('/').pop() || 'index.html';

  let activePage = 'home';
  if (path.includes('services')) activePage = 'services';
  else if (path.includes('blog')) activePage = 'blog';
  else if (path.includes('contact')) activePage = 'contact';
  else if (path === '' || path === 'index.html') activePage = 'home';

  // Global Header Component
  function renderHeader() {
    const navElement = document.querySelector('nav');
    if (!navElement) return;

    navElement.innerHTML = `
      <a class="nav-logo" href="index.html" aria-label="The Minimalist Dentist Home">
        <img src="images/the-minimalist-dentist-original-4000px.png" alt="The Minimalist Dentist" class="nav-logo-img" />
      </a>
      <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul class="nav-links">
        <li><a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Home</a></li>
        <li><a href="services.html" class="${activePage === 'services' ? 'active' : ''}">Services</a></li>
        <li><a href="blog.html" class="${activePage === 'blog' ? 'active' : ''}">Blog</a></li>
        <li><a href="contact.html" class="${activePage === 'contact' ? 'active' : ''}">Contact</a></li>
      </ul>
    `;
  }

  // Global Footer Component
  function renderFooter() {
    const footerElement = document.querySelector('footer');
    if (!footerElement) return;

    footerElement.innerHTML = `
      <div class="footer-container" style="display:flex; flex-wrap:wrap; justify-content:space-between; width:100%; gap:2rem; align-items:flex-start;">
        <div class="footer-brand" style="max-width:300px;">
          <a class="footer-logo" href="index.html" aria-label="The Minimalist Dentist Home">
            <img src="images/the-minimalist-dentist-original-4000px.png" alt="The Minimalist Dentist" class="footer-logo-img" />
          </a>
          <p style="font-size:0.82rem; color:rgba(247,243,236,0.6); margin-top:0.75rem; line-height:1.6;">
            Refined, minimalist dental care built around transparency, comfort, and patient education.
          </p>
        </div>

        <div class="footer-info" style="font-size:0.82rem; color:rgba(247,243,236,0.7); line-height:1.7;">
          <strong style="display:block; margin-bottom:0.4rem; text-transform:uppercase; letter-spacing:0.12em; font-size:0.7rem; color:var(--orange);">Location</strong>
          <a href="https://www.google.com/maps/search/8%2F38,+Prithvi+Avenue?entry=gmail&source=g" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">
            8/38, Prithvi Avenue, 2nd Street,<br />
            Abhiramapuram, Chennai - 600018
          </a>
        </div>

        <div class="footer-info" style="font-size:0.82rem; color:rgba(247,243,236,0.7); line-height:1.7;">
          <strong style="display:block; margin-bottom:0.4rem; text-transform:uppercase; letter-spacing:0.12em; font-size:0.7rem; color:var(--orange);">Appointment Hours</strong>
          10:00 am – 7:00 pm<br />
          <span style="font-size:0.78rem; opacity:0.85; color:var(--ivory);">(By appointment only · Sunday Holiday)</span>
        </div>

        <div class="footer-info" style="font-size:0.82rem; color:rgba(247,243,236,0.7); line-height:1.7;">
          <strong style="display:block; margin-bottom:0.4rem; text-transform:uppercase; letter-spacing:0.12em; font-size:0.7rem; color:var(--orange);">Contact</strong>
          <a href="tel:+919840111369" style="color:var(--ivory); font-weight:500; text-decoration:none; font-size:0.95rem;">+91 98401 11369</a><br />
          <a href="mailto:contact@theminimalistdentist.in" style="color:rgba(247,243,236,0.85); text-decoration:none;">contact@theminimalistdentist.in</a><br />
          <a href="https://wa.me/919840111369" target="_blank" rel="noopener" style="color:var(--orange); font-size:0.78rem; text-decoration:none; font-weight:500;">WhatsApp Us →</a>
        </div>
      </div>

      <div style="width:100%; border-top:1px solid rgba(247,243,236,0.1); margin-top:2.5rem; padding-top:1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; font-size:0.78rem;">
        <span>© 2026 · www.theminimalistdentist.in</span>
        <div style="display:flex; gap:1.5rem;">
          <a href="index.html">Home</a>
          <a href="services.html">Services</a>
          <a href="blog.html">Blog</a>
          <a href="contact.html">Contact</a>
        </div>
      </div>
    `;
  }

  // Initialize Hamburger Menu Interactivity
  function initNavToggle() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!navToggle || !navLinks) return;

    function toggleMenu(open) {
      const isExpanded = open !== undefined ? open : !navToggle.classList.contains('active');
      navToggle.classList.toggle('active', isExpanded);
      navLinks.classList.toggle('active', isExpanded);
      document.body.classList.toggle('nav-open', isExpanded);
      navToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    }

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navToggle.classList.contains('active')) {
        toggleMenu(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navToggle.classList.contains('active')) {
        toggleMenu(false);
      }
    });
  }

  // Execute components rendering on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      renderHeader();
      renderFooter();
      initNavToggle();
    });
  } else {
    renderHeader();
    renderFooter();
    initNavToggle();
  }
})();
