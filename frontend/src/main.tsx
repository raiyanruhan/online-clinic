import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({
  once: true,
  offset: 50,
  duration: 800,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
