import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { startLoop } from './game/loop';
import './ui/styles/global.css';

startLoop();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
