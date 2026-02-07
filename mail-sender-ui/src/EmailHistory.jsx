import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import './App.css'
import API_BASE_URL from './config'

function EmailHistory() {
    const [emails, setEmails] = useState([])
    const [loading, setLoading] = useState(true)
    const [copiedId, setCopiedId] = useState(null)
    const [error, setError] = useState(null)

    const fetchEmails = () => {
        setLoading(true)
        setError(null)
        fetch(`${API_BASE_URL}/api/emails`)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch data')
                return res.json()
            })
            .then((data) => {
                setEmails(data)
                setLoading(false)
            })
            .catch((err) => {
                console.error('Fetch error:', err)
                setError(err.message)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchEmails()
    }, [])

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const copyEmail = (email, id) => {
        navigator.clipboard.writeText(email)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const exportToExcel = () => {
        if (emails.length === 0) return;

        const dataToExport = emails.map(email => ({
            'Recipient': email.email,
            'Sent At': formatDate(email.sentAt),
            'Status': email.status === 'SUCCESS' ? 'Sent' : 'Failed'
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Email History");
        XLSX.writeFile(workbook, "Email_History.xlsx");
    };

    return (
        <div className="email-history-wrapper">
            <div className="email-list-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--slate-200)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--slate-800)', margin: 0 }}>
                            Sent Emails
                        </h2>
                    </div>
                    <button
                        onClick={exportToExcel}
                        className="btn-secondary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            fontSize: '0.9rem'
                        }}
                        disabled={emails.length === 0 || loading}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Export to Excel
                    </button>
                </div>

                <div className="email-header-row" style={{ gridTemplateColumns: '2.5fr 1fr 140px' }}>
                    <span>Recipient</span>
                    <span>Date</span>
                    <span style={{ textAlign: 'right' }}>Status</span>
                </div>

                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                        <div className="spinner"></div>
                        <p style={{ marginTop: '1rem' }}>Fetching logs...</p>
                    </div>
                ) : error ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>
                        <p>Error: {error}</p>
                        <button onClick={fetchEmails} className="btn-secondary" style={{ marginTop: '1rem' }}>Retry</button>
                    </div>
                ) : emails.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                        No logs found.
                    </div>
                ) : (
                    <div className="email-list">
                        {emails.map((emailItem) => (
                            <div key={emailItem.id} className="email-row" style={{ gridTemplateColumns: '2.5fr 1fr 140px' }}>
                                <div className="email-address-wrapper">
                                    <span className="email-address" style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{emailItem.email}</span>
                                    <button
                                        className="copy-btn"
                                        onClick={() => copyEmail(emailItem.email, emailItem.id)}
                                        title="Copy to clipboard"
                                        style={{ marginLeft: '12px' }}
                                    >
                                        {copiedId === emailItem.id ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                                <div className="email-meta" style={{
                                    color: 'var(--slate-500)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {formatDate(emailItem.sentAt)}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className={`status-pill ${emailItem.status.toLowerCase()}`}>
                                        {emailItem.status === 'SUCCESS' ? 'Sent' : emailItem.status.toLowerCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default EmailHistory
