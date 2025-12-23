import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import SearchStages from '../components/SearchStages';
import CandidateGrid from '../components/CandidateGrid';
import CandidateModal from '../components/CandidateModal';
import { candidateApi, creditApi } from '../services/api';
import { Candidate, CandidateDetail, SearchStage } from '../types/candidate';
import '../styles/SearchPage.css';

// NOTE: Main search page matching design reference
const SearchPage: React.FC = () => {
    const [isSearching, setIsSearching] = useState(false);
    const [searchId, setSearchId] = useState<number | null>(null);
    const [stages, setStages] = useState<SearchStage[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateDetail | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [credits, setCredits] = useState(485);
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
                if (response.success) {
                    setCredits(response.data.available_credits);
                }
            } catch (error) {
                console.error('Error fetching credits:', error);
            }
        };
        fetchCredits();
    }, []);

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
                        fetchResults(searchId, 1);
                    }
                }
            } catch (error) {
                console.error('Error polling search status:', error);
                clearInterval(pollInterval);
                setIsSearching(false);
            }
        }, 1000);

        return () => clearInterval(pollInterval);
    }, [searchId]);

    const fetchResults = async (sid: number, page: number) => {
        try {
            const response = await candidateApi.getSearchResults(sid, page, 12);
            if (response.success) {
                setCandidates(response.data.candidates);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    };

    const handleSearch = async (query: string) => {
        setIsSearching(true);
        setCandidates([]);
        setStages([
            { name: 'Fetch profiles', status: 'pending' },
            { name: 'Semantic search and LLM match', status: 'pending' },
            { name: 'Ranking and scoring', status: 'pending' },
            { name: 'Preparing insights', status: 'pending' },
        ]);

        try {
            const response = await candidateApi.search(query);
            if (response.success) {
                setSearchId(response.data.searchId);
            }
        } catch (error) {
            console.error('Error initiating search:', error);
            setIsSearching(false);
        }
    };

    const handleCandidateClick = async (candidate: Candidate) => {
        setSelectedCandidate({
            ...candidate,
            strengths: ['Strong technical skills', 'Great communication', 'Team player'],
            areas_to_probe: ['Leadership experience', 'Scalability knowledge'],
            ai_verdict: 'Highly recommended for this role',
        });
        setIsModalOpen(true);
    };

    const handlePageChange = (page: number) => {
        if (searchId) {
            fetchResults(searchId, page);
        }
    };

    return (
        <div className="search-page">
            <header className="search-top-bar">
                <div className="top-bar-left">
                    <span className="logo-icon-small">🟣</span>
                    <span className="user-role">Frontend Lead</span>
                </div>
                <div className="top-bar-right">
                    <span className="credits-icon">💰</span>
                    <span className="credits-amount">{credits} Credits</span>
                </div>
            </header>

            <main className="search-main">
                {!isSearching && candidates.length === 0 && (
                    <div className="search-hero">
                        <div className="ai-badge">
                            <span className="badge-icon">🚀</span>
                            AI-Powered Sourcing
                        </div>
                        <h1 className="search-title">Instant talent clarity.</h1>
                        <p className="search-subtitle">
                            Stop searching, start hiring. Human decisions only when they matter.
                        </p>
                    </div>
                )}

                <div className="search-container">
                    <SearchBar onSearch={handleSearch} isLoading={isSearching} />
                </div>

                {stages.length > 0 && <SearchStages stages={stages} />}

                {candidates.length > 0 && (
                    <CandidateGrid
                        candidates={candidates}
                        onCandidateClick={handleCandidateClick}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                    />
                )}
            </main>

            <CandidateModal
                candidate={selectedCandidate}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default SearchPage;
