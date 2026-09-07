// MAN.Distilling — CMS mobile sidebar collapse
// Tap "Collections" heading to collapse/expand the sidebar

(function () {
  if (window.innerWidth > 800) return;

  function attachToggle() {
    // Find the h2 with text "Collections" — Decap renders async so we poll
    let collectionsHeading = null;
    document.querySelectorAll('h2').forEach(h => {
      if (h.textContent.trim().toLowerCase() === 'collections') {
        collectionsHeading = h;
      }
    });

    if (!collectionsHeading) {
      setTimeout(attachToggle, 500);
      return;
    }

    // Already attached
    if (collectionsHeading.dataset.toggleAttached) return;
    collectionsHeading.dataset.toggleAttached = 'true';

    // The sidebar is the closest aside ancestor of the heading
    const sidebar = collectionsHeading.closest('aside');
    if (!sidebar) {
      setTimeout(attachToggle, 500);
      return;
    }

    // Style the sidebar for animated collapse
    sidebar.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
    sidebar.style.transformOrigin = 'left top';

    // Arrow indicator on the heading
    collectionsHeading.style.cssText += 'display:flex; align-items:center; justify-content:space-between; cursor:pointer; user-select:none;';

    const arrow = document.createElement('span');
    arrow.textContent = '‹';
    arrow.style.cssText = 'font-size:20px; color:#6aab8a; margin-left:8px; transition:transform 0.25s; flex-shrink:0;';
    collectionsHeading.appendChild(arrow);

    let collapsed = false;

    collectionsHeading.addEventListener('click', () => {
      collapsed = !collapsed;
      if (collapsed) {
        sidebar.style.transform = 'translateX(-110%)';
        sidebar.style.opacity = '0';
        sidebar.style.pointerEvents = 'none';
        arrow.style.transform = 'rotate(180deg)';
      } else {
        sidebar.style.transform = 'translateX(0)';
        sidebar.style.opacity = '1';
        sidebar.style.pointerEvents = '';
        arrow.style.transform = 'rotate(0deg)';
      }
    });
  }

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
