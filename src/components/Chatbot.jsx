import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: 'Hello! I am the Election Authority AI. Ask me about the 2026 polls or voting process.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      // Format previous messages for chat history
      const history = messages.slice(1).map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const fetchWithRetry = async (retries = 3) => {
        try {
          const response = await fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMsg, history })
          });
          
          if (!response.ok) {
            if (response.status === 429 && retries > 0) {
              console.warn(`Rate limited. Retrying in 3 seconds... (${retries} retries left)`);
              await new Promise(resolve => setTimeout(resolve, 3000));
              return fetchWithRetry(retries - 1);
            }
            throw new Error(`Server responded with ${response.status}`);
          }
          
          return await response.json();
        } catch (err) {
          if (retries > 0 && err.message.includes('429')) {
             console.warn(`Rate limited. Retrying in 3 seconds... (${retries} retries left)`);
             await new Promise(resolve => setTimeout(resolve, 3000));
             return fetchWithRetry(retries - 1);
          }
          throw err;
        }
      };

      const data = await fetchWithRetry();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { id: Date.now(), role: 'bot', text: data.text }]);
    } catch (error) {
      console.error("Backend Proxy Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        role: 'bot', 
        text: "Sorry, I am currently unable to process your request. " + error.message
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-slate-900/50">
      {/* Messages */}
      <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
          >
            <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center ${msg.role === 'user' ? 'bg-slate-700' : 'bg-brand-500'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-slate-800 text-white rounded-tr-none' 
                : 'bg-brand-500/20 border border-brand-500/30 text-slate-200 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%] self-start">
            <div className="w-8 h-8 rounded-full flex shrink-0 items-center justify-center bg-brand-500">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="p-3 rounded-2xl text-sm bg-brand-500/20 border border-brand-500/30 text-slate-200 rounded-tl-none flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
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
    </div>
  );
}
