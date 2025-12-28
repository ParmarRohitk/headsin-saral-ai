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
                    <span className="filter-icon-main">▽</span>
                    <span className="filter-label">Filters:</span>
                    <div className="filter-dropdown-wrapper">
                        <select
                            className="filter-select-custom"
                            defaultValue=""
                        >
                            <option value="">Score &gt; Any</option>
                            <option value="90">Score &gt; 90%</option>
                            <option value="80">Score &gt; 80%</option>
                        </select>
                    </div>
                    <div className="filter-dropdown-wrapper">
                        <select
                            className="filter-select-custom"
                            value={filters.experience_min || ''}
                            onChange={(e) => onFilterChange?.({ ...filters, experience_min: e.target.value ? parseInt(e.target.value) : undefined })}
                        >
                            <option value="">Exp &gt; Any</option>
                            <option value="1">Exp &gt; 1+ yrs</option>
                            <option value="3">Exp &gt; 3+ yrs</option>
                            <option value="5">Exp &gt; 5+ yrs</option>
                        </select>
                    </div>
                    <div className="filter-location-wrapper">
                        <span className="loc-search-icon">📍</span>
                        <input
                            type="text"
                            placeholder="Filter by location..."
                            className="filter-location-input"
                            value={filters.location || ''}
                            onChange={(e) => onFilterChange?.({ ...filters, location: e.target.value })}
                        />
                    </div>
                </div>
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
