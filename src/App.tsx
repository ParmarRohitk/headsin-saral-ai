import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
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
    const [currentPage, setCurrentPage] = useState<'search' | 'campaigns'>('search');
    const [credits, setCredits] = useState<number | null>(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const handleStart = () => {
        setIsAppMode(true);
    };

    if (!isAppMode) {
        return <LandingPage onStartSearch={handleStart} />;
    }

    const showSidebar = true; // Sidebar is persistent in dashboard mode

    return (
        <div className="search-page-wrapper">
            {showSidebar && (
                <Sidebar
                    credits={credits || 0}
                    activePage={currentPage}
                    onNavigate={(page: 'search' | 'campaigns') => setCurrentPage(page)}
                />
            )}

            <div className={`search-page-content ${!showSidebar ? 'full-width' : ''}`}>
                {currentPage === 'search' ? (
                    <SearchPage
                        credits={credits}
                        onUpdateCredits={setCredits}
                        hideSidebar={!showSidebar}
                        onSidebarVisibilityChange={setSidebarVisible}
                    />
                ) : (
                    <CampaignsPage />
                )}
            </div>
        </div>
    );
}

export default App;
