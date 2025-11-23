import './styles/app.css';
import './styles/analytics.css';
import './styles/expenses.css';
import './styles/inventory.css';
import './styles/lab.css';
import './styles/prescription.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
