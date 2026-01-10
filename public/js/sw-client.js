// Client helper for Service Worker updates
(function () {
  if (!('serviceWorker' in navigator)) return;

  function createBanner() {
    // fallback UI if no toast helper exists
    if (document.getElementById('sw-update-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'sw-update-banner';
    banner.style.position = 'fixed';
    banner.style.left = '8px';
    banner.style.right = '8px';
    banner.style.bottom = '16px';
    banner.style.zIndex = '99999';
    banner.style.background = '#111827';
    banner.style.color = '#fff';
    banner.style.padding = '12px 16px';
    banner.style.borderRadius = '8px';
    banner.style.boxShadow = '0 6px 18px rgba(16,24,40,0.4)';
    banner.style.display = 'flex';
    banner.style.alignItems = 'center';
    banner.style.justifyContent = 'space-between';
    banner.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial';

    const text = document.createElement('div');
    text.textContent = 'A new version is available.';

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '8px';

    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = 'Refresh';
    refreshBtn.style.background = '#10b981';
    refreshBtn.style.color = '#fff';
    refreshBtn.style.border = 'none';
    refreshBtn.style.padding = '8px 12px';
    refreshBtn.style.borderRadius = '6px';
    refreshBtn.style.cursor = 'pointer';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Dismiss';
    closeBtn.style.background = 'transparent';
    closeBtn.style.color = '#cbd5e1';
    closeBtn.style.border = '1px solid rgba(255,255,255,0.06)';
    closeBtn.style.padding = '8px 12px';
    closeBtn.style.borderRadius = '6px';
    closeBtn.style.cursor = 'pointer';

    actions.appendChild(refreshBtn);
    actions.appendChild(closeBtn);
    banner.appendChild(text);
    banner.appendChild(actions);
    document.body.appendChild(banner);

    closeBtn.addEventListener('click', () => banner.remove());

    refreshBtn.addEventListener('click', () => {
      // Tell the waiting SW to skip waiting
      if (window.__swRegistration && window.__swRegistration.waiting) {
        window.__swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    });
  }

  function showUpdateToast() {
    if (typeof window.showToast === 'function') {
      window.showToast({
        message: 'A new version is available.',
        actionLabel: 'Refresh',
        onAction: () => {
          if (window.__swRegistration && window.__swRegistration.waiting) {
            window.__swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        }
      });
      return;
    }
    createBanner();
  }

  // Register sw
  navigator.serviceWorker.register('/service-worker.js').then((reg) => {
    window.__swRegistration = reg;

    // If there's an active waiting worker, prompt update
    if (reg.waiting) {
      showUpdateToast();
    }

    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      if (!newWorker) return;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            showUpdateToast();
          }
        }
      });
    });
  }).catch(() => { /* ignore registration errors */ });

  // Listen for messages from SW
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (!event.data) return;
    if (event.data.type === 'NEW_VERSION_AVAILABLE') showUpdateToast();
  });

  // When the new service worker takes control, reload to apply
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
})();
