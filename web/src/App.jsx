import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Documentation from './components/Documentation';

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'dashboard' | 'documentation'

  return (
    <>
      {view === 'landing' && (
        <LandingPage
          onGetStarted={() => setView('dashboard')}
          onOpenDocs={() => setView('documentation')}
        />
      )}
      {view === 'dashboard' && <Dashboard onBack={() => setView('landing')} />}
      {view === 'documentation' && <Documentation onBack={() => setView('landing')} />}
    </>
  );
}

export default App;
