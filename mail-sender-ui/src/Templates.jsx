import { useState, useEffect } from 'react'
import './App.css'
import API_BASE_URL from './config'

function Templates() {
    const [templates, setTemplates] = useState({ subject: '', body: '' })
    const [loading, setLoading] = useState(true)
    const [copyStatus, setCopyStatus] = useState({ subject: false, body: false })

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/templates`)
                if (response.ok) {
                    const data = await response.json()
                    setTemplates(data)
                }
            } catch (error) {
                console.error('Failed to fetch templates:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchTemplates()
    }, [])

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyStatus({ ...copyStatus, [type]: true })
            setTimeout(() => setCopyStatus({ ...copyStatus, [type]: false }), 2000)
        })
    }

    if (loading) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                Loading templates...
            </div>
        )
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="email-list-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--slate-200)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--slate-800)', margin: 0 }}>
                        Email Template
                    </h2>
                    <button
                        onClick={() => copyToClipboard(templates.body, 'body')}
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        {copyStatus.body ? 'Copied!' : 'Copy Template'}
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    {/* Body Template */}
                    <div>
                        <div style={{
                            padding: '1.5rem',
                            background: 'var(--slate-50)',
                            border: '1px solid var(--slate-200)',
                            borderRadius: '8px',
                            color: 'var(--slate-700)',
                            fontSize: '0.95rem',
                            lineHeight: 1.6,
                            whiteSpace: 'pre-wrap',
                            maxHeight: '400px',
                            overflowY: 'auto'
                        }}>
                            {templates.body}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Templates
