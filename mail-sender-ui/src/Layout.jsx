import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import API_BASE_URL from './config';

function Layout() {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('career'); // 'career' or 'referral'
    const [companyName, setCompanyName] = useState('');
    const [link, setLink] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState(null);

    const openModal = (type) => {
        setModalType(type);
        setCompanyName('');
        setLink('');
        setStatus(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus(null);

        const endpoint = modalType === 'career' ? '/api/careers' : '/api/referrals';
        const body = modalType === 'career'
            ? { companyName, careerLink: link }
            : { companyName, linkedInUrl: link };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                setStatus({ type: 'success', message: `${modalType === 'career' ? 'Career' : 'Referral'} saved!` });
                setCompanyName('');
                setLink('');
                setTimeout(() => {
                    setIsModalOpen(false);
                    setStatus(null);
                    // Refresh current page
                    window.dispatchEvent(new Event(modalType === 'career' ? 'careerAdded' : 'referralAdded'));
                }, 1500);
            } else {
                setStatus({ type: 'error', message: 'Failed to save.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Network error.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="app">
            <nav className="navbar">
                <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-600)' }}>
                        <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4-4V6z"></path>
                    </svg>
                    <span className="nav-title">EmailResumeSender</span>
                </Link>

                <div className="nav-links">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Compose</Link>
                    <Link to="/history" className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}>History</Link>
                    <Link to="/careers" className={`nav-link ${location.pathname === '/careers' ? 'active' : ''}`}>Careers</Link>
                    <Link to="/referrals" className={`nav-link ${location.pathname === '/referrals' ? 'active' : ''}`}>Referrals</Link>
                    <Link to="/templates" className={`nav-link ${location.pathname === '/templates' ? 'active' : ''}`}>Templates</Link>

                    <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
                        <button onClick={() => openModal('career')} className="btn-primary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                            + Career
                        </button>
                        <button onClick={() => openModal('referral')} className="btn-primary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                            + Referral
                        </button>
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{modalType === 'career' ? 'Track Career Page' : 'Add LinkedIn Referral'}</h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label>Company Name</label>
                                    <input
                                        type="text"
                                        className="email-input"
                                        placeholder="e.g. Google"
                                        value={companyName}
                                        onChange={e => setCompanyName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{modalType === 'career' ? 'Career Page URL' : 'LinkedIn Profile URL'}</label>
                                    <input
                                        type="url"
                                        className="email-input"
                                        placeholder={modalType === 'career' ? "https://careers.google.com" : "https://linkedin.com/in/username"}
                                        value={link}
                                        onChange={e => setLink(e.target.value)}
                                        required
                                    />
                                </div>
                                {status && (
                                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                        <span className={`status-pill ${status.type === 'success' ? 'success' : 'failed'}`}>
                                            {status.message}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <footer className="footer">
                <p>© 2026 EmailResumeSender. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Layout;
