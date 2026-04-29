import { useState } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MYTHS_DB = [
  {
    keywords: ['secret', 'know who i voted', 'privacy'],
    answer: "Your vote is absolutely secret. The EVM does not record your identity alongside your vote, and the VVPAT slip is stored securely in a sealed box."
  },
  {
    keywords: ['vvpat', 'work', 'slip', 'paper'],
    answer: "Yes, the VVPAT (Voter Verifiable Paper Audit Trail) works perfectly. When you press the button, a slip with your candidate's symbol is printed and visible behind a glass screen for 7 seconds before dropping into a sealed drop box."
  },
  {
    keywords: ['nri', 'abroad', 'overseas'],
    answer: "NRIs can vote, but currently, they must be physically present at their designated polling booth in India. Postal ballots or online voting are not yet available for general NRI voters."
  },
  {
    keywords: ['evm', 'hack', 'tamper', 'safe'],
    answer: "EVMs are standalone machines with no internet or wireless connectivity, making them immune to remote hacking. They also undergo rigorous multi-level checks in the presence of political party representatives."
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: 'Hello! I am the Election Myth-Buster AI. Ask me questions like "Is my vote secret?" or "Does the VVPAT really work?"' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userMsg }]);
    setInput('');

    // Process answer
    setTimeout(() => {
      let response = "That's a great question. While I don't have a specific answer for that in my database right now, you can always trust the official Election Commission guidelines for accurate information.";
      
      for (const entry of MYTHS_DB) {
        if (entry.keywords.some(kw => userMsg.toLowerCase().includes(kw))) {
          response = entry.answer;
          break;
        }
      }

      setMessages(prev => [...prev, { id: Date.now(), role: 'bot', text: response }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-brand-600 hover:bg-brand-500 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 z-40 flex items-center justify-center border border-brand-400/30"
        aria-label="Open Chatbot"
      >
        <MessageSquare className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-500"></span>
        </span>
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 md:right-8 w-[calc(100vw-32px)] md:w-[400px] h-[500px] glass-panel rounded-2xl flex flex-col overflow-hidden z-50 border-brand-500/30 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.5)]"
          >
            {/* Header */}
            <div className="bg-brand-600/90 backdrop-blur px-5 py-4 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight">Myth-Buster AI</h3>
                  <span className="text-[10px] text-brand-100 uppercase tracking-widest">Powered by Gemini</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-slate-950/50">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center ${msg.role === 'user' ? 'bg-slate-700' : 'bg-brand-500'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-slate-800 text-white rounded-tr-none' 
                      : 'bg-brand-500/20 border border-brand-500/30 text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-4 bg-slate-900 border-t border-slate-700">
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-slate-400"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 top-2 p-1.5 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 disabled:hover:bg-brand-500 text-white rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
