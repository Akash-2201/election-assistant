import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle2, ChevronRight, Clipboard, UserCheck, 
  ShieldCheck, AlertTriangle, MessageSquare, Sparkles, X, Send, Loader2
} from 'lucide-react';

const COUNTRY_LAWS = {
  "India": "Representation of the People Act, 1951",
  "United States": "U.S. Voting Rights Act",
  "Brazil": "Código Eleitoral Brasileiro",
  "Global": "International Democratic Standards"
};

function ChatPopover({ country, onClose }) {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', text: `I am your Legal AI Expert for ${country}. How can I help you with voting eligibility in 2026?` }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (e, text = input) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!text.trim() || loading) return;
    
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          context: `Eligibility in ${country}`,
          lang: i18n.language
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Legal protocol sync error. Please retry." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-0 right-0 w-full sm:w-[400px] h-[500px] bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-50 flex flex-col overflow-hidden"
    >
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block leading-none mb-1">Legal Intelligence</span>
            <span className="text-sm font-black text-white uppercase tracking-tighter leading-none">{country} Expert</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed border ${
              m.role === 'user' 
              ? 'bg-purple-600/20 text-purple-200 border-purple-500/30 rounded-tr-none' 
              : 'bg-slate-800/80 text-cyan-400 border-white/5 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />
              <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Consulting Statutes...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-6 border-t border-white/5 bg-slate-950/80 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a legal question..."
          className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
        <button type="submit" disabled={loading || !input.trim()} className="p-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl transition-all disabled:opacity-50">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </motion.div>
  );
}

export default function EligibilityTree({ selectedCountry }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const countryName = selectedCountry?.name || "Global";
  const lawName = COUNTRY_LAWS[countryName] || COUNTRY_LAWS.Global;

  const QUESTIONS = [
    {
      id: 'citizenship',
      text: t('eligibility.questions.citizenship', { country: countryName }),
      description: t('eligibility.questions.citizenship_desc', { country: countryName, law: lawName })
    },
    {
      id: 'age',
      text: t('eligibility.questions.age', { country: countryName }),
      description: t('eligibility.questions.age_desc', { country: countryName })
    },
    {
      id: 'roll',
      text: t('eligibility.questions.roll', { country: countryName }),
      description: t('eligibility.questions.roll_desc', { country: countryName })
    }
  ];

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setIsFinished(true);
    }
  };

  const reset = () => {
    setStep(0);
    setIsFinished(false);
    setShowChat(false);
  };

  if (!selectedCountry) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl glass-panel rounded-3xl p-12 text-center border border-white/5">
          <AlertTriangle className="w-16 h-16 text-slate-700 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-500 uppercase tracking-widest mb-4">No Country Selected</h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            {t('eligibility.no_country')}
          </p>
        </div>
      </div>
    );
  }

  const progress = ((step + (isFinished ? 1 : 0)) / QUESTIONS.length) * 100;

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 relative">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-8 md:p-12 border border-brand-500/20 shadow-2xl relative">
        {!isFinished ? (
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-500/20 rounded-lg">
                  <Clipboard className="w-6 h-6 text-brand-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider">{t('eligibility.title')}</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">{t('eligibility.subtitle', { current: step + 1, total: QUESTIONS.length })}</p>
                </div>
              </div>
            </div>

            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-brand-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 min-h-[160px]"
              >
                <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">
                  {QUESTIONS[step].text}
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {QUESTIONS[step].description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleNext}
                className="flex-1 bg-brand-500 hover:bg-brand-400 text-white py-5 rounded-2xl font-black text-xl transition-all shadow-[0_10px_30px_-10px_rgba(99,102,241,0.5)] flex items-center justify-center gap-3 group"
              >
                {t('eligibility.yes')} <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => alert("Requirement not met. You may not be eligible to vote yet.")}
                className="px-10 bg-slate-900 border border-slate-700 text-slate-400 hover:text-white rounded-2xl font-bold transition-all"
              >
                {t('eligibility.no')}
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <div className="w-24 h-24 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(99,102,241,0.6)]">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase">{t('eligibility.success_title')}</h2>
            <p className="text-slate-400 text-lg mb-12 max-w-md mx-auto">
              {t('eligibility.success_desc', { country: countryName })}
            </p>
            
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setShowChat(true)}
                className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 py-4 rounded-2xl font-black border border-cyan-500/30 flex items-center justify-center gap-3 transition-all"
              >
                <Sparkles className="w-5 h-5" /> {t('eligibility.ask_ai')}
              </button>
              <button
                onClick={reset}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl font-bold transition-all border border-white/10"
              >
                {t('eligibility.reset')}
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {showChat && (
            <ChatPopover 
              country={countryName} 
              onClose={() => setShowChat(false)} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
