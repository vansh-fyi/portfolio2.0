import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import HomeContent from './components/HomeContent'
import { reportWebVitals } from './vitals'

import clarity from '@microsoft/clarity';

// Initialize Microsoft Clarity
if (import.meta.env.PROD) {
  clarity.init('uc47h0l6ty');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App><HomeContent /></App>
  </StrictMode>,
)

reportWebVitals()
