import React, { useState } from 'react';
import '../styles/SearchBar.css';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading?: boolean;
}

// NOTE: Search bar matching SARAL AI design reference
const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading = false }) => {
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'manual' | 'jd'>('manual');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    const popularSearches = [
        'Senior React Native Engineer in London with Fintech experience',
        'Product Marketing Manager for B2B SaaS in New York',
        'DevOps Lead expert in Kubernetes and AWS',
        'Head of Sales for Early Stage Startup (Remote)',
    ];

    return (
        <>
            <div className="search-bar-container">
                <div className="tabs-header">
                    <div className="tabs-pill">
                        <button
                            className={`search-tab ${activeTab === 'manual' ? 'active' : ''}`}
                            onClick={() => setActiveTab('manual')}
                        >
                            <span className="tab-icon">🔍</span>
                            Manual Search
                        </button>
                        <button
                            className={`search-tab ${activeTab === 'jd' ? 'active' : ''}`}
                            onClick={() => setActiveTab('jd')}
                        >
                            <span className="tab-icon">📄</span>
                            Search by JD
                        </button>
                    </div>
                </div>

                <div className="search-content">
                    {activeTab === 'manual' ? (
                        <form onSubmit={handleSubmit} className="search-form">
                            <textarea
                                className="search-textarea"
                                placeholder="Describe the perfect candidate... (e.g. Senior Product Designer in SF, ex-Stripe, familiar with design systems)"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                disabled={isLoading}
                                rows={3}
                            />
                            <button
                                type="submit"
                                className="btn-search"
                                disabled={isLoading || !query.trim()}
                            >
                                {isLoading ? 'Searching...' : 'Start Search'}
                                <span className="btn-icon">✨</span>
                            </button>
                        </form>
                    ) : (
                        <div className="jd-upload-area">
                            <div className="upload-icon">📤</div>
                            <h3>Drag & Drop JD here</h3>
                            <p className="upload-subtitle">PDF, DOCX, TXT supported</p>
                            <div className="upload-actions">
                                <button className="btn-browse">Browse Files</button>
                                <button className="btn-parse" disabled>
                                    Parse & Find Matches →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {activeTab === 'manual' && !isLoading && (
                <div className="popular-searches-section">
                    <h4 className="popular-title">POPULAR SEARCHES</h4>
                    <div className="popular-grid">
                        {popularSearches.map((search, index) => (
                            <button
                                key={index}
                                className="popular-chip"
                                onClick={() => setQuery(search)}
                                disabled={isLoading}
                            >
                                {search}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default SearchBar;
