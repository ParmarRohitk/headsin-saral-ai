import React, { useState } from 'react';
import { Candidate } from '../types/candidate';
import CandidateCard from './CandidateCard';
import '../styles/CandidateGrid.css';

interface CandidateGridProps {
    candidates: Candidate[];
    onCandidateClick: (candidate: Candidate) => void;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    onPageChange?: (page: number) => void;
}

// NOTE: Grid layout for candidate cards with pagination and tabs
const CandidateGrid: React.FC<CandidateGridProps> = ({
    candidates,
    onCandidateClick,
    pagination,
    onPageChange,
}) => {
    const [activeTab, setActiveTab] = useState<'matches' | 'shortlisted'>('matches');

    return (
        <div className="candidate-grid-container">
            <div className="grid-tabs">
                <button
                    className={`tab ${activeTab === 'matches' ? 'active' : ''}`}
                    onClick={() => setActiveTab('matches')}
                >
                    Matches ({candidates.length})
                </button>
                <button
                    className={`tab ${activeTab === 'shortlisted' ? 'active' : ''}`}
                    onClick={() => setActiveTab('shortlisted')}
                >
                    Shortlisted (0)
                </button>
            </div>

            <div className="candidate-grid">
                {candidates.map((candidate) => (
                    <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onClick={() => onCandidateClick(candidate)}
                    />
                ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="pagination-btn"
                        onClick={() => onPageChange?.(pagination.page - 1)}
                        disabled={pagination.page === 1}
                    >
                        Previous
                    </button>
                    <span className="pagination-info">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                        className="pagination-btn"
                        onClick={() => onPageChange?.(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default CandidateGrid;
