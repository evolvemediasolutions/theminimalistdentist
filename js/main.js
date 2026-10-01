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
        <img src="images/logo.png" alt="The Minimalist Dentist" class="nav-logo-img" />
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
      <a class="footer-logo" href="index.html" aria-label="The Minimalist Dentist Home">
        <img src="images/logo.png" alt="The Minimalist Dentist" class="footer-logo-img" />
      </a>
      <span>© 2026 · www.themininalistdentist.in</span>
      <div style="display:flex;gap:1.5rem;">
        <a href="services.html">Services</a>
        <a href="blog.html">Blog</a>
        <a href="contact.html">Contact</a>
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
