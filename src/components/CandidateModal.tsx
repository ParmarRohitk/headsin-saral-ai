import React from 'react';
import { CandidateDetail } from '../types/candidate';
import '../styles/CandidateModal.css';

interface CandidateModalProps {
    candidate: CandidateDetail | null;
    isOpen: boolean;
    onClose: () => void;
    onUnlockContact?: () => void;
}

// NOTE: Modal displaying detailed candidate information
const CandidateModal: React.FC<CandidateModalProps> = ({
    candidate,
    isOpen,
    onClose,
    onUnlockContact,
}) => {
    if (!isOpen || !candidate) return null;

    const getMatchColor = (percent?: number) => {
        if (!percent) return '#999';
        if (percent >= 90) return '#10b981';
        if (percent >= 75) return '#3b82f6';
        if (percent >= 60) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>

                <div className="modal-header">
                    <img
                        src={candidate.image_url || '/placeholder-avatar.png'}
                        alt={candidate.name}
                        className="modal-avatar"
                    />
                    <div className="modal-header-info">
                        <h2>{candidate.name}</h2>
                        <p className="modal-title">{candidate.title}</p>
                        {candidate.match_percent && (
                            <div
                                className="modal-match"
                                style={{ color: getMatchColor(candidate.match_percent) }}
                            >
                                {candidate.match_percent}% Match
                            </div>
                        )}
                    </div>
                </div>

                <div className="modal-body">
                    {candidate.ai_verdict && (
                        <div className="ai-verdict-banner">
                            <span className="verdict-icon">✨</span>
                            <div className="verdict-content">
                                <span className="verdict-label">AI VERDICT</span>
                                <p className="verdict-text">{candidate.ai_verdict}</p>
                            </div>
                        </div>
                    )}

                    <div className="modal-grid-two">
                        {candidate.strengths && candidate.strengths.length > 0 && (
                            <section className="modal-section">
                                <h3>Strengths</h3>
                                <div className="strengths-list">
                                    {candidate.strengths.map((strength, index) => (
                                        <div key={index} className="strength-item">
                                            <span className="check-icon">✓</span> {strength}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {candidate.areas_to_probe && candidate.areas_to_probe.length > 0 && (
                            <section className="modal-section">
                                <h3>Areas to Probe</h3>
                                <div className="probes-list">
                                    {candidate.areas_to_probe.map((area, index) => (
                                        <div key={index} className="probe-item">
                                            <span className="probe-icon">?</span> {area}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <section className="modal-section">
                        <h3>Career Timeline</h3>
                        <div className="career-timeline">
                            <div className="timeline-line"></div>
                            {(candidate.experience || []).map((exp, idx) => (
                                <div key={exp.id} className="timeline-dot-wrapper">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <span className="timeline-date">{exp.start_date.split('-')[0]}</span>
                                        <span className="timeline-title">{exp.company}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {candidate.experience && candidate.experience.length > 0 && (
                        <section className="modal-section">
                            <h3>Work Experience</h3>
                            {candidate.experience.map((exp) => (
                                <div key={exp.id} className="experience-item">
                                    <h4>{exp.position}</h4>
                                    <p className="experience-company">{exp.company}</p>
                                    <p className="experience-dates">
                                        {exp.start_date} - {exp.end_date || 'Present'}
                                    </p>
                                    {exp.description && <p>{exp.description}</p>}
                                </div>
                            ))}
                        </section>
                    )}

                    {candidate.about && (
                        <section className="modal-section">
                            <h3>About</h3>
                            <p>{candidate.about}</p>
                        </section>
                    )}

                    {candidate.contact_locked && (
                        <div className="contact-locked">
                            <p>Contact information is locked</p>
                            <button className="btn-primary" onClick={onUnlockContact}>
                                Unlock Credits (5 credits)
                            </button>
                        </div>
                    )}

                    {candidate.education && candidate.education.length > 0 && (
                        <section className="modal-section">
                            <h3>Education</h3>
                            {candidate.education.map((edu) => (
                                <div key={edu.id} className="education-item">
                                    <h4>{edu.degree} in {edu.field_of_study}</h4>
                                    <p>{edu.institution}</p>
                                    <p className="education-year">{edu.graduation_year}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CandidateModal;
