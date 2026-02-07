import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import './App.css'
import API_BASE_URL from './config'

function Careers() {
    const [careers, setCareers] = useState([])
    const [loading, setLoading] = useState(true)

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingCareer, setEditingCareer] = useState(null)
    const [editCompanyName, setEditCompanyName] = useState('')
    const [editCareerLink, setEditCareerLink] = useState('')
    const [updating, setUpdating] = useState(false)

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deletingCareerId, setDeletingCareerId] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchCareers = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/api/careers`)
            if (response.ok) {
                const data = await response.json()
                setCareers(data)
            }
        } catch (error) {
            console.error('Failed to fetch careers:', error)
        } finally {
            setLoading(false)
        }
    }

    const exportToExcel = () => {
        if (careers.length === 0) return;

        const dataToExport = careers.map(career => ({
            'Company Name': career.companyName,
            'Career Page Link': career.careerLink
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Careers");
        XLSX.writeFile(workbook, "Company_Careers.xlsx");
    };

    const openDeleteModal = (id) => {
        setDeletingCareerId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingCareerId) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/careers/${deletingCareerId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setCareers(careers.filter(c => c.id !== deletingCareerId));
                setIsDeleteModalOpen(false);
            }
        } catch (error) {
            console.error('Failed to delete:', error);
        } finally {
            setIsDeleting(false);
            setDeletingCareerId(null);
        }
    };

    const handleEdit = (career) => {
        setEditingCareer(career);
        setEditCompanyName(career.companyName);
        setEditCareerLink(career.careerLink);
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/careers/${editingCareer.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyName: editCompanyName, careerLink: editCareerLink })
            });

            if (response.ok) {
                const updated = await response.json();
                setCareers(careers.map(c => c.id === updated.id ? updated : c));
                setIsEditModalOpen(false);
            }
        } catch (error) {
            console.error('Failed to update:', error);
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        fetchCareers()

        const handleCareerAdded = () => {
            fetchCareers();
        };

        window.addEventListener('careerAdded', handleCareerAdded);
        return () => window.removeEventListener('careerAdded', handleCareerAdded);
    }, [])

    return (
        <div className="email-list-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--slate-200)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--slate-800)', margin: 0 }}>
                    Track Career Pages
                </h2>
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
                    disabled={careers.length === 0 || loading}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Export to Excel
                </button>
            </div>
            <div className="email-header-row" style={{ gridTemplateColumns: '1.2fr 3.5fr 150px' }}>
                <span>Company</span>
                <span>Links</span>
                <span style={{ textAlign: 'right' }}>Actions</span>
            </div>

            {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                    Loading companies...
                </div>
            ) : careers.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                    No career pages tracked yet. Click "+ Career" in the navbar.
                </div>
            ) : (
                <div className="email-list">
                    {careers.map((career) => (
                        <div key={career.id} className="email-row" style={{ gridTemplateColumns: '1.2fr 3.5fr 150px' }}>
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
                                    {career.companyName.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{career.companyName}</span>
                            </div>
                            <a
                                href={career.careerLink}
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
                                {career.careerLink}
                            </a>
                            <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <a
                                    href={career.careerLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary"
                                    style={{
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '6px 12px',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    Visit
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                        <polyline points="15 3 21 3 21 9"></polyline>
                                        <line x1="10" y1="14" x2="21" y2="3"></line>
                                    </svg>
                                </a>
                                <button
                                    onClick={() => handleEdit(career)}
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
                                    onClick={() => openDeleteModal(career.id)}
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
                            <h2>Edit Career Page</h2>
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
                                <div className="form-group">
                                    <label>Career Page URL</label>
                                    <input
                                        type="url"
                                        className="email-input"
                                        value={editCareerLink}
                                        onChange={e => setEditCareerLink(e.target.value)}
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
                                Are you sure you want to delete this company?
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

export default Careers
