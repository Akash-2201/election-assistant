import { useState, useEffect, useCallback } from 'react';
import { Newspaper, ExternalLink, TrendingUp, Radio, Loader2, Tv } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const NEWS_REGISTRY = {
  "India": [
    { name: "WION Live", url: "https://www.youtube.com/@WION", logo: "radio" },
    { name: "NDTV 24x7", url: "https://www.youtube.com/@NDTV", logo: "tv" },
    { name: "Republic World", url: "https://www.youtube.com/@RepublicWorldIndia", logo: "tv" }
  ],
  "Brazil": [
    { name: "Globo News", url: "https://www.youtube.com/@globonews", logo: "radio" },
    { name: "CNN Brasil", url: "https://www.youtube.com/@CNNBrasil", logo: "tv" },
    { name: "Record News", url: "https://www.youtube.com/@recordnews", logo: "tv" }
  ],
  "United States": [
    { name: "ABC News", url: "https://www.youtube.com/@ABCNews", logo: "tv" },
    { name: "CNN Live", url: "https://www.youtube.com/@CNN", logo: "radio" },
    { name: "NBC News", url: "https://www.youtube.com/@NBCNews", logo: "tv" }
  ],
  "Global": [
    { name: "Al Jazeera English", url: "https://www.youtube.com/@AlJazeeraEnglish", logo: "radio" },
    { name: "Reuters", url: "https://www.youtube.com/@Reuters", logo: "tv" }
  ]
};

export default function LiveNews({ selectedCountry }) {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const countryName = selectedCountry?.name || "Global";
  const channelList = NEWS_REGISTRY[countryName] || NEWS_REGISTRY.Global;

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/regional-metrics/${encodeURIComponent(countryName)}?lang=${i18n.language}`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Fetch failed, using fallback:", err);
    } finally {
      setLoading(false);
    }
  }, [countryName, i18n.language]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <div className="h-full flex flex-col gap-8 pb-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950 rounded-3xl p-6 md:p-10 border border-white/5 relative overflow-y-auto custom-scrollbar scroll-smooth">
      
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center space-y-6"
          >
            <div className="relative">
              <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
              <div className="absolute inset-0 blur-xl bg-cyan-400/20 animate-pulse rounded-full" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black text-cyan-400 tracking-tighter uppercase italic">{t('news.loading')}</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">{t('news.syncing', { country: countryName })}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
          >
            {/* AI Summary Box */}
            <div className="p-8 rounded-2xl bg-slate-900/60 backdrop-blur-xl border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-start gap-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Newspaper className="w-24 h-24 text-cyan-500" />
               </div>
               <div className="relative z-10">
                  <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-3">{t('news.voterquest_insight')}</h4>
                  <p className="text-2xl text-slate-100 font-bold leading-relaxed max-w-4xl">
                    {data?.summary}
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Radar Chart Section */}
              <div className="h-80 w-full glass-panel p-8 rounded-3xl border border-white/5 bg-slate-900/40">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">{t('news.sentiment_matrix')}</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data?.metrics || []}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                    <Radar
                      name="Pulse"
                      dataKey="value"
                      stroke="#a855f7"
                      fill="#a855f7"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* News Channels Grid */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] ml-1">{t('news.broadcasters')}</h3>
                <div className="grid grid-cols-1 gap-3">
                  {channelList.map((channel, i) => (
                    <motion.a
                      key={`${channel.name}-${i}`}
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group glass-panel p-5 rounded-2xl border border-white/5 hover:border-cyan-500/50 transition-all flex items-center justify-between bg-slate-900/60 hover:bg-slate-800/80"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
                          {channel.logo === 'radio' ? (
                            <Radio className="w-6 h-6 text-slate-500 group-hover:text-white" />
                          ) : (
                            <Tv className="w-6 h-6 text-slate-500 group-hover:text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{channel.name}</div>
                          <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">YouTube Live Stream</div>
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Title */}
            <div className="pt-6 border-t border-white/5">
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 tracking-tighter uppercase italic flex items-center gap-4">
                <TrendingUp className="w-10 h-10 text-cyan-400" />
                {countryName} {t('news.subtitle')}
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
