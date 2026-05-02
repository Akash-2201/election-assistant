import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadCloud, ScanLine, X, CheckCircle, Loader2, MapPin, User, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoterIDScanner({ selectedCountry }) {
  const { t, i18n } = useTranslation();
  const [stage, setStage] = useState('idle'); // idle, scanning, complete
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = async () => {
    if (!previewUrl) return;

    setStage('scanning');
    setError(null);

    try {
      const base64Data = previewUrl.split(',')[1];
      const mimeType = imageFile.type;

      const response = await fetch('http://localhost:3001/api/scan-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          base64Data, 
          mimeType,
          lang: i18n.language // AI Language Sync
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze ID. Please ensure the image is clear.');
      }

      const data = await response.json();
      setResult(data);
      setStage('complete');
    } catch (err) {
      console.error(err);
      setError(err.message);
      setStage('idle');
    }
  };

  const reset = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setStage('idle');
  };

  return (
    <section className="py-12">
      <div className="glass-panel rounded-3xl p-6 md:p-10 relative overflow-hidden border border-brand-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
        <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest mb-4 border border-brand-500/30">
            <ScanLine className="w-4 h-4" /> Secure ID OCR
          </div>
          <h2 className="text-4xl font-bold mb-4">{t('scanner.title')}</h2>
          <p className="text-slate-400 text-lg">
            {t('scanner.subtitle')}
          </p>
        </div>

        <div className="max-w-xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            {stage === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {!previewUrl ? (
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div className="border-2 border-dashed border-slate-700 rounded-3xl p-16 text-center group-hover:border-brand-500 group-hover:bg-brand-500/5 transition-all bg-slate-900/50">
                      <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-brand-500/20 transition-all">
                        <UploadCloud className="w-10 h-10 text-brand-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{t('scanner.scan_btn')}</h3>
                      <p className="text-slate-500">Supports PNG, JPG, or PDF scans</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative rounded-2xl overflow-hidden border border-brand-500/30 shadow-2xl bg-slate-900">
                      <img src={previewUrl} alt="ID Preview" className="w-full h-auto max-h-64 object-contain opacity-80" />
                      <button 
                        onClick={() => { setPreviewUrl(null); setImageFile(null); }}
                        className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3">
                        <X className="w-5 h-5 shrink-0" /> {error}
                      </div>
                    )}

                    <button
                      onClick={handleVerify}
                      className="w-full bg-brand-500 hover:bg-brand-400 text-white py-5 rounded-2xl font-black text-xl transition-all shadow-[0_10px_30px_-10px_rgba(99,102,241,0.5)] active:scale-95"
                    >
                      {t('scanner.scan_btn')}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {stage === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-900/50 rounded-3xl p-16 text-center border border-brand-500/30 relative overflow-hidden backdrop-blur-xl shadow-[0_0_50px_rgba(99,102,241,0.2)]"
              >
                <div className="relative z-10 space-y-6">
                  <Loader2 className="w-20 h-20 text-brand-500 mx-auto animate-spin" />
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{t('scanner.processing')}</h3>
                    <p className="text-slate-400 text-lg animate-pulse">Calculating local precinct and eligibility...</p>
                  </div>
                </div>
                <motion.div 
                  className="absolute top-0 left-0 w-full h-1 bg-brand-400 shadow-[0_0_20px_rgba(99,102,241,1)] z-20"
                  animate={{ y: [0, 300, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}

            {stage === 'complete' && result && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Voter Profile Card */}
                <div className="glass-panel rounded-3xl p-8 border-2 border-brand-500/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    {result.isEligible ? (
                      <span className="px-4 py-1.5 rounded-full bg-green-500 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-pulse">
                        {t('scanner.eligible')}
                      </span>
                    ) : (
                      <span className="px-4 py-1.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-widest">
                        {t('scanner.ineligible')}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-6 mb-8 items-center">
                    <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center shadow-inner">
                      <User className="w-10 h-10 text-brand-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white leading-tight">{result.name}</h3>
                      <div className="flex items-center gap-3 text-slate-400 text-sm mt-1">
                        <span className="font-bold text-brand-400">{t('scanner.details.age')}: {result.age}</span>
                        <span>•</span>
                        <span>{result.dob}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-widest">{t('scanner.details.address')}</div>
                        <div className="text-sm text-slate-200 line-clamp-2">{result.address}</div>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-widest">City/District</div>
                        <div className="text-sm text-slate-200 font-bold">{result.city}</div>
                      </div>
                    </div>

                    {result.isEligible && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-black text-brand-400 uppercase tracking-[0.2em] mb-2">
                          <MapPin className="w-4 h-4" /> Recommended Polling Stations
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {result.pollingStations.map((station, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-white/5 hover:border-brand-500/30 transition-all group">
                              <span className="text-slate-200 font-medium">{station}</span>
                              <div className="p-2 bg-brand-500/10 rounded-lg group-hover:bg-brand-500/20 transition-all">
                                <MapPin className="w-4 h-4 text-brand-500" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={reset}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl font-bold transition-all border border-white/5"
                >
                  <X className="w-5 h-5" /> {t('roadmap.readiness_check')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
