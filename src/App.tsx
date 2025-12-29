import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import CampaignsPage from './pages/CampaignsPage';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
    const [isAppMode, setIsAppMode] = useState(false);
    return (
        <ErrorBoundary>
            <AppContent isAppMode={isAppMode} setIsAppMode={setIsAppMode} />
        </ErrorBoundary>
    );
}

function AppContent({ isAppMode, setIsAppMode }: { isAppMode: boolean, setIsAppMode: (v: boolean) => void }) {
    const [currentPage, setCurrentPage] = useState<'search' | 'results' | 'campaigns'>('search');
    const [credits, setCredits] = useState<number | null>(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [searchId, setSearchId] = useState<number | null>(null);

    const handleStart = () => {
        setIsAppMode(true);
    };

    const handleNavigate = (page: 'search' | 'campaigns') => {
        if (page === 'search') {
            setSearchId(null);
        }
        setCurrentPage(page);
    };

    const handleSearchComplete = (id: number) => {
        setSearchId(id);
        setCurrentPage('results');
    };

    if (!isAppMode) {
        return <LandingPage onStartSearch={handleStart} />;
    }

    // Sidebar is persistent in dashboard mode, but hidden on the immersive start screen
    const showSidebar = currentPage === 'campaigns' || currentPage === 'results' || sidebarVisible;

    return (
        <div className="search-page-wrapper">
            {showSidebar && (
                <Sidebar
                    credits={credits || 0}
                    activePage={currentPage === 'results' ? 'search' : currentPage}
                    onNavigate={handleNavigate}
                />
            )}

            <div className={`search-page-content ${!showSidebar ? 'full-width' : ''}`}>
                {currentPage === 'search' ? (
                    <SearchPage
                        credits={credits}
                        onUpdateCredits={setCredits}
                        hideSidebar={!showSidebar}
                        onSidebarVisibilityChange={setSidebarVisible}
                        onSearchComplete={handleSearchComplete}
                    />
                ) : currentPage === 'results' && searchId ? (
                    <ResultsPage
                        searchId={searchId}
                        credits={credits}
                        onUpdateCredits={setCredits}
                        onNavigate={handleNavigate}
                    />
                ) : (
                    <CampaignsPage />
                )}
            </div>
        </div>
    );
}

export default App;
