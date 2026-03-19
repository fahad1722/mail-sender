import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import './App.css'
import API_BASE_URL from './config'

function HrContacts() {
    const [hrContacts, setHrContacts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingHr, setEditingHr] = useState(null)
    const [editCompanyName, setEditCompanyName] = useState('')
    const [editEmailId, setEditEmailId] = useState('')
    const [editMobileNumber, setEditMobileNumber] = useState('')
    const [editLinkedInUrl, setEditLinkedInUrl] = useState('')
    const [updating, setUpdating] = useState(false)

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deletingHrId, setDeletingHrId] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Copy state
    const [copiedField, setCopiedField] = useState(null)

    const copyToClipboard = (text, fieldId) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldId);
        setTimeout(() => setCopiedField(null), 1500);
    };

    const fetchHrContacts = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/api/hrs`)
            if (response.ok) {
                const data = await response.json()
                setHrContacts(data)
            }
        } catch (error) {
            console.error('Failed to fetch HR contacts:', error)
        } finally {
            setLoading(false)
        }
    }

    const exportToExcel = () => {
        if (hrContacts.length === 0) return;

        const dataToExport = hrContacts.map(hr => ({
            'Company Name': hr.companyName,
            'Email ID': hr.emailId,
            'Mobile Number': hr.mobileNumber,
            'LinkedIn Profile': hr.linkedInUrl
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "HR Contacts");
        XLSX.writeFile(workbook, "HR_Contacts.xlsx");
    };

    const openDeleteModal = (id) => {
        setDeletingHrId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingHrId) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/hrs/${deletingHrId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setHrContacts(hrContacts.filter(h => h.id !== deletingHrId));
                setIsDeleteModalOpen(false);
            }
        } catch (error) {
            console.error('Failed to delete:', error);
        } finally {
            setIsDeleting(false);
            setDeletingHrId(null);
        }
    };

    const handleEdit = (hr) => {
        setEditingHr(hr);
        setEditCompanyName(hr.companyName);
        setEditEmailId(hr.emailId);
        setEditMobileNumber(hr.mobileNumber);
        setEditLinkedInUrl(hr.linkedInUrl);
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/hrs/${editingHr.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyName: editCompanyName,
                    emailId: editEmailId,
                    mobileNumber: editMobileNumber,
                    linkedInUrl: editLinkedInUrl
                })
            });

            if (response.ok) {
                const updated = await response.json();
                setHrContacts(hrContacts.map(h => h.id === updated.id ? updated : h));
                setIsEditModalOpen(false);
            }
        } catch (error) {
            console.error('Failed to update:', error);
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        fetchHrContacts()

        const handleHrAdded = () => {
            fetchHrContacts();
        };

        window.addEventListener('hrAdded', handleHrAdded);
        return () => window.removeEventListener('hrAdded', handleHrAdded);
    }, [])

    const filteredHrContacts = hrContacts.filter(hr =>
        hr.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="email-list-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--slate-800)', margin: 0 }}>
                        HR Contacts
                    </h2>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Filter by company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '8px 12px 8px 36px',
                                borderRadius: '8px',
                                border: '1px solid var(--slate-200)',
                                fontSize: '0.9rem',
                                width: '240px',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            className="search-input"
                        />
                        <svg
                            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }}
                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
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
                    disabled={hrContacts.length === 0 || loading}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Export to Excel
                </button>
            </div>
            <div className="email-header-row" style={{ gridTemplateColumns: '1fr 1.5fr 1fr 1.5fr 150px' }}>
                <span>Company</span>
                <span>Email</span>
                <span>Mobile</span>
                <span>LinkedIn</span>
                <span style={{ textAlign: 'right' }}>Actions</span>
            </div>

            {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                    Loading HR contacts...
                </div>
            ) : filteredHrContacts.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                    {searchTerm ? `No results found for "${searchTerm}"` : 'No HR contacts tracked yet. Click "+ HR" in the navbar.'}
                </div>
            ) : (
                <div className="email-list">
                    {filteredHrContacts.map((hr) => (
                        <div key={hr.id} className="email-row" style={{ gridTemplateColumns: '1fr 1.5fr 1fr 1.5fr 150px' }}>
                            <div className="email-address-wrapper">
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    background: 'var(--primary-50)',
                                    color: 'var(--primary-600)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                    flexShrink: 0
                                }}>
                                    {hr.companyName.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{hr.companyName}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                                <span className="email-meta" style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {hr.emailId}
                                </span>
                                <button
                                    className="copy-btn"
                                    onClick={() => copyToClipboard(hr.emailId, `email-${hr.id}`)}
                                    title="Copy to clipboard"
                                >
                                    {copiedField === `email-${hr.id}` ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                                <span className="email-meta" style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {hr.mobileNumber}
                                </span>
                                <button
                                    className="copy-btn"
                                    onClick={() => copyToClipboard(hr.mobileNumber, `mobile-${hr.id}`)}
                                    title="Copy to clipboard"
                                >
                                    {copiedField === `mobile-${hr.id}` ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <a
                                href={hr.linkedInUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="email-meta"
                                style={{
                                    color: 'var(--primary-600)',
                                    textDecoration: 'none',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {hr.linkedInUrl}
                            </a>
                            <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <button
                                    onClick={() => handleEdit(hr)}
                                    className="btn-secondary"
                                    style={{ padding: '6px', borderRadius: '4px' }}
                                    title="Edit"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button
                                    onClick={() => openDeleteModal(hr.id)}
                                    className="btn-secondary"
                                    style={{ padding: '6px', borderRadius: '4px', color: '#ef4444' }}
                                    title="Delete"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit HR Contact</h2>
                            <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleUpdate}>
                            <div className="modal-body">
                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label>Company Name</label>
                                    <input
                                        type="text"
                                        className="email-input"
                                        value={editCompanyName}
                                        onChange={e => setEditCompanyName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label>Email ID</label>
                                    <input
                                        type="email"
                                        className="email-input"
                                        value={editEmailId}
                                        onChange={e => setEditEmailId(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label>Mobile Number</label>
                                    <input
                                        type="text"
                                        className="email-input"
                                        value={editMobileNumber}
                                        onChange={e => setEditMobileNumber(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>LinkedIn URL</label>
                                    <input
                                        type="url"
                                        className="email-input"
                                        value={editLinkedInUrl}
                                        onChange={e => setEditLinkedInUrl(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={updating}>
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="modal-content" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                            <h2 style={{ color: '#991b1b' }}>Delete Confirmation</h2>
                            <button className="close-btn" onClick={() => setIsDeleteModalOpen(false)}>&times;</button>
                        </div>
                        <div className="modal-body" style={{ textAlign: 'center', padding: '1rem 0 2rem' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: '#fef2f2',
                                color: '#ef4444',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem'
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                    <line x1="12" y1="9" x2="12" y2="13"></line>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                            </div>
                            <p style={{ color: 'var(--slate-600)', fontSize: '1.1rem', margin: 0 }}>
                                Are you sure you want to delete this HR contact?
                                <br />
                                <span style={{ fontSize: '0.9rem', color: 'var(--slate-400)' }}>This action cannot be undone.</span>
                            </p>
                        </div>
                        <div className="modal-footer" style={{ borderTop: 'none', justifyContent: 'center', gap: '12px' }}>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setIsDeleteModalOpen(false)}
                                style={{ padding: '10px 24px' }}
                            >
                                No, Cancel
                            </button>
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                style={{
                                    padding: '10px 24px',
                                    background: '#ef4444',
                                    borderColor: '#ef4444',
                                    color: 'white'
                                }}
                            >
                                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HrContacts
