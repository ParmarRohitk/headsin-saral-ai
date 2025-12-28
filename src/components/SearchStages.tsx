import React from 'react';
import { SearchStage } from '../types/candidate';
import '../styles/SearchStages.css';

interface SearchStagesProps {
    stages: SearchStage[];
}

// NOTE: Display AI processing stages with status indicators
const SearchStages: React.FC<SearchStagesProps> = ({ stages }) => {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <div className="status-icon-check">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                );
            case 'loading':
                return (
                    <div className="status-icon-active">
                        <div className="radio-outer">
                            <div className="radio-inner"></div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="status-icon-pending">
                        <div className="radio-outer-pending"></div>
                    </div>
                );
        }
    };

    return (
        <div className="search-loading-container">
            <div className="central-spinner-wrapper">
                <div className="main-spinner">
                    <div className="ring-spinner"></div>
                </div>
                <h2 className="loading-title">Finding best matches...</h2>
            </div>

            <div className="search-stages-list">
                {stages.map((stage, index) => (
                    <div key={index} className={`stage-card stage-${stage.status}`}>
                        <div className="stage-icon-container">{getStatusIcon(stage.status)}</div>
                        <div className="stage-content">
                            <span className="stage-name">{stage.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchStages;
