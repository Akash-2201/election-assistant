import { useState } from 'react';
import { UploadCloud, ScanLine, X, MapPin, Search, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoterIDScanner({ selectedState }) {
  const [stage, setStage] = useState('idle'); // idle, scanning, complete
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) processFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) processFile(selectedFile);
  };

  const processFile = async (file) => {
    setFile(file);
    setStage('scanning');

    try {
      // Convert file to base64
      const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
      });
      const base64Data = await base64EncodedDataPromise;

      const fetchWithRetry = async (retries = 3) => {
        try {
          const response = await fetch('http://localhost:3001/api/scan-id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64Data, mimeType: file.type })
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

      const resultApi = await fetchWithRetry();
      
      if (resultApi.error) {
        throw new Error(resultApi.error);
      }

      const text = resultApi.text;
      // Clean up potential markdown formatting from the response
      const cleanJsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const extractedData = JSON.parse(cleanJsonStr);
      
      const extractedState = extractedData.state || "Unknown";
      const name = extractedData.name || "Unknown Voter";

      let statusMsg = "";
      let hasError = false;

      // Make matching case-insensitive and check for partial matches (e.g. "West Bengal" vs "Bengal")
      const isMatch = extractedState.toLowerCase().includes(selectedState.toLowerCase()) || 
                      selectedState.toLowerCase().includes(extractedState.toLowerCase());

      if (!isMatch) {
        statusMsg = `Eligibility Error: Your ID is from ${extractedState}, but you are viewing ${selectedState} polls. You cannot vote here.`;
        hasError = true;
      } else {
        statusMsg = `Verified! Welcome ${name}. Your booth: Primary School, Sector 5.`;
      }

      setResult({
        name,
        extractedState,
        statusMsg,
        hasError,
        votedStatus: "Not Voted",
        booth: "Primary School, Sector 5",
        distance: "1.2km away"
      });
      
      setStage('complete');
    } catch (error) {
      console.error("Backend Proxy Error:", error);
      setResult({
        name: "Error",
        extractedState: "Error",
        statusMsg: "Failed to process image via Vertex AI Proxy. Please try again or use a clearer photo. " + error.message,
        hasError: true,
        votedStatus: "N/A",
        booth: "N/A",
        distance: "N/A"
      });
      setStage('complete');
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setStage('idle');
  };

  return (
    <section className="py-12">
      <div className="glass-panel rounded-3xl p-6 md:p-10 relative overflow-hidden border border-brand-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
        <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest mb-4 border border-brand-500/30">
            <ScanLine className="w-4 h-4" /> Smart ID Verifier
          </div>
          <h2 className="text-4xl font-bold mb-4">Voter Status Scanner</h2>
          <p className="text-slate-400 text-lg">
            Upload your Aadhaar or EPIC. Our AI instantly extracts your state and verifies your eligibility for {selectedState}.
          </p>
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            {stage === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-500 rounded-3xl p-16 text-center hover:border-brand-500 hover:bg-slate-800/80 transition-all cursor-pointer group bg-slate-900/50"
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <div className="bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-brand-500/20 transition-all shadow-xl">
                  <UploadCloud className="w-12 h-12 text-brand-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Click or drag ID to scan</h3>
                <p className="text-slate-400">Verifying eligibility for {selectedState}</p>
              </motion.div>
            )}

            {stage === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-900 rounded-3xl p-16 text-center border border-brand-500/50 relative overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.2)]"
              >
                <motion.div 
                  className="absolute top-0 left-0 w-full h-2 bg-brand-400 shadow-[0_0_20px_rgba(99,102,241,1)]"
                  animate={{ y: [0, 400, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
                <Search className="w-20 h-20 text-brand-500 mx-auto mb-8 animate-pulse" />
                <h3 className="text-2xl font-bold text-white mb-3">Analyzing Document...</h3>
                <p className="text-slate-400 text-lg">Gemini Vision is extracting Name and State...</p>
              </motion.div>
            )}

            {stage === 'complete' && result && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-3xl p-8 border ${result.hasError ? 'bg-red-950/40 border-red-500/50' : 'bg-green-950/40 border-green-500/50'}`}
              >
                <div className="flex items-start gap-6 mb-8">
                  <div className={`p-4 rounded-full ${result.hasError ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                    {result.hasError ? <AlertTriangle className="w-10 h-10" /> : <CheckCircle className="w-10 h-10" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Vision AI Output</h3>
                    <div className="text-2xl font-bold text-white mb-2 leading-tight">
                      {result.statusMsg}
                    </div>
                    {result.hasError ? (
                      <p className="text-red-400">Extracted State: <strong>{result.extractedState}</strong> does not match Selected Dashboard State: <strong>{selectedState}</strong>.</p>
                    ) : (
                      <div className="flex gap-4 mt-4">
                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/50">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                          Status: {result.votedStatus}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-400 border border-brand-500/50">
                          <MapPin className="w-3 h-3" /> {result.distance}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={reset}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors text-lg"
                >
                  <X className="w-5 h-5" /> Reset Scanner
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
