import { useState } from 'react';
import { MapPin, Calendar, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATES_DATA = {
  'West Bengal': {
    status: 'Phase-II Today',
    date: 'April 29, 2026',
    counting: 'May 4, 2026',
    description: 'Polling is actively ongoing for Phase-II.',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/30'
  },
  'Tamil Nadu': {
    status: 'Polling Done',
    date: 'April 19, 2026',
    counting: 'May 4, 2026',
    description: 'Voting has concluded. Awaiting counting day.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30'
  },
  'Kerala': {
    status: 'Polling Done',
    date: 'April 26, 2026',
    counting: 'May 4, 2026',
    description: 'Voting has concluded. Awaiting counting day.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30'
  },
  'Assam': {
    status: 'Polling Done',
    date: 'April 19, 2026',
    counting: 'May 4, 2026',
    description: 'Voting has concluded. Awaiting counting day.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30'
  },
  'Others': {
    status: 'General Registration',
    date: 'Upcoming',
    counting: 'May 4, 2026',
    description: 'Please check your local schedule and ensure your registration is active.',
    color: 'text-brand-400',
    bg: 'bg-brand-500/10 border-brand-500/30'
  }
};

const ALL_STATES = ['West Bengal', 'Tamil Nadu', 'Kerala', 'Assam', 'Others'];

export default function StateHub() {
  const [selectedState, setSelectedState] = useState('');

  const stateInfo = STATES_DATA[selectedState] || STATES_DATA['Others'];

  return (
    <section className="py-8">
      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden">
        {/* Decorative background glow */}
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
                <option value="" disabled>Select a state...</option>
                {ALL_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {selectedState && (
              <motion.div 
                key={selectedState}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`rounded-2xl p-6 border backdrop-blur-md flex flex-col justify-center ${stateInfo.bg}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{selectedState}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/40 ${stateInfo.color}`}>
                      {stateInfo.status}
                    </span>
                  </div>
                  <Calendar className={`w-6 h-6 ${stateInfo.color} opacity-80`} />
                </div>
                
                <div className="space-y-3 mt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span className="text-slate-300">Polling: <strong className="text-white">{stateInfo.date}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span className="text-slate-300">Counting: <strong className="text-white">{stateInfo.counting}</strong></span>
                  </div>
                  <div className="pt-3 border-t border-white/10 mt-3 flex gap-2 text-sm text-slate-300">
                    <Info className="w-5 h-5 shrink-0 text-slate-400" />
                    <p>{stateInfo.description}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
