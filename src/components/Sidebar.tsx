import React from 'react';
import '../styles/Sidebar.css';

interface SidebarProps {
    credits: number;
    activePage: 'search' | 'campaigns';
    onNavigate: (page: 'search' | 'campaigns') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ credits, activePage, onNavigate }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">■</div>
                <span className="logo-text">SARAL</span>
            </div>

            <button className="btn-new-project">
                <span className="plus-icon">+</span> New Project
            </button>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <h4 className="section-title">PROJECTS & HISTORY</h4>
                    <div className="nav-search-box">
                        <span className="search-icon">🔍</span>
                        <input type="text" placeholder="Filter projects..." className="sidebar-search-input" />
                    </div>
                    <ul className="nav-list">
                        <li
                            className={`nav-item ${activePage === 'search' ? 'active' : ''}`}
                            onClick={() => onNavigate('search')}
                        >
                            <span className="item-dot"></span>
                            New AI Search
                            <span className="item-count">50</span>
                        </li>
                        <li className="nav-item">
                            <span className="item-dot gray"></span>
                            Frontend Lead
                            <span className="item-count">12</span>
                        </li>
                        <li className="nav-item">
                            <span className="item-dot gray"></span>
                            Product Designer
                            <span className="item-count">8</span>
                        </li>
                    </ul>
                </div>

                <div className="nav-section">
                    <h4 className="section-title">WORKSPACE</h4>
                    <ul className="nav-list">
                        <li
                            className={`nav-item ${activePage === 'campaigns' ? 'active' : ''}`}
                            onClick={() => onNavigate('campaigns')}
                        >
                            <span className="nav-icon">🧭</span> Sequences
                        </li>
                        <li className="nav-item">
                            <span className="nav-icon">📊</span> Billing
                        </li>
                        <li className="nav-item">
                            <span className="nav-icon">⚙️</span> Settings
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="sidebar-footer">
                <div className="credits-widget">
                    <div className="credits-header">
                        <span>Credits</span>
                        <span>{credits}</span>
                    </div>
                    <div className="credits-bar">
                        <div className="credits-progress" style={{ width: `${(credits / 500) * 100}%` }}></div>
                    </div>
                </div>
                <div className="settings-link">
                    <span className="settings-icon">⚙️</span> Settings
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
