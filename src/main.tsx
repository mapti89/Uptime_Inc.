import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { startLoop } from './game/loop';
import { initSync } from './game/sync/sync';
import './ui/styles/global.css';

startLoop();
void initSync();

// PWA : installation sur l'écran d'accueil + jeu hors ligne (uniquement sur le build déployé).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      /* pas de service worker : le jeu fonctionne quand même en ligne */
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
