import { Newspaper, ExternalLink, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const NEWS_ITEMS = [
  {
    id: 1,
    title: "Global Election Turnout Hits Record High in 2026",
    source: "Election Watch",
    time: "2 hours ago",
    category: "Statistics",
    image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=400&q=80"
  },
  {
    id: 2,
    title: "New AI Security Protocols Implemented for Virtual Balloting",
    source: "Tech Democracy",
    time: "5 hours ago",
    category: "Security",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80"
  },
  {
    id: 3,
    title: "European Union Proposes Unified Digital Voting Standard",
    source: "EuroNews",
    time: "Yesterday",
    category: "Policy",
    image: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=400&q=80"
  },
  {
    id: 4,
    title: "VoterQuest AI Fact-Checker Debunks Viral Misinformation",
    source: "Official Press",
    time: "3 days ago",
    category: "Fact Check",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80"
  },
];

export default function NewsTab() {
  return (
    <div className="h-full flex flex-col gap-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-brand-500" />
            Live Election News
          </h2>
          <p className="text-slate-400">Real-time updates from across the globe.</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">
            <TrendingUp className="w-3 h-3" /> 24 Live Feeds
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 overflow-y-auto pr-2 custom-scrollbar">
        {NEWS_ITEMS.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative glass-panel rounded-3xl overflow-hidden hover:border-brand-500/50 transition-all border border-white/5 shadow-xl"
          >
            <div className="aspect-video overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-100" 
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-lg bg-brand-500/20 text-brand-400 text-[10px] font-bold uppercase tracking-wider border border-brand-500/30">
                  {item.category}
                </span>
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </div>
              </div>
              <h3 className="text-lg font-bold mb-4 line-clamp-2 text-slate-100 group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="text-sm font-medium text-slate-400">{item.source}</div>
                <button className="p-2 bg-slate-800 hover:bg-brand-500 text-slate-400 hover:text-white rounded-xl transition-all">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
