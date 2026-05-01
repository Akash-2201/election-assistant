import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { MapPin, Calendar, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { differenceInDays, isSameDay, startOfDay } from 'date-fns';

const COUNTING_DATE = new Date('2026-05-04T00:00:00');

// Strictly the 5 requested states
const ALL_STATES = ['West Bengal', 'Assam', 'Tamil Nadu', 'Kerala', 'Puducherry'];

const STATES_DATA = {
  'West Bengal': {
    pollingDate: new Date('2026-04-29T00:00:00'),
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/30'
  },
  'Assam': {
    pollingDate: new Date('2026-04-29T00:00:00'),
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/30'
  },
  'Tamil Nadu': {
    pollingDate: new Date('2026-04-23T00:00:00'),
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30'
  },
  'Kerala': {
    pollingDate: new Date('2026-04-09T00:00:00'),
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30'
  },
  'Puducherry': {
    pollingDate: new Date('2026-04-09T00:00:00'),
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30'
  }
};

export default function StateHub({ selectedState, setSelectedState }) {
  const { t } = useLanguage();
  const [liveTurnout, setLiveTurnout] = useState(42.5);
  
  const today = startOfDay(new Date());

  const stateData = STATES_DATA[selectedState];
  const isPollingToday = isSameDay(today, stateData.pollingDate);
  const daysUntilCounting = differenceInDays(COUNTING_DATE, today);

  const statusBadge = (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/40 ${stateData.color}`}>
      {isPollingToday ? 'Polling Concluded - Awaiting Counting' : `Polling Completed - Counting in ${daysUntilCounting} Days`}
    </span>
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTurnout(prev => {
        if (prev >= 85.0) return prev;
        return parseFloat((prev + 0.1).toFixed(1));
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-8">
      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/20 blur-[100px] rounded-full pointer-events-none" />
        
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
          <MapPin className="text-brand-500 w-8 h-8" />
          Choose Your State
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              Select a state to view specific dates and instructions:
            </label>
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full appearance-none bg-slate-900 border border-slate-700 rounded-xl py-4 px-4 pr-10 text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
              >
                {ALL_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <AnimatePresence>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedState}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`rounded-2xl p-6 border backdrop-blur-md flex flex-col justify-center ${stateData.bg}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{selectedState}</h3>
                  {statusBadge}
                </div>
                <Calendar className={`w-6 h-6 ${stateData.color} opacity-80`} />
              </div>
              
              <div className="space-y-3 mt-2">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span className="text-slate-300">Polling: <strong className="text-white">{stateData.pollingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span className="text-slate-300">Counting: <strong className="text-white">May 4, 2026</strong></span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
