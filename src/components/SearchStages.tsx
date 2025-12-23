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
                return '✓';
            case 'loading':
                return '⟳';
            case 'failed':
                return '✗';
            default:
                return '○';
        }
    };

    return (
        <div className="search-stages">
            {stages.map((stage, index) => (
                <div key={index} className={`stage stage-${stage.status}`}>
                    <div className="stage-icon">{getStatusIcon(stage.status)}</div>
                    <div className="stage-content">
                        <div className="stage-name">{stage.name}</div>
                        {stage.status === 'loading' && <div className="stage-loader"></div>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SearchStages;
