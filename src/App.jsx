import { useState, useEffect } from 'react';
import Header from './components/Header';
import StateHub from './components/StateHub';
import Roadmap from './components/Roadmap';
import DocumentVerifier from './components/DocumentVerifier';
import Chatbot from './components/Chatbot';

function App() {
  const [highContrast, setHighContrast] = useState(false);

  // Apply high contrast class to body for global scope
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  return (
    <div className={`min-h-screen relative transition-colors duration-300 ${highContrast ? 'high-contrast' : ''}`}>
      {/* Abstract Background Elements (Hidden in High Contrast) */}
      {!highContrast && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-900/40 blur-[150px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/30 blur-[150px]" />
          <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-900/20 blur-[120px]" />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        <Header highContrast={highContrast} setHighContrast={setHighContrast} />
        
        <main className="container mx-auto px-4 md:px-8 py-8 space-y-16 md:space-y-24 max-w-6xl">
          {/* Hero Section */}
          <section className="text-center pt-8 md:pt-16 pb-8">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 high-contrast:text-yellow-400">
              Your Voice.<br />Your Power.
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The 2026 General Elections are here. Stay informed, verify your documents, and follow our interactive roadmap to ensure your vote counts.
            </p>
          </section>

          <StateHub />
          <Roadmap />
          <DocumentVerifier />
        </main>
        
        <Chatbot />
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20 py-8 text-center text-slate-500 text-sm">
        <p>Built for the 2026 Election Hackathon • Empowering every voter</p>
      </footer>
    </div>
  );
}

export default App;
