import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
// @ts-expect-error CSS imports are handled by Vite in this project
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
