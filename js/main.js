/**
 * Tufyal Ahmmed — Portfolio JavaScript
 * Modern, Lightweight, Accessible Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initProjectFilters();
  initCopyActions();
  initMobileMenu();
  initScrollSpy();
  initYear();
});

/* --------------------------------------------------------------------------
   Theme Toggle System (Conforming to Modern Web Guidance)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
  const themeToggleBtn = document.getElementById('theme-toggle');

  if (!themeToggleBtn || !metaColorScheme) return;

  function updateToggleIcon(currentScheme) {
    const isDark = currentScheme === 'dark' || 
      (currentScheme === 'light dark' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggleBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    
    // Moon vs Sun icon SVG
    if (isDark) {
      themeToggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2"/>
          <path d="M12 20v2"/>
          <path d="m4.93 4.93 1.41 1.41"/>
          <path d="m17.66 17.66 1.41 1.41"/>
          <path d="M2 12h2"/>
          <path d="M20 12h2"/>
          <path d="m6.34 17.66-1.41 1.41"/>
          <path d="m19.07 4.93-1.41 1.41"/>
        </svg>
      `;
    } else {
      themeToggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      `;
    }
  }

  // Initial icon state
  updateToggleIcon(metaColorScheme.content);

  // Toggle button click handler
  themeToggleBtn.addEventListener('click', () => {
    const currentRenderedDark = metaColorScheme.content === 'dark' || 
      (metaColorScheme.content === 'light dark' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    const targetScheme = currentRenderedDark ? 'light' : 'dark';
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemScheme = systemDark ? 'dark' : 'light';

    if (targetScheme === systemScheme) {
      // Revert to system default
      localStorage.removeItem('color-scheme');
      metaColorScheme.content = 'light dark';
    } else {
      // Store override
      try {
        localStorage.setItem('color-scheme', targetScheme);
      } catch (e) {
        console.warn('LocalStorage unavailable:', e);
      }
      metaColorScheme.content = targetScheme;
    }

    updateToggleIcon(metaColorScheme.content);
  });

  // Sync across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'color-scheme') {
      metaColorScheme.content = e.newValue ?? 'light dark';
      updateToggleIcon(metaColorScheme.content);
    }
  });

  // Listen for OS preference shifts
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!localStorage.getItem('color-scheme')) {
      updateToggleIcon('light dark');
    }
  });
}

/* --------------------------------------------------------------------------
   Projects Filter System
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category')?.split(' ') || [];
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Copy-to-Clipboard & Toast Feedback
   -------------------------------------------------------------------------- */
function initCopyActions() {
  const copyButtons = document.querySelectorAll('[data-copy-text]');
  const toastNotification = document.getElementById('copy-toast');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy-text');
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        showToast(`Copied "${text}" to clipboard!`);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied "${text}" to clipboard!`);
      }
    });
  });

  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2800);
  }
}

/* --------------------------------------------------------------------------
   Mobile Navigation Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   ScrollSpy for Active Nav Link
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   Auto-updating Footer Year
   -------------------------------------------------------------------------- */
function initYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
