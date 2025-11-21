'use client';

import { useEffect } from 'react';

export function PWAInstaller() {
  useEffect(() => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registrado com sucesso:', registration.scope);
          })
          .catch((error) => {
            console.log('Falha ao registrar Service Worker:', error);
          });
      });
    }

    // Detectar instalação do PWA
    let deferredPrompt: any;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Mostrar banner de instalação customizado (opcional)
      console.log('PWA pode ser instalado');
    });

    // Detectar quando o PWA foi instalado
    window.addEventListener('appinstalled', () => {
      console.log('PWA instalado com sucesso!');
      deferredPrompt = null;
    });
  }, []);

  return null;
}
