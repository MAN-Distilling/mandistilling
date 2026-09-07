// MAN.Distilling — CMS mobile sidebar collapse
// Survives Decap's DOM re-renders by watching via MutationObserver.
// A persistent reopen tab stays on screen whenever the sidebar is hidden.

(function () {
  if (window.innerWidth > 800) return;

  let collapsed = false;
  let currentSidebar = null;

  // ── Persistent reopen tab ──
  // Guard: only create once — Decap can re-run scripts on navigation
  if (document.getElementById('cms-sidebar-reopen')) return;
  const reopenBtn = document.createElement('button');
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
    applySidebarState();
  });

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

  function attachToggle() {
    let collectionsHeading = null;
    document.querySelectorAll('h2').forEach(h => {
      if (h.textContent.trim().toLowerCase() === 'collections') {
        collectionsHeading = h;
      }
    });

    if (!collectionsHeading) return;

    const sidebar = collectionsHeading.closest('aside');
    if (!sidebar) return;

    // Re-style sidebar whenever Decap re-renders it
    sidebar.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
    sidebar.style.transformOrigin = 'left top';
    currentSidebar = sidebar;

    // Re-apply collapsed state if it was set before re-render
    applySidebarState();

    // Already attached this heading — don't double-bind
    if (collectionsHeading.dataset.toggleAttached) return;
    collectionsHeading.dataset.toggleAttached = 'true';

    collectionsHeading.style.cssText += 'display:flex;align-items:center;justify-content:space-between;cursor:pointer;user-select:none;';

    const arrow = document.createElement('span');
    arrow.id = 'cms-sidebar-arrow';
    arrow.textContent = '‹';
    arrow.style.cssText = 'font-size:20px;color:#6aab8a;margin-left:8px;transition:transform 0.25s;flex-shrink:0;';
    collectionsHeading.appendChild(arrow);

    collectionsHeading.addEventListener('click', () => {
      collapsed = !collapsed;
      arrow.style.transform = collapsed ? 'rotate(180deg)' : 'rotate(0deg)';
      applySidebarState();
    });
  }

  // ── MutationObserver — re-attach whenever Decap re-renders the DOM ──
  const observer = new MutationObserver(() => {
    attachToggle();
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
