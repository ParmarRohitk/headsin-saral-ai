import React from 'react';
import '../styles/LandingPage.css';

interface LandingPageProps {
    onStartSearch: () => void;
}

// NOTE: Landing page with browser mockup matching design reference
const LandingPage: React.FC<LandingPageProps> = ({ onStartSearch }) => {
    return (
        <div className="landing-page">
            <header className="landing-header">
                <div className="header-container">
                    <div className="logo">
                        <span className="logo-icon">🟣</span>
                        <span className="logo-text">SARAL AI</span>
                    </div>
                    <nav className="nav-links">
                        <a href="#product">Product</a>
                        <a href="#pricing">Pricing</a>
                        <a href="#login">Log in</a>
                        <button className="btn-header" onClick={onStartSearch}>Start Free</button>
                    </nav>
                </div>
            </header>

            <main className="landing-main">
                <div className="announcement">
                    <span className="announcement-dot">●</span>
                    GitHub Deep Search now available
                </div>

                <h1 className="main-title">
                    <span className="title-dark">Hire smarter, not harder.</span>
                    <br />
                    <span className="title-gray">AI finds the right talent for you.</span>
                </h1>

                <p className="main-description">
                    Automate candidate sourcing across LinkedIn, GitHub, and<br />
                    Behance. No more manual searching—just results.
                </p>

                <div className="cta-buttons">
                    <button className="btn-primary" onClick={onStartSearch}>
                        Start Finding Candidates →
                    </button>
                    <button className="btn-secondary">Book a Demo</button>
                </div>

                <div className="browser-mockup">
                    <div className="browser-chrome">
                        <div className="chrome-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <div className="browser-body">
                        <div className="mockup-search-bar">
                            <div className="mockup-search-icon">🔍</div>
                            <div className="mockup-search-line"></div>
                        </div>
                        <div className="mockup-cards">
                            <div className="mockup-card"></div>
                            <div className="mockup-card"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
