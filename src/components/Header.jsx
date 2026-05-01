import { useState, useEffect } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { CheckCircle, ToggleLeft, ToggleRight, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Header({ highContrast, setHighContrast }) {
  const { language, setLanguage, languages, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const targetDate = new Date('2026-05-04T00:00:00');
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      setTimeLeft({
        days: differenceInDays(targetDate, now),
        hours: differenceInHours(targetDate, now) % 24,
        minutes: differenceInMinutes(targetDate, now) % 60,
        seconds: differenceInSeconds(targetDate, now) % 60
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="glass-panel sticky top-0 z-[100] px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b">
      <div className="flex items-center gap-3">
        <div className="bg-brand-500 p-2 rounded-xl">
          <CheckCircle className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight m-0 leading-tight">Election Assistant</h1>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Countdown to Counting Day</p>
            <div className="font-mono font-bold text-lg text-brand-400 flex gap-2">
              <span>{timeLeft.days}d</span>
              <span>{timeLeft.hours}h</span>
              <span>{timeLeft.minutes}m</span>
              <span className="w-6 inline-block">{timeLeft.seconds}s</span>
            </div>
          </div>
        </div>

        <div className="relative z-[100]">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg glass-card hover:bg-brand-600 transition-colors border border-brand-500/30 text-white shadow-lg"
            aria-label="Toggle Language"
          >
            <Globe className="w-5 h-5 text-brand-400" />
            <span className="text-sm font-bold uppercase tracking-wider">{language}</span>
          </button>
          
          {showLangMenu && (
            <div className="absolute top-12 right-0 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden w-40 animate-in fade-in slide-in-from-top-2">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setShowLangMenu(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-brand-500 hover:text-white transition-colors ${language === lang ? 'bg-brand-500/20 text-brand-400 font-bold' : 'text-slate-300'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative z-[100]">
          <button 
            onClick={() => setHighContrast(!highContrast)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg glass-card hover:bg-slate-800 transition-colors shadow-lg"
            aria-label="Toggle High Contrast Mode"
          >
            {highContrast ? <ToggleRight className="text-yellow-400 w-5 h-5" /> : <ToggleLeft className="text-slate-400 w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
