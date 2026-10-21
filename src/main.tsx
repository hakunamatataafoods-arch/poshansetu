import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with auto-update
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('PoshanSetu updated version available.');
  },
  onOfflineReady() {
    console.log('PoshanSetu is ready for offline operation.');
  }
});

createRoot(document.getElementById('root')!).render(<App />);
