import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import './App.css';

function App() {
    const [showSearch, setShowSearch] = useState(false);

    if (showSearch) {
        return <SearchPage />;
    }

    return <LandingPage onStartSearch={() => setShowSearch(true)} />;
}

export default App;
