import React from 'react';
import '../styles/CandidateModal.css'; // Reuse overlay styles

interface CreditConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    cost: number;
    availableCredits: number;
}

const CreditConfirmModal: React.FC<CreditConfirmModalProps> = ({ isOpen, onClose, onConfirm, cost, availableCredits }) => {
    if (!isOpen) return null;

    const hasEnough = availableCredits >= cost;

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
            <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px', padding: '0' }}>
                <div className="modal-content" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                    <div style={{ padding: '32px', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1f2937', marginBottom: '8px' }}>
                            Search Confirmation
                        </h2>
                        <p style={{ color: '#6b7280', lineHeight: '1.5', marginBottom: '24px' }}>
                            This search will use <strong>{cost} credits</strong>. You have <strong>{availableCredits} credits</strong> available.
                        </p>

                        {!hasEnough && (
                            <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#dc2626', fontSize: '14px', marginBottom: '24px' }}>
                                ⚠️ Insufficient credits. Please top up to continue.
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={onClose}
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb', background: 'white', fontWeight: '700', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={!hasEnough}
                                style={{
                                    flex: 2,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: hasEnough ? 'linear-gradient(135deg, #5D4FE9 0%, #7C3AED 100%)' : '#e5e7eb',
                                    color: 'white',
                                    fontWeight: '700',
                                    cursor: hasEnough ? 'pointer' : 'not-allowed',
                                    boxShadow: hasEnough ? '0 10px 20px rgba(93, 79, 233, 0.2)' : 'none'
                                }}
                            >
                                {hasEnough ? 'Confirm & Search' : 'Low Credits'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditConfirmModal;
