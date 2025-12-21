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

// NOTE: Card displaying candidate information with actions
const CandidateCard: React.FC<CandidateCardProps> = ({
    candidate,
    onClick,
    onLike,
    onDislike,
    onShortlist,
}) => {
    const getMatchColor = (percent?: number) => {
        if (!percent) return '#999';
        if (percent >= 90) return '#10b981';
        if (percent >= 75) return '#3b82f6';
        if (percent >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const getAvailabilityDot = (status: string) => {
        const colors: Record<string, string> = {
            available: '#10b981',
            open_to_work: '#3b82f6',
            unavailable: '#ef4444',
        };
        return colors[status] || '#999';
    };

    return (
        <div className="candidate-card" onClick={onClick}>
            <div className="card-header">
                <img
                    src={candidate.image_url || '/placeholder-avatar.png'}
                    alt={candidate.name}
                    className="candidate-avatar"
                />
                <div className="candidate-info">
                    <div className="candidate-name">
                        {candidate.name}
                        <span
                            className="availability-dot"
                            style={{ backgroundColor: getAvailabilityDot(candidate.availability_status) }}
                        ></span>
                    </div>
                    <div className="candidate-title">{candidate.title}</div>
                    <div className="candidate-company">{candidate.company}</div>
                </div>
            </div>

            <div className="card-details">
                <div className="detail-item">
                    <span className="detail-icon">💼</span>
                    <span>{candidate.experience_years} years</span>
                </div>
                <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span>{candidate.location}</span>
                </div>
            </div>

            {candidate.match_percent && (
                <div className="match-percent" style={{ color: getMatchColor(candidate.match_percent) }}>
                    {candidate.match_percent}% Match
                </div>
            )}

            <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                <button className="action-btn" onClick={onLike} title="Like">
                    👍
                </button>
                <button className="action-btn" onClick={onDislike} title="Dislike">
                    👎
                </button>
                <button className="action-btn" onClick={onShortlist} title="Shortlist">
                    ⭐
                </button>
            </div>
        </div>
    );
};

export default CandidateCard;
