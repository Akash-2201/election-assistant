import { useState } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, ScanLine, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DocumentVerifier() {
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
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

  const processFile = (file) => {
    setFile(file);
    setScanning(true);
    setResult(null);

    // Mock Gemini Vision AI scanning process
    setTimeout(() => {
      setScanning(false);
      // Randomly mock a success or failure for demo purposes
      const isSuccess = Math.random() > 0.3;
      if (isSuccess) {
        const docs = ['Aadhaar Card', 'PAN Card', 'EPIC (Voter ID)'];
        const docType = docs[Math.floor(Math.random() * docs.length)];
        setResult({
          status: 'success',
          docType: docType,
          message: `Valid ${docType} detected. You are good to go!`
        });
      } else {
        setResult({
          status: 'error',
          docType: 'Unknown',
          message: 'Could not clearly identify a valid Aadhaar, PAN, or EPIC. Please ensure the image is clear and try again.'
        });
      }
    }, 3000);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setScanning(false);
  };

  return (
    <section className="py-12">
      <div className="glass-panel rounded-3xl p-6 md:p-10 relative overflow-hidden border border-brand-500/20">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest mb-4 border border-brand-500/30">
            <ScanLine className="w-4 h-4" /> Gemini Vision AI
          </div>
          <h2 className="text-3xl font-bold mb-4">AI Document Verifier</h2>
          <p className="text-slate-400">
            Securely "scan" a mock ID. Our AI will instantly identify if it's an Aadhaar, PAN, or EPIC card and confirm its validity for the 2026 Elections.
          </p>
        </div>

        <div className="max-w-xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            {!file && !scanning && !result && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-600 rounded-2xl p-12 text-center hover:border-brand-500 hover:bg-slate-800/50 transition-colors cursor-pointer group"
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-brand-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Click or drag image to upload</h3>
                <p className="text-sm text-slate-400">Supports JPG, PNG (Mock only, files are not saved)</p>
              </motion.div>
            )}

            {scanning && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-900 rounded-2xl p-10 text-center border border-slate-700 relative overflow-hidden"
              >
                {/* Scanning line animation */}
                <motion.div 
                  className="absolute top-0 left-0 w-full h-1 bg-brand-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                  animate={{ y: [0, 300, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <ScanLine className="w-16 h-16 text-brand-500 mx-auto mb-6 animate-pulse" />
                <h3 className="text-xl font-bold text-white mb-2">Analyzing Document...</h3>
                <p className="text-slate-400">Gemini Vision is extracting details</p>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-8 border ${
                  result.status === 'success' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  {result.status === 'success' ? (
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                      <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {result.status === 'success' ? 'Validation Successful' : 'Validation Failed'}
                  </h3>
                  <div className="bg-slate-900/50 px-4 py-2 rounded-lg inline-block mb-4 mt-2 border border-white/10">
                    <span className="text-sm text-slate-300">Detected: </span>
                    <strong className="text-white">{result.docType}</strong>
                  </div>
                  <p className="text-slate-300 mb-8">{result.message}</p>
                  
                  <button 
                    onClick={reset}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
                  >
                    <X className="w-4 h-4" /> Scan Another Document
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
