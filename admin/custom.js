// MAN.Distilling — CMS mobile sidebar collapse
// Tap "Collections" heading to collapse/expand the sidebar

(function () {
  if (window.innerWidth > 800) return;

  function attachToggle() {
    // Decap CMS renders async so we wait for the heading to appear
    const headings = document.querySelectorAll('h2, [class*="collection"] h2, [class*="Nav"] h2');
    let collectionsHeading = null;

    headings.forEach(h => {
      if (h.textContent.trim().toLowerCase() === 'collections') {
        collectionsHeading = h;
      }
    });

    if (!collectionsHeading) {
      // Not rendered yet — try again shortly
      setTimeout(attachToggle, 500);
      return;
    }

    // Already attached
    if (collectionsHeading.dataset.toggleAttached) return;
    collectionsHeading.dataset.toggleAttached = 'true';

    // Add a small visual indicator
    collectionsHeading.style.display = 'flex';
    collectionsHeading.style.alignItems = 'center';
    collectionsHeading.style.justifyContent = 'space-between';

    const arrow = document.createElement('span');
    arrow.textContent = '‹';
    arrow.style.cssText = 'font-size:20px; color:#6aab8a; margin-left:8px; transition: transform 0.25s;';
    collectionsHeading.appendChild(arrow);

    collectionsHeading.addEventListener('click', () => {
      const collapsed = document.body.classList.toggle('sidebar-collapsed');
      arrow.style.transform = collapsed ? 'rotate(180deg)' : 'rotate(0deg)';
    });
  }

  // Start trying once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachToggle);
  } else {
    attachToggle();
  }
})();

// ── CMS DARK MODE TOGGLE ──
(function () {
  function addDarkToggle() {
    if (document.getElementById('cms-dark-toggle')) return;

    // Restore saved preference
    if (localStorage.getItem('cms-dark') === 'true') {
      document.body.classList.add('cms-dark');
    }

    const btn = document.createElement('button');
    btn.id = 'cms-dark-toggle';
    btn.title = 'Toggle dark mode';
    btn.textContent = document.body.classList.contains('cms-dark') ? '○' : '◑';

    btn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('cms-dark');
      btn.textContent = isDark ? '○' : '◑';
      localStorage.setItem('cms-dark', isDark);
    });

    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addDarkToggle);
  } else {
    addDarkToggle();
  }
})();
