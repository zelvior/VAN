import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register PWA Service Worker in production static host environments
if ("serviceWorker" in navigator && (import.meta as any).env?.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => {
        console.log("VAN PWA: Service Worker activated on root scope.", reg.scope);
      })
      .catch((err) => {
        console.warn("VAN PWA: Service Worker register failed:", err);
      });
  });
}

