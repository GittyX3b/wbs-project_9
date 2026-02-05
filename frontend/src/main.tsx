import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { SessionProvider } from '@data';

import './main.css';

import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionProvider>
      <App />
    </SessionProvider>
  </StrictMode>,
);
