import React from 'react';
import { Candidate } from '../types/candidate';
import '../styles/CandidateCard.css';

interface CandidateCardProps {
    candidate: Candidate;
    onClick: () => void;
    onLike?: () => void;
    onDislike?: () => void;
    onShortlist?: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
    candidate,
    onClick,
    onLike,
    onDislike,
    onShortlist,
}) => {
    // skills from backend, fallback to empty array
    const skills = (candidate.skills || []).filter(Boolean).slice(0, 3);
    const isUnlocked = !candidate.contact_locked;

    return (
        <div className="candidate-card" onClick={onClick}>
            <div className="card-top">
                <div className="profile-section">
                    <div className="avatar-container">
                        <img
                            src={candidate.image_url || `https://ui-avatars.com/api/?name=${candidate.name}&background=random`}
                            alt={candidate.name}
                            className="candidate-avatar"
                        />
                        <div className="status-indicator">
                            <span className="link-icon">🔗</span>
                        </div>
                    </div>
                    <div className="candidate-basic-info">
                        <h3 className="candidate-name">{candidate.name}</h3>
                        <p className="candidate-title">{candidate.title}</p>
                        <div className="candidate-meta">
                            <span className="exp-badge">{candidate.experience_years} years Total Exp</span>
                            <span className="loc-text">📍 {candidate.location}</span>
                        </div>
                    </div>
                </div>
                <div className="card-actions">
                    <button
                        className={`btn-heart ${candidate.is_shortlisted ? 'active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onShortlist?.();
                        }}
                        title="Shortlist"
                    >
                        <svg viewBox="0 0 24 24" fill={candidate.is_shortlisted ? "#5542f6" : "none"} stroke={candidate.is_shortlisted ? "#5542f6" : "#d1d5db"} strokeWidth="2" width="20" height="20">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="card-stats">
                <div className="stat-box match-score">
                    <span className="stat-value">{candidate.match_percent}%</span>
                    <span className="stat-label">MATCH SCORE</span>
                </div>
                <div className="stat-box current-comp">
                    <span className="stat-value">{candidate.company || 'N/A'}</span>
                    <span className="stat-label">CURRENT</span>
                </div>
            </div>

            <div className="card-skills">
                {skills.map(skill => (
                    <span key={skill} className="skill-chip">{skill}</span>
                ))}
            </div>

            {isUnlocked && (
                <div className="contact-info">
                    <div className="contact-item">
                        <span className="icon">✉️</span> {candidate.email}
                    </div>
                    <div className="contact-item">
                        <span className="icon">📞</span> +1 (555) 012-3456
                    </div>
                </div>
            )}

            <div className="card-footer">
                <div className="social-links">
                    <span className="social-icon linkedin">in</span>
                    <span className="social-icon paper">📄</span>
                </div>
                <button className="btn-view-profile">
                    View Profile →
                </button>
            </div>
        </div>
    );
};

export default CandidateCard;
