import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import SearchStages from '../components/SearchStages';
import CandidateGrid from '../components/CandidateGrid';
import CandidateModal from '../components/CandidateModal';
import CreditConfirmModal from '../components/CreditConfirmModal';
import { candidateApi, creditApi } from '../services/api';
import { Candidate, CandidateDetail, SearchStage, SearchFilters } from '../types/candidate';
import '../styles/SearchPage.css';

interface SearchPageProps {
    credits: number | null;
    onUpdateCredits?: (credits: number) => void;
    hideSidebar?: boolean;
    onSearchStateChange?: (isSearching: boolean) => void;
    onSidebarVisibilityChange?: (isVisible: boolean) => void;
    onSearchComplete?: (searchId: number) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ credits, onUpdateCredits, hideSidebar, onSearchStateChange, onSidebarVisibilityChange, onSearchComplete }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [searchId, setSearchId] = useState<number | null>(null);
    const [stages, setStages] = useState<SearchStage[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
    const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
    const [isResultsLoading, setIsResultsLoading] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateDetail | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'candidates' | 'shortlist'>('candidates');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [pendingQuery, setPendingQuery] = useState('');

    // Determine sidebar visibility
    useEffect(() => {
        // Show sidebar ONLY if we are NOT searching AND (we have candidates OR we are on shortlist tab)
        const shouldShowSidebar = !isSearching && (candidates.length > 0 || activeTab === 'shortlist');
        onSidebarVisibilityChange?.(shouldShowSidebar);
    }, [isSearching, candidates.length, activeTab, onSidebarVisibilityChange]);
    const [filters, setFilters] = useState<SearchFilters>({});
    const [lastQuery, setLastQuery] = useState('');
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
    });

    // NOTE: Fetch user credits on mount
    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const response = await creditApi.getUserCredits();
                if (response.success && onUpdateCredits) {
                    onUpdateCredits(response.data.available_credits);
                }
            } catch (error) {
                console.error('Error fetching credits:', error);
            }
        };
        fetchCredits();
    }, [onUpdateCredits]);

    const fetchShortlist = async () => {
        setIsResultsLoading(true);
        try {
            const response = await candidateApi.getShortlisted();
            if (response.success) {
                setCandidates(response.data);
                setPagination({ page: 1, limit: response.data.length, total: response.data.length, totalPages: 1 });
            }
        } catch (error) {
            console.error('Error fetching shortlist:', error);
        } finally {
            setIsResultsLoading(false);
        }
    };

    const fetchResults = React.useCallback(async (sid: number, page: number, currentFilters = filters) => {
        setIsResultsLoading(true);
        try {
            const response = await candidateApi.getSearchResults(sid, 1, 1000, currentFilters);
            if (response.success) {
                const all = response.data.candidates;
                setAllCandidates(all);
                setFilteredCandidates(all);
                setCandidates(all.slice((page - 1) * 12, page * 12));
                setPagination({
                    page,
                    limit: 12,
                    total: all.length,
                    totalPages: Math.ceil(all.length / 12),
                });
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setIsResultsLoading(false);
        }
    }, [filters]);

    // Handle initial search tab switching
    useEffect(() => {
        if (activeTab === 'shortlist') {
            fetchShortlist();
        } else if (searchId) {
            fetchResults(searchId, 1);
        }
    }, [activeTab, searchId, fetchResults]);

    // NOTE: Poll search status to update stages
    useEffect(() => {
        if (!searchId) return;

        const pollInterval = setInterval(async () => {
            try {
                const response = await candidateApi.getSearchStatus(searchId);
                if (response.success) {
                    setStages(response.data.stages);

                    const allCompleted = response.data.stages.every(
                        (stage: SearchStage) => stage.status === 'completed'
                    );

                    if (allCompleted) {
                        clearInterval(pollInterval);
                        setIsSearching(false);
                        // Refresh credits after search
                        const credRes = await creditApi.getUserCredits();
                        if (credRes.success && onUpdateCredits) {
                            onUpdateCredits(credRes.data.available_credits);
                        }
                        // Navigate to results page
                        if (onSearchComplete) {
                            onSearchComplete(searchId);
                        }
                    }
                }
            } catch (error) {
                console.error('Error polling search status:', error);
                clearInterval(pollInterval);
                setIsSearching(false);
            }
        }, 1000);

        return () => clearInterval(pollInterval);
    }, [searchId, onUpdateCredits, fetchResults]);

    const handleSearch = (query: string) => {
        setPendingQuery(query);
        setIsConfirmModalOpen(true);
    };

    const confirmSearch = async () => {
        setIsConfirmModalOpen(false);
        const query = pendingQuery;
        setLastQuery(query);
        setIsSearching(true);
        setCandidates([]);
        setStages([
            { name: 'Fetching profile data from multiple sources', status: 'pending' },
            { name: 'Running semantic search and LLM matching', status: 'pending' },
            { name: 'Ranking candidates using weighted scoring', status: 'pending' },
            { name: 'Preparing insights and match list', status: 'pending' },
        ]);

        try {
            const response = await candidateApi.search(query, filters);
            if (response.success) {
                setSearchId(response.data.searchId);
            }
        } catch (error) {
            console.error('Error initiating search:', error);
            setIsSearching(false);
        }
    };

    const handleFilterChange = (newFilters: SearchFilters) => {
        setFilters(newFilters);
        const filtered = allCandidates.filter(candidate => {
            if (newFilters.role && !candidate.title?.toLowerCase().includes(newFilters.role.toLowerCase())) return false;
            if (newFilters.location && !candidate.location?.toLowerCase().includes(newFilters.location.toLowerCase())) return false;
            if (newFilters.experience_min && (candidate.experience_years || 0) < newFilters.experience_min) return false;
            if (newFilters.skills && newFilters.skills.length > 0) {
                const candidateSkills = candidate.skills || [];
                if (!newFilters.skills.some(skill => candidateSkills.some(cs => cs.toLowerCase().includes(skill.toLowerCase())))) return false;
            }
            return true;
        });
        setFilteredCandidates(filtered);
        setCandidates(filtered.slice(0, 12));
        setPagination(prev => ({
            ...prev,
            page: 1,
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / 12),
        }));
        setLastUpdated(new Date());
    };

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
        setCandidates(filteredCandidates.slice((page - 1) * 12, page * 12));
        setLastUpdated(new Date());
    };

    const handleCandidateClick = async (candidate: Candidate) => {
        try {
            const response = await candidateApi.getCandidateDetails(candidate.id);
            if (response.success) {
                setSelectedCandidate(response.data);
            } else {
                setSelectedCandidate(candidate as CandidateDetail);
            }
        } catch (error) {
            setSelectedCandidate(candidate as CandidateDetail);
        }
        setIsModalOpen(true);
    };

    const handleShortlist = async (candidate: Candidate) => {
        try {
            const response = await candidateApi.addToShortlist(candidate.id);
            if (response.success) {
                setCandidates(prev => prev.map(c =>
                    c.id === candidate.id ? { ...c, is_shortlisted: !c.is_shortlisted } : c
                ));
            }
        } catch (error) {
            console.error('Error shortlisting:', error);
        }
    };

    const handleLike = (candidate: Candidate) => {
        if (!candidate.is_shortlisted) {
            handleShortlist(candidate);
        }
    };

    const handleDislike = (candidate: Candidate) => {
        // For now, just remove from the current results view
        setCandidates(prev => prev.filter(c => c.id !== candidate.id));
    };

    const content = (
        <>
            <main className="search-main-container">
                <header className="dashboard-content-header">
                    <div className="header-left">
                        <h1 className="content-title">New AI Search</h1>
                        <span className="badge-active">Active</span>
                    </div>
                    <div className="header-right">
                        <div className="toggle-tabs">
                            <button
                                className={`toggle-tab ${activeTab === 'candidates' ? 'active' : ''}`}
                                onClick={() => setActiveTab('candidates')}
                            >
                                Matches
                            </button>
                            <button
                                className={`toggle-tab ${activeTab === 'shortlist' ? 'active' : ''}`}
                                onClick={() => setActiveTab('shortlist')}
                            >
                                Shortlisted
                            </button>
                        </div>
                    </div>
                </header>
                {activeTab === 'candidates' && !isSearching && candidates.length === 0 && (
                    <div className="initial-search-view">
                        <div className="search-top-nav">
                            <div className="nav-left">
                                <div className="logo-box">
                                    <div className="logo-inner"></div>
                                </div>
                                <span className="project-tag">Frontend Lead</span>
                            </div>
                            <div className="nav-right">
                                <div className="credits-pill-nav">
                                    <span className="lightning-icon">⚡</span>
                                    <span className="credits-val">{credits || 0} Credits</span>
                                </div>
                            </div>
                        </div>

                        <div className="search-hero">
                            <div className="ai-badge">
                                AI-Powered Sourcing
                            </div>
                            <h1 className="search-title">Instant talent clarity.</h1>
                            <p className="search-subtitle">
                                Stop searching, start hiring. Human decisions only when they matter.
                            </p>
                        </div>
                        <div className="search-container">
                            <SearchBar onSearch={handleSearch} isLoading={isSearching} />
                        </div>
                    </div>
                )}

                {isSearching && stages.length > 0 && (
                    <div className="loading-state-overlay" style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 9999,
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <SearchStages stages={stages} />
                    </div>
                )}

                {(candidates.length > 0 || isResultsLoading) && !isSearching && (
                    <div className="results-view">
                        <CandidateGrid
                            candidates={candidates}
                            onCandidateClick={handleCandidateClick}
                            pagination={pagination}
                            onPageChange={handlePageChange}
                            isLoading={isResultsLoading}
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onShortlist={handleShortlist}
                            onLike={handleLike}
                            onDislike={handleDislike}
                            lastUpdated={lastUpdated}
                        />
                    </div>
                )}

                {activeTab === 'shortlist' && candidates.length === 0 && !isResultsLoading && (
                    <div style={{ padding: '100px', textAlign: 'center', color: '#6b7280' }}>
                        <h3>No shortlisted candidates yet.</h3>
                        <p>Search for candidates and click the heart icon to shortlist them.</p>
                        <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => setActiveTab('candidates')}>
                            Search Candidates
                        </button>
                    </div>
                )}
            </main>

            <CandidateModal
                candidate={selectedCandidate}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <CreditConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmSearch}
                cost={10}
                availableCredits={credits || 0}
            />
        </>
    );

    if (hideSidebar) {
        return <div className="search-page-inner">{content}</div>;
    }

    return (
        <div className="search-page-wrapper">
            {/* Background Decorations */}
            <div className="search-bg-decorations">
                <div className="bg-gradient-top"></div>
                <div className="bg-glow-right"></div>
                <div className="bg-glow-left"></div>
            </div>
            {content}
        </div>
    );
};

export default SearchPage;
