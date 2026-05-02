import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  UserPlus, Search, Ticket, Fingerprint, Lock, BarChart, 
  ChevronDown, CheckCircle2, AlertTriangle, ShieldCheck,
  Sparkles, X, Send, MessageSquare, Loader2
} from 'lucide-react';

const QUICK_QUESTIONS = {
  reg: ["How do I check my name?", "What is Form 6?", "Deadline for registration?"],
  res: ["Where to find criminal records?", "How to see candidate assets?", "What is a manifesto?"],
  prep: ["How to download voter slip?", "Is digital slip valid?", "What if I don't have a slip?"],
  poll: ["What if I lose my EPIC card?", "Can I bring my phone?", "Valid alternative IDs?"],
  post: ["What is a Strongroom?", "Who guards the EVMs?", "Can candidates watch?"],
  count: ["How are EVMs unsealed?", "What is VVPAT counting?", "When are results final?"]
};

const STAGES = [
  { id: 'reg', icon: UserPlus, color: '#06b6d4' },
  { id: 'res', icon: Search, color: '#3b82f6' },
  { id: 'prep', icon: Ticket, color: '#6366f1' },
  { id: 'poll', icon: Fingerprint, color: '#8b5cf6' },
  { id: 'post', icon: Lock, color: '#a855f7' },
  { id: 'count', icon: BarChart, color: '#d946ef' }
];

function ChatPopover({ context, onClose }) {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', text: `I'm here to help with the ${context} stage. What would you like to know?` }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSend = async (e, text = input) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
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
          context: context,
          lang: i18n.language // AI Language Sync
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Protocol synchronization error. Please retry." }]);
    } finally {
      setLoading(false);
    }
  };

  const activeStage = STAGES.find(s => t(`roadmap.stages.${s.id}.title`) === context || s.id === context);
  const stageId = activeStage?.id;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      onClick={(e) => e.stopPropagation()} 
      className="fixed inset-0 md:absolute md:inset-auto md:top-0 md:right-[-350px] w-full h-full md:w-[320px] md:h-[500px] bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/30 rounded-none md:rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-[100] flex flex-col overflow-hidden"
    >
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block leading-none mb-1">{t('news.satellite_intel')}</span>
            <span className="text-sm font-black text-white uppercase tracking-tighter leading-none">{context} Expert</span>
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-4 rounded-2xl text-xs font-medium leading-relaxed border ${
              m.role === 'user' 
              ? 'bg-purple-600/20 text-purple-200 border-purple-500/30 rounded-tr-none shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
              : 'bg-slate-800/80 text-cyan-400 border-white/5 rounded-tl-none shadow-[0_0_15px_rgba(6,182,212,0.1)]'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 rounded-tl-none flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />
              <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-white/5 bg-slate-950/80">
        {stageId && messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {QUICK_QUESTIONS[stageId].map((q, i) => (
              <button
                key={i}
                onClick={(e) => handleSend(e, q)}
                className="text-[10px] font-bold px-3 py-2 bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-all text-left"
              >
                {q}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={handleSend} className="flex gap-3 relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query regional protocol..."
            className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all shadow-[0_0_15px_rgba(0,0,0,0.3)]"
          />
          <button type="submit" disabled={loading || !input.trim()} className="p-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center min-w-[48px]">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default function ElectionRoadmap() {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState('reg');
  const [activeChat, setActiveChat] = useState(null);
  const [readiness, setReadiness] = useState({ reg: false, id: false, booth: false });

  const isBattleReady = readiness.reg && readiness.id && readiness.booth;

  return (
    <div className="h-full w-full overflow-y-auto custom-scrollbar scroll-smooth pr-4">
      <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic mb-2">{t('roadmap.title')}</h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">{t('roadmap.subtitle')}</p>
      </div>

      <div className="relative space-y-6 mb-20">
        <div className="absolute left-8 top-10 bottom-10 w-1 bg-gradient-to-b from-cyan-500 via-indigo-500 to-purple-500 rounded-full opacity-30" />

        {STAGES.map((stage, i) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative pl-20 transition-all duration-500 ${expanded === stage.id ? 'z-20' : 'z-0'}`}
          >
            <button
              onClick={() => setExpanded(stage.id === expanded ? null : stage.id)}
              className={`absolute left-4 top-6 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border-2 shadow-lg ${
                expanded === stage.id ? 'bg-slate-900 border-white/20 scale-125' : 'bg-slate-950 border-white/5 opacity-50 hover:opacity-100 hover:scale-110'
              }`}
              style={{ borderColor: expanded === stage.id ? stage.color : undefined }}
            >
              <stage.icon className="w-5 h-5" style={{ color: stage.color }} />
            </button>

            <div className="relative">
              <div 
                className={`glass-panel p-8 rounded-[2rem] border transition-all duration-500 cursor-pointer ${
                  expanded === stage.id ? 'bg-slate-900/90 border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.4)] scale-[1.02] border-l-4' : 'bg-slate-900/40 border-white/5 hover:bg-slate-900/60 overflow-hidden'
                }`}
                style={{ borderLeftColor: expanded === stage.id ? stage.color : 'transparent' }}
                onClick={() => setExpanded(stage.id === expanded ? null : stage.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-2xl font-black transition-colors ${expanded === stage.id ? 'text-white' : 'text-slate-400'}`}>
                      {t(`roadmap.stages.${stage.id}.title`)}
                    </h3>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">{t(`roadmap.stages.${stage.id}.desc`)}</p>
                  </div>
                  <motion.div animate={{ rotate: expanded === stage.id ? 180 : 0 }} className="p-3 rounded-xl bg-white/5">
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {expanded === stage.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="mt-8 pt-8 border-t border-white/10"
                    >
                      <p className="text-slate-200 text-lg leading-relaxed font-medium">
                        {t(`roadmap.stages.${stage.id}.details`)}
                      </p>
                      <div className="mt-8 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] bg-cyan-400/10 px-4 py-2 rounded-lg border border-cyan-400/20">
                          <CheckCircle2 className="w-4 h-4" /> {t('roadmap.verified')}
                        </div>
                        
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveChat(activeChat === t(`roadmap.stages.${stage.id}.title`) ? null : t(`roadmap.stages.${stage.id}.title`));
                            }}
                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-black uppercase tracking-tighter text-xs ${
                              activeChat === t(`roadmap.stages.${stage.id}.title`)
                              ? 'bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                              : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            }`}
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>{t('roadmap.ask_expert')}</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {expanded === stage.id && activeChat === t(`roadmap.stages.${stage.id}.title`) && (
                  <ChatPopover context={t(`roadmap.stages.${stage.id}.title`)} onClose={() => setActiveChat(null)} />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel p-10 rounded-[3.5rem] border border-white/10 relative overflow-hidden bg-slate-900/60 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/20 blur-[120px] -z-10" />
        
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <div>
              <h4 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">{t('roadmap.readiness_check')}</h4>
              <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">{t('roadmap.readiness_desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {[
                { id: 'reg', label: t('roadmap.readiness.registered') },
                { id: 'id', label: t('roadmap.readiness.id_ready') },
                { id: 'booth', label: t('roadmap.readiness.booth_located') },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setReadiness(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                  className={`w-full p-5 rounded-[1.5rem] flex items-center justify-between transition-all border-2 ${
                    readiness[item.id] ? 'bg-brand-500/20 border-brand-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/10'
                  }`}
                >
                  <span className="font-black uppercase tracking-tight text-sm">{item.label}</span>
                  {readiness[item.id] ? <CheckCircle2 className="w-6 h-6 text-brand-500" /> : <div className="w-6 h-6 rounded-full border-2 border-slate-800" />}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[400px] flex flex-col items-center justify-center text-center py-16 px-10 bg-slate-950/80 rounded-[3rem] border border-white/10 relative shadow-inner">
            <AnimatePresence mode="wait">
              {isBattleReady ? (
                <motion.div key="ready" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_70px_rgba(34,197,94,0.5)]">
                    <ShieldCheck className="w-16 h-16 text-white" />
                  </div>
                  <div>
                    <h5 className="text-3xl font-black text-green-400 uppercase tracking-tighter mb-2 italic">{t('roadmap.battle_ready')}</h5>
                    <p className="text-slate-400 text-xs font-bold leading-tight uppercase tracking-widest">{t('roadmap.ready_badge')}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="not-ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center mx-auto border-2 border-white/10">
                    <AlertTriangle className="w-16 h-16 text-slate-700" />
                  </div>
                  <div>
                    <h5 className="text-2xl font-black text-slate-500 uppercase tracking-widest mb-2">{t('roadmap.protocol_incomplete')}</h5>
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">{t('roadmap.incomplete_badge')}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
