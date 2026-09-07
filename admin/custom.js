// MAN.Distilling — CMS mobile sidebar collapse
// Survives Decap's DOM re-renders via MutationObserver.
// A persistent reopen tab stays on screen when sidebar is hidden.

(function () {
  if (window.innerWidth > 800) return;

  // ── State ──
  let collapsed = false;
  let currentSidebar = null;
  let observerThrottle = null;

  // ── Reopen button — created once, persists across re-renders ──
  let reopenBtn = document.getElementById('cms-sidebar-reopen');
  if (!reopenBtn) {
    reopenBtn = document.createElement('button');
    reopenBtn.id = 'cms-sidebar-reopen';
    reopenBtn.textContent = '›';
    reopenBtn.title = 'Show collections';
    reopenBtn.style.cssText = [
      'position:fixed', 'top:50%', 'left:0',
      'transform:translateY(-50%)',
      'z-index:99998',
      'width:24px', 'height:48px',
      'background:#1a2820',
      'color:#6aab8a',
      'border:1px solid #2a4038',
      'border-left:none',
      'border-radius:0 6px 6px 0',
      'font-size:18px',
      'cursor:pointer',
      'display:none',
      'align-items:center',
      'justify-content:center',
      'padding:0',
      'line-height:1'
    ].join(';');
    document.body.appendChild(reopenBtn);

    reopenBtn.addEventListener('click', () => {
      collapsed = false;
      const a = document.getElementById('cms-sidebar-arrow');
      if (a) a.style.transform = 'rotate(0deg)';
      applySidebarState();
    });
  }

  // ── Apply collapsed/expanded state to current sidebar ──
  function applySidebarState() {
    if (!currentSidebar) return;
    if (collapsed) {
      currentSidebar.style.transform = 'translateX(-110%)';
      currentSidebar.style.opacity = '0';
      currentSidebar.style.pointerEvents = 'none';
      reopenBtn.style.display = 'flex';
    } else {
      currentSidebar.style.transform = 'translateX(0)';
      currentSidebar.style.opacity = '1';
      currentSidebar.style.pointerEvents = '';
      reopenBtn.style.display = 'none';
    }
  }

  // ── Attach toggle to the Collections heading ──
  // Called on every Decap re-render — must be safe to call repeatedly.
  function attachToggle() {
    // Find the Collections h2
    let collectionsHeading = null;
    document.querySelectorAll('h2').forEach(h => {
      if (h.textContent.replace('‹', '').trim().toLowerCase() === 'collections') {
        collectionsHeading = h;
      }
    });
    if (!collectionsHeading) return;

    const sidebar = collectionsHeading.closest('aside');
    if (!sidebar) return;

    // Always re-style the sidebar — it may be a fresh DOM element
    sidebar.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
    sidebar.style.transformOrigin = 'left top';
    currentSidebar = sidebar;

    // Re-apply current collapsed state to the (possibly new) sidebar element
    applySidebarState();

    // Always re-inject the arrow into the heading — Decap recreates it on navigation
    // Remove any stale arrow first
    const oldArrow = document.getElementById('cms-sidebar-arrow');
    if (oldArrow) oldArrow.remove();

    collectionsHeading.style.cssText += 'display:flex;align-items:center;justify-content:space-between;cursor:pointer;user-select:none;';

    const arrow = document.createElement('span');
    arrow.id = 'cms-sidebar-arrow';
    arrow.textContent = '‹';
    arrow.style.cssText = 'font-size:20px;color:#6aab8a;margin-left:8px;transition:transform 0.25s;flex-shrink:0;';
    arrow.style.transform = collapsed ? 'rotate(180deg)' : 'rotate(0deg)';
    collectionsHeading.appendChild(arrow);

    // Only bind the click listener once per heading instance
    if (collectionsHeading.dataset.toggleAttached) return;
    collectionsHeading.dataset.toggleAttached = 'true';

    collectionsHeading.addEventListener('click', () => {
      collapsed = !collapsed;
      // Look up arrow fresh — it's always in the same heading we have a ref to
      const a = document.getElementById('cms-sidebar-arrow');
      if (a) a.style.transform = collapsed ? 'rotate(180deg)' : 'rotate(0deg)';
      applySidebarState();
    });
  }

  // ── MutationObserver — throttled to avoid firing hundreds of times/sec ──
  const observer = new MutationObserver(() => {
    if (observerThrottle) return;
    observerThrottle = setTimeout(() => {
      observerThrottle = null;
      attachToggle();
    }, 150);
  });

  function startObserving() {
    observer.observe(document.body, { childList: true, subtree: true });
    attachToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserving);
  } else {
    startObserving();
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
