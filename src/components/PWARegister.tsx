'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    deferredPWAInstallPrompt?: any;
  }
}

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        window.deferredPWAInstallPrompt = e;
        window.dispatchEvent(new Event('pwa_prompt_ready'));
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstall);

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('Ruang Komik Service Worker registered:', reg.scope);
          })
          .catch((err) => {
            console.error('Service Worker registration failed:', err);
          });
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }
  }, []);

  return null;
}
