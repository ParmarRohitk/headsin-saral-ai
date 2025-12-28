import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/CandidateModal.css';
import '../styles/SequenceBuilder.css';

interface SequenceStep {
    id: string;
    type: 'email' | 'delay';
    subject?: string;
    content?: string;
    delayDays?: number;
}

interface CampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

const CampaignModal: React.FC<CampaignModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [steps, setSteps] = useState<SequenceStep[]>([
        { id: '1', type: 'email', subject: 'Initial Outreach', content: 'Hi {{name}}, ...' }
    ]);
    const [activeStepId, setActiveStepId] = useState<string>('1');

    if (!isOpen) return null;

    const activeStep = steps.find(s => s.id === activeStepId) || steps[0];

    const updateStep = (id: string, updates: Partial<SequenceStep>) => {
        setSteps(steps.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const addStep = (type: 'email' | 'delay') => {
        const newId = Math.random().toString(36).substr(2, 9);
        const newStep: SequenceStep = type === 'email'
            ? { id: newId, type: 'email', subject: '', content: '' }
            : { id: newId, type: 'delay', delayDays: 2 };

        setSteps([...steps, newStep]);
        setActiveStepId(newId);
    };

    const removeStep = (id: string) => {
        if (steps.length === 1) return;
        const newSteps = steps.filter(s => s.id !== id);
        setSteps(newSteps);
        if (activeStepId === id) {
            setActiveStepId(newSteps[0].id);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '1000px' }}>
                <div className="modal-header">
                    <div>
                        <h2 className="modal-name">Sequence Builder</h2>
                        <input
                            className="campaign-name-input"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Unnamed Campaign"
                            style={{ border: 'none', background: 'transparent', fontSize: '14px', color: '#6b7280', outline: 'none', width: '300px' }}
                        />
                    </div>
                    <button className="btn-close" onClick={onClose}>×</button>
                </div>

                <div className="sequence-builder-container">
                    {/* Sidebar */}
                    <aside className="sequence-sidebar">
                        <div className="sidebar-header">
                            Steps
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => addStep('email')} className="btn-mini" title="Add Email">✉️</button>
                                <button onClick={() => addStep('delay')} className="btn-mini" title="Add Delay">⏳</button>
                            </div>
                        </div>
                        <div className="steps-list">
                            {steps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className={`step-item ${activeStepId === step.id ? 'active' : ''}`}
                                    onClick={() => setActiveStepId(step.id)}
                                >
                                    <div className="step-number">{index + 1}</div>
                                    <div className="step-info">
                                        <span className="step-name">
                                            {step.type === 'email' ? (step.subject || 'New Email') : `Wait ${step.delayDays} days`}
                                        </span>
                                        <span className="step-meta">{step.type.toUpperCase()}</span>
                                    </div>
                                    {steps.length > 1 && (
                                        <button className="btn-remove" onClick={(e) => { e.stopPropagation(); removeStep(step.id); }}>×</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Editor */}
                    <main className="editor-main">
                        <div className="editor-header">
                            <span className={`step-type-badge type-${activeStep.type}`}>
                                {activeStep.type} Step
                            </span>
                        </div>
                        <div className="editor-body">
                            {activeStep.type === 'email' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div className="form-group">
                                        <label>Subject</label>
                                        <input
                                            value={activeStep.subject || ''}
                                            onChange={e => updateStep(activeStep.id, { subject: e.target.value })}
                                            placeholder="Subject line..."
                                            className="modal-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Body</label>
                                        <div className="quill-wrapper">
                                            <ReactQuill
                                                theme="snow"
                                                value={activeStep.content || ''}
                                                onChange={val => updateStep(activeStep.id, { content: val })}
                                                style={{ height: '250px' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="delay-input-group">
                                    <span>Wait for</span>
                                    <input
                                        type="number"
                                        value={activeStep.delayDays || 0}
                                        onChange={e => updateStep(activeStep.id, { delayDays: parseInt(e.target.value) })}
                                        className="delay-number"
                                    />
                                    <span>days before the next step.</span>
                                </div>
                            )}
                        </div>
                    </main>
                </div>

                <div className="modal-footer" style={{ padding: '20px', borderTop: '1px solid #eef2f6', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'white' }}>
                    <button className="btn-view" onClick={onClose}>Cancel</button>
                    <button
                        className="btn-new-project"
                        style={{ padding: '10px 24px' }}
                        onClick={() => onSave({ name, steps })}
                    >
                        Save Sequence
                    </button>
                </div>
            </div>
            <style>{`
                .btn-mini { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 14px; }
                .btn-mini:hover { background: #e5e7eb; }
                .btn-remove { margin-left: auto; background: none; border: none; color: #9ca3af; cursor: pointer; font-size: 18px; display: none; }
                .step-item:hover .btn-remove { display: block; }
                .modal-input { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #eef2f6; font-size: 14px; }
                .form-group label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 700; color: #374151; }
            `}</style>
        </div>
    );
};

export default CampaignModal;
