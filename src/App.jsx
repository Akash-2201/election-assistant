import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import VoterIDScanner from './components/VoterIDScanner';
import Chatbot from './components/Chatbot';
import RumorScanner from './components/RumorScanner';
import GlobalMapTab from './components/GlobalMapTab';
import LiveNews from './components/LiveNews';
import EligibilityTree from './components/EligibilityTree';
import ElectionRoadmap from './components/ElectionRoadmap';
import { LayoutDashboard, Newspaper, ScanLine, ShieldCheck, Clock, Settings, Bell, MessageCircle, X, ClipboardCheck, Milestone, Languages, ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('home');
  const [highContrast, setHighContrast] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ id: 'IND', name: 'India', lat: 20.5937, lng: 78.9629, status: 'Ongoing', timeline: 'May 4, 2026 (Counting)', type: 'General Elections' });
  const [currentTime, setCurrentTime] = useState(new Date());

  const currentLanguage = i18n.language || 'en';

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const TABS = [
    { id: 'home', label: t('sidebar.global_pulse'), icon: LayoutDashboard },
    { id: 'news', label: t('sidebar.live_news'), icon: Newspaper },
    { id: 'roadmap', label: t('sidebar.election_process'), icon: Milestone },
    { id: 'eligibility', label: t('sidebar.eligibility_check'), icon: ClipboardCheck },
    { id: 'scan', label: t('sidebar.id_scanner'), icon: ScanLine },
    { id: 'rumor', label: t('sidebar.rumor_check'), icon: ShieldCheck },
  ];

  const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'pt', name: 'Portuguese' }
  ];

  return (
    <div className={`h-screen w-screen flex bg-slate-950 text-slate-50 overflow-hidden font-sans ${highContrast ? 'high-contrast' : ''}`}>
      {/* Sidebar Navigation */}
      <nav className="w-20 md:w-64 bg-slate-900 border-r border-white/5 flex flex-col p-4 z-30 transition-all">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter hidden md:block">VOTERQUEST</span>
        </div>

        <div className="flex-1 space-y-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all relative group ${
                  activeTab === tab.id 
                    ? 'bg-brand-500/10 text-brand-400 font-bold' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-6 h-6 ${activeTab === tab.id ? 'text-brand-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="hidden md:block">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-8 bg-brand-500 rounded-r-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-white/5 space-y-2">
          <button 
            onClick={() => setHighContrast(!highContrast)}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-400 hover:bg-white/5 transition-all"
          >
            <Settings className="w-6 h-6" />
            <span className="hidden md:block">{t('sidebar.accessibility')}</span>
          </button>
          <div className="px-4 py-4 hidden md:block text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            © 2026 VoterQuest Global
          </div>
        </div>
      </nav>

      {/* Main Body */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-slate-950/50 backdrop-blur-md z-20">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold capitalize">{TABS.find(t => t.id === activeTab)?.label || t('header.dashboard')}</h2>
            <div className="hidden lg:flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-white/5">
              <Clock className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-mono text-slate-300 font-bold">{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Language Switcher */}
             <div className="relative">
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-all text-slate-300 group shadow-[0_0_15_rgba(6,182,212,0.05)] hover:shadow-[0_0_15_rgba(6,182,212,0.2)]"
                >
                  <Languages className="w-5 h-5 text-cyan-400" />
                  <span className="hidden lg:block font-bold text-sm uppercase tracking-wider">{currentLanguage.slice(0, 2)}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute top-full mt-2 right-0 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden backdrop-blur-2xl"
                    >
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            i18n.changeLanguage(lang.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full text-left px-5 py-4 text-sm font-black transition-all flex items-center justify-between ${
                            currentLanguage.startsWith(lang.code)
                            ? 'bg-cyan-500/10 text-cyan-400 border-l-4 border-cyan-500' 
                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                          }`}
                        >
                          {lang.name}
                          {currentLanguage.startsWith(lang.code) && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             <button 
               onClick={() => setIsChatOpen(!isChatOpen)}
               className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold border ${
                 isChatOpen 
                 ? 'bg-brand-500 text-white border-brand-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                 : 'bg-slate-900 text-brand-400 border-white/5 hover:bg-slate-800'
               }`}
             >
               <MessageCircle className="w-5 h-5" />
               <span className="hidden sm:block">{t('header.ai_assistant')}</span>
             </button>

             <button className="p-2.5 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10 relative overflow-hidden">
           {/* Abstract Backgrounds */}
           <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
             <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full bg-brand-900/20 blur-[150px]" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[150px]" />
           </div>

           <div className="relative h-full z-10 pr-2">
             <AnimatePresence mode="wait">
               <motion.div
                 key={activeTab}
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -15 }}
                 transition={{ duration: 0.3, ease: "easeOut" }}
                 className="h-full w-full"
               >
                  {activeTab === 'home' && <GlobalMapTab selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />}
                  {activeTab === 'news' && <LiveNews selectedCountry={selectedCountry} />}
                  {activeTab === 'roadmap' && <ElectionRoadmap />}
                 
                  {activeTab === 'eligibility' && (
                    <div className="h-full max-w-4xl mx-auto py-8">
                      <EligibilityTree selectedCountry={selectedCountry} />
                    </div>
                  )}

                  {activeTab === 'scan' && (
                    <div className="h-full max-w-4xl mx-auto py-8">
                      <VoterIDScanner selectedCountry={selectedCountry} />
                    </div>
                  )}

                  {activeTab === 'rumor' && (
                    <div className="h-full max-w-2xl mx-auto py-8">
                      <RumorScanner selectedCountry={selectedCountry} />
                    </div>
                  )}
               </motion.div>
             </AnimatePresence>
           </div>
        </div>

        {/* Floating Chatbot Overlay */}
        <AnimatePresence>
          {isChatOpen && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsChatOpen(false)}
                className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40"
              />
              {/* Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-white/10 z-50 shadow-2xl flex flex-col"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/80 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-500 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{t('header.ai_assistant')}</h3>
                      <span className="text-[10px] text-brand-400 font-bold uppercase tracking-widest">Global Support</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsChatOpen(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <Chatbot />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppContent />
  );
}