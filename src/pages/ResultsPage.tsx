import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import CandidateGrid from '../components/CandidateGrid';
import CandidateModal from '../components/CandidateModal';
import { candidateApi } from '../services/api';
import { Candidate, CandidateDetail, SearchFilters } from '../types/candidate';
import '../styles/ResultsPage.css';

interface ResultsPageProps {
    searchId: number;
    credits: number | null;
    onUpdateCredits?: (credits: number) => void;
    onNavigate?: (page: 'search' | 'campaigns') => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ 
    searchId, 
    credits, 
    onUpdateCredits,
    onNavigate 
}) => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
    const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
    const [isResultsLoading, setIsResultsLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateDetail | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'candidates' | 'shortlist'>('candidates');
    const [filters, setFilters] = useState<SearchFilters>({});
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
    });
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchResults = React.useCallback(async (sid: number, page: number) => {
        setIsResultsLoading(true);
        try {
            const response = await candidateApi.getSearchResults(sid, 1, 1000);
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
    }, []);

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

    useEffect(() => {
        if (activeTab === 'shortlist') {
            fetchShortlist();
        } else if (searchId) {
            fetchResults(searchId, 1);
        }
    }, [activeTab, searchId, fetchResults]);

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
        setCandidates(prev => prev.filter(c => c.id !== candidate.id));
    };

    return (
        <div className="results-page-wrapper">
            <Sidebar
                credits={credits || 0}
                activePage="search"
                onNavigate={onNavigate || (() => {})}
            />

            <div className="results-page-content">
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
                                Candidates
                            </button>
                            <button
                                className={`toggle-tab ${activeTab === 'shortlist' ? 'active' : ''}`}
                                onClick={() => setActiveTab('shortlist')}
                            >
                                Shortlist
                            </button>
                        </div>
                    </div>
                </header>

                {(candidates.length > 0 || isResultsLoading) && (
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
                    </div>
                )}
            </div>

            <CandidateModal
                candidate={selectedCandidate}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default ResultsPage;

