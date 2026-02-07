import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import EmailHistory from './EmailHistory.jsx'
import Careers from './Careers.jsx'
import Referrals from './Referrals.jsx'
import Templates from './Templates.jsx'
import Layout from './Layout.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/history" element={<EmailHistory />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/templates" element={<Templates />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
