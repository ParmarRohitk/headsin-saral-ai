import CandidateCard from './CandidateCard';
import { Candidate } from '../types/candidate';
import Skeleton from './Skeleton';
import '../styles/CandidateGrid.css';

interface CandidateGridProps {
    candidates: Candidate[];
    onCandidateClick: (candidate: Candidate) => void;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    onPageChange: (page: number) => void;
    isLoading?: boolean;
    filters?: import('../types/candidate').SearchFilters;
    onFilterChange?: (filters: import('../types/candidate').SearchFilters) => void;
    onShortlist?: (candidate: Candidate) => void;
    onLike?: (candidate: Candidate) => void;
    onDislike?: (candidate: Candidate) => void;
    lastUpdated?: Date | null;
}

const CandidateGrid: React.FC<CandidateGridProps> = ({
    candidates,
    onCandidateClick,
    pagination,
    onPageChange,
    isLoading,
    filters = {},
    onFilterChange,
    onShortlist,
    onLike,
    onDislike,
    lastUpdated,
}) => {
    if (isLoading) {
        return (
            <div className="candidate-results-container">
                <div className="candidate-grid" style={{ marginTop: '40px' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Skeleton key={i} height="320px" borderRadius="12px" />
                    ))}
                </div>
            </div>
        );
    }
    return (
        <div className="candidate-results-container">
            <div className="results-header-filters">
                <div className="filter-group">
                    <span className="filter-icon">⏳</span>
                    <span className="filter-label">Filters:</span>
                    <select
                        className="filter-dropdown"
                        defaultValue=""
                    >
                        <option value="">Score: Any</option>
                        <option value="90">Score: 90%+</option>
                        <option value="80">Score: 80%+</option>
                        <option value="70">Score: 70%+</option>
                    </select>
                    <select
                        className="filter-dropdown"
                        value={filters.experience_min || ''}
                        onChange={(e) => onFilterChange?.({ ...filters, experience_min: e.target.value ? parseInt(e.target.value) : undefined })}
                    >
                        <option value="">Exp: Any</option>
                        <option value="1">Exp: 1+ yrs</option>
                        <option value="3">Exp: 3+ yrs</option>
                        <option value="5">Exp: 5+ yrs</option>
                        <option value="8">Exp: 8+ yrs</option>
                    </select>
                    <div className="filter-input-wrapper">
                        <span className="input-icon">👤</span>
                        <input
                            type="text"
                            placeholder="Filter by role..."
                            className="filter-input"
                            value={filters.role || ''}
                            onChange={(e) => onFilterChange?.({ ...filters, role: e.target.value })}
                        />
                    </div>
                    <div className="filter-input-wrapper">
                        <span className="input-icon">📍</span>
                        <input
                            type="text"
                            placeholder="Filter by location..."
                            className="filter-input"
                            value={filters.location || ''}
                            onChange={(e) => onFilterChange?.({ ...filters, location: e.target.value })}
                        />
                    </div>
                    <div className="filter-input-wrapper">
                        <span className="input-icon">🛠️</span>
                        <input
                            type="text"
                            placeholder="Filter by skills (comma-separated)..."
                            className="filter-input"
                            value={filters.skills?.join(', ') || ''}
                            onChange={(e) => onFilterChange?.({ ...filters, skills: e.target.value ? e.target.value.split(',').map(s => s.trim()) : undefined })}
                        />
                    </div>
                </div>
                {lastUpdated && (
                    <div className="last-updated">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                )}
            </div>

            <div className="candidate-grid">
                {candidates.map((candidate) => (
                    <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onClick={() => onCandidateClick(candidate)}
                        onShortlist={() => onShortlist?.(candidate)}
                        onLike={() => onLike?.(candidate)}
                        onDislike={() => onDislike?.(candidate)}
                    />
                ))}
            </div>

            {pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="pagination-btn"
                        disabled={pagination.page === 1}
                        onClick={() => onPageChange(pagination.page - 1)}
                    >
                        Previous
                    </button>
                    <span className="pagination-info">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                        className="pagination-btn"
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => onPageChange(pagination.page + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default CandidateGrid;
