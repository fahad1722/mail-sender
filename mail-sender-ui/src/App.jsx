import { useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import API_BASE_URL from './config'

function App() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' })
      return
    }

    setLoading(true)
    setStatus(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({ type: 'success', message: `Email sent successfully to ${email.toLowerCase()}` })
        setEmail('')
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to send email' })
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Could not connect to the server.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="hero-section">
        <h1 className="hero-title">Send Email and Resume To Recruiters</h1>
      </div>

      <div className="card send-card">
        <form onSubmit={handleSubmit} className="email-form">
          <div className="form-group">
            <label htmlFor="email">Recipient Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                className="email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Sending...' : 'Send Email'}
          </button>

          {loading && (
            <div style={{ marginTop: '1rem', color: 'var(--slate-500)', fontSize: '0.9rem', textAlign: 'center' }}>
              <span className="processing-dot"></span> Processing your request...
            </div>
          )}

          {status && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <span className={`status-pill ${status.type === 'success' ? 'success' : 'failed'}`}>
                {status.message}
              </span>
            </div>
          )}
        </form>
      </div>

      <div className="features-section">
        <div className="feature-item">
          <div className="feature-icon">🚀</div>
          <h3>Instant Delivery</h3>
          <p>Your resume reaches recruiters in real-time, zero lag.</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">🛡️</div>
          <h3>Safe & Secure</h3>
          <p>Enterprise-grade encryption for your documents.</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">📊</div>
          <h3>Live Stats</h3>
          <p>Track every single email in your dashboard.</p>
        </div>
      </div>
    </>
  )
}

export default App
