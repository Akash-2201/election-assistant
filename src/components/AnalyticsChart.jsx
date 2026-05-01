import { useState, useEffect } from 'react';
import { BarChart3, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnalyticsChart() {
  const [isChartOpen, setIsChartOpen] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsChartOpen(false);
      }
    };
    
    if (isChartOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isChartOpen]);

  return (
    <>
      <button
        onClick={() => setIsChartOpen(true)}
        className="fixed bottom-24 right-6 md:bottom-28 md:right-8 bg-slate-800 hover:bg-slate-700 text-brand-400 p-4 rounded-full shadow-2xl transition-transform hover:scale-110 z-40 border border-slate-700"
        aria-label="Open Analytics"
      >
        <BarChart3 className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isChartOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsChartOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden cursor-default"
            >
              <button 
                onClick={() => setIsChartOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 p-2 rounded-full transition-colors z-20"
                aria-label="Close Analytics"
              >
                <X className="w-12 h-12" />
              </button>

              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 relative z-10">
                <BarChart3 className="text-brand-500 w-8 h-8" />
                Live Turnout Analytics
              </h2>

              <div className="bg-slate-950/50 rounded-2xl border border-slate-800 p-6 h-[400px] flex items-end justify-between gap-2 md:gap-4 pb-12 relative z-10">
                <div className="absolute left-2 top-6 bottom-12 flex flex-col justify-between text-xs text-slate-500 font-mono">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>

                <div className="absolute inset-x-12 top-6 bottom-12 flex flex-col justify-between pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-t border-slate-800 w-full" />
                  ))}
                </div>

                {[
                  { state: 'WB', value: 48.2, color: 'bg-green-500' },
                  { state: 'AS', value: 79.0, color: 'bg-green-500' },
                  { state: 'TN', value: 72.1, color: 'bg-blue-500' },
                  { state: 'KL', value: 74.0, color: 'bg-blue-500' },
                  { state: 'PY', value: 68.0, color: 'bg-blue-500' },
                ].map((item, i) => (
                  <div key={i} className="relative w-full flex flex-col items-center justify-end h-full z-10 mx-1 md:mx-4 group">
                    <div 
                      className={`w-full max-w-[60px] rounded-t-lg transition-all duration-1000 ${item.color} shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:brightness-125`}
                      style={{ height: `${item.value}%` }}
                    />
                    <div className="absolute -bottom-8 text-sm font-bold text-slate-400">{item.state}</div>
                    <div className="absolute -top-8 text-sm font-mono font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.value}%
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
