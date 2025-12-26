import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/CandidateModal.css'; // Reuse some modal styles

interface CampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

const CampaignModal: React.FC<CampaignModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                <div className="modal-header">
                    <h2 className="modal-name">Create New Sequence</h2>
                    <button className="btn-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Campaign Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eef2f6' }}
                                placeholder="e.g. Q1 Frontend Drive"
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Email Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eef2f6' }}
                                placeholder="Hi {{name}}, I saw your profile..."
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Message Body</label>
                            <div style={{ height: '300px', marginBottom: '50px' }}>
                                <ReactQuill
                                    theme="snow"
                                    value={content}
                                    onChange={setContent}
                                    style={{ height: '100%' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer" style={{ padding: '24px', borderTop: '1px solid #eef2f6', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button className="btn-view" onClick={onClose}>Cancel</button>
                    <button
                        className="btn-new-project"
                        style={{ padding: '10px 24px' }}
                        onClick={() => onSave({ name, subject, content })}
                    >
                        Save Sequence
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignModal;
