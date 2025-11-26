import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { reportWebVitals } from './vitals'
import { TRPCProvider } from './services/trpc'

import clarity from '@microsoft/clarity';

// Initialize Microsoft Clarity
if (import.meta.env.PROD) {
  clarity.init('uc47h0l6ty');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TRPCProvider>
      <App />
    </TRPCProvider>
  </StrictMode>,
)

reportWebVitals()
