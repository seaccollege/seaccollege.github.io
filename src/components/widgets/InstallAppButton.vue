<template>
  <button
    v-if="showInstallButton"
    @click="installApp"
    class="install-app-button"
    aria-label="Install app"
    title="Install app"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    <span class="install-text">Install App</span>
  </button>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const showInstallButton = ref(false);
const deferredPrompt = ref(null);

let installAvailableHandler = null;
let appInstalledHandler = null;

onMounted(() => {
  // Check if app is already installed (standalone mode)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    showInstallButton.value = false;
    return;
  }

  // Check if prompt was already captured globally
  if (window.deferredPrompt) {
    deferredPrompt.value = window.deferredPrompt;
    showInstallButton.value = true;
  }

  // Listen for custom event dispatched when prompt is available
  installAvailableHandler = () => {
    if (window.deferredPrompt) {
      deferredPrompt.value = window.deferredPrompt;
      showInstallButton.value = true;
    }
  };
  window.addEventListener('pwa-install-available', installAvailableHandler);

  // Hide button if app is already installed
  appInstalledHandler = () => {
    showInstallButton.value = false;
    deferredPrompt.value = null;
  };
  window.addEventListener('appinstalled', appInstalledHandler);
});

onBeforeUnmount(() => {
  if (installAvailableHandler) {
    window.removeEventListener('pwa-install-available', installAvailableHandler);
  }
  if (appInstalledHandler) {
    window.removeEventListener('appinstalled', appInstalledHandler);
  }
});

const installApp = async () => {
  if (!deferredPrompt.value) {
    return;
  }

  // Show the install prompt
  deferredPrompt.value.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.value.userChoice;

  if (outcome === 'accepted') {
    console.log('User accepted the install prompt');
  } else {
    console.log('User dismissed the install prompt');
  }

  // Clear the deferredPrompt so it can only be used once
  deferredPrompt.value = null;
  showInstallButton.value = false;
};
</script>

<style scoped>
.install-app-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: var(--header-gradient);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  box-shadow: 0 2px 8px var(--card-shadow);
  white-space: nowrap;
}

.install-app-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.install-app-button:active {
  transform: translateY(0);
}

.install-app-button svg {
  flex-shrink: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .install-app-button {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  .install-text {
    display: none;
  }
}

@media (max-width: 480px) {
  .install-app-button {
    padding: 0.5rem;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    justify-content: center;
  }
}
</style>
