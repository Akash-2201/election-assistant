import { useState } from 'react';
import { PlayCircle, Radio, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CHANNELS = [
  { 
    name: 'NDTV 24x7 (English)', 
    url: 'https://www.youtube.com/@ndtv/live', 
    img: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&q=80' 
  },
  { 
    name: 'ABP Ananda (Bengali)', 
    url: 'https://www.youtube.com/@abpanandatv/live', 
    img: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=400&q=80' 
  }
];

export default function NewsAggregator() {
  return (
    <section className="py-8 relative">
      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden border-t-2 border-t-red-500/50">
        <div className="flex items-center gap-3 mb-8">
          <Radio className="w-8 h-8 text-red-500 animate-pulse" />
          <h2 className="text-3xl font-bold">Live News Theatre</h2>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {CHANNELS.map((channel) => (
            <div
              key={channel.name}
              onClick={() => window.open(channel.url, '_blank')}
              className="group relative rounded-2xl overflow-hidden border border-slate-700/50 cursor-pointer hover:border-red-500 transition-colors shadow-lg"
            >
              <div className="aspect-video relative">
                <img src={channel.img} alt={channel.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-600/80 backdrop-blur flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-8 h-8 ml-1" />
                  </div>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-600 px-2.5 py-1 rounded-md text-xs font-bold text-white uppercase tracking-wider shadow-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </div>
              </div>
              
              <div className="p-4 bg-slate-900 border-t border-red-500/30">
                <h3 className="font-bold text-white">{channel.name}</h3>
                <p className="text-sm text-slate-400">Click to watch</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
