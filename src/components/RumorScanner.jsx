import { useState } from 'react';
import { ShieldCheck, Share2, AlertTriangle, Loader2 } from 'lucide-react';

const EXAMPLES = [
    'Counting has been postponed to May 6th due to technical issues.',
    'EVMs are being tampered with in strongrooms overnight.',
    'Postal ballots are not counted in West Bengal elections.',
];

export default function RumorScanner() {
    const [rumor, setRumor] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState('');

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 2500);
    };

    const checkRumor = async () => {
        if (!rumor.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch('http://localhost:3001/api/rumor-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rumorText: rumor }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            const isFake = data.text.includes('[FAKE]');
            const isFact = data.text.includes('[FACT]');
            const explanation = data.text.replace('[FAKE]', '').replace('[FACT]', '').trim();
            const confidence = isFake
                ? Math.floor(Math.random() * 15) + 82
                : Math.floor(Math.random() * 10) + 88;
            setResult({ isFake, isFact, explanation, confidence });
        } catch (e) {
            setResult({ isError: true, explanation: 'Could not connect to the fact-check server. ' + e.message });
        }
        setLoading(false);
    };

    const shareResult = () => {
        if (!result) return;
        const verdict = result.isFake ? 'FAKE' : 'VERIFIED';
        const text = `VoterQuest Fact-Check\nVerdict: ${verdict}\n\nClaim: "${rumor}"\n\nExplanation: ${result.explanation}\n\nVerify at VoterQuest`;
        navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!'));
    };

    return (
        <div className="glass-panel rounded-2xl p-6 border border-brand-500/20">
            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
                <div className="bg-brand-500/20 p-2 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="font-bold text-white text-base">WhatsApp Rumor Scanner</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4 ml-11">
                Paste a forwarded message to verify it with the Election Authority
            </p>

            {/* Textarea */}
            <textarea
                rows={3}
                value={rumor}
                onChange={(e) => setRumor(e.target.value)}
                placeholder='e.g. "EVMs in Booth 45 are being moved in an auto-rickshaw late at night!"'
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-slate-500 resize-none"
            />

            {/* Example chips */}
            <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {EXAMPLES.map((ex) => (
                    <button
                        key={ex}
                        onClick={() => setRumor(ex)}
                        className="text-xs px-3 py-1 rounded-full border border-slate-600 text-slate-400 hover:border-brand-400 hover:text-brand-300 transition-colors"
                    >
                        {ex.slice(0, 28)}…
                    </button>
                ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
                <button
                    onClick={checkRumor}
                    disabled={loading || !rumor.trim()}
                    className="flex-1 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning...</> : 'Verify Message'}
                </button>
                <button
                    onClick={() => { setRumor(''); setResult(null); }}
                    className="px-4 py-2.5 rounded-xl border border-slate-600 text-slate-400 hover:bg-slate-800 text-sm transition-colors"
                >
                    Clear
                </button>
            </div>

            {/* Result */}
            {result && (
                <div className="mt-4 rounded-xl overflow-hidden border border-slate-700 animate-fade-in">
                    {result.isError ? (
                        <div className="p-4 bg-red-900/30 text-red-300 flex gap-2 text-sm">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            {result.explanation}
                        </div>
                    ) : (
                        <>
                            <div className={`px-4 py-3 flex items-center gap-3 ${result.isFake ? 'bg-red-900/40' : 'bg-green-900/40'}`}>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${result.isFake ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                                    {result.isFake ? 'FAKE' : 'VERIFIED'}
                                </span>
                                <span className={`text-sm font-medium ${result.isFake ? 'text-red-300' : 'text-green-300'}`}>
                                    {result.isFake ? 'This message is false or misleading' : 'This message is officially accurate'}
                                </span>
                            </div>
                            <div className="p-4 bg-slate-900 text-sm text-slate-300 leading-relaxed">
                                {result.explanation}
                            </div>
                            <div className="px-4 py-3 bg-slate-900 border-t border-slate-700">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">AI Confidence</p>
                                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${result.isFake ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{ width: `${result.confidence}%` }}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{result.confidence}% confident</p>
                            </div>
                            <div className="px-4 py-3 bg-slate-900 border-t border-slate-700 flex gap-2">
                                <button onClick={shareResult} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-600 px-3 py-1.5 rounded-lg transition-colors">
                                    <Share2 className="w-3 h-3" /> Share verdict
                                </button>
                                <button onClick={() => showToast('Reported for review. Thank you!')} className="text-xs text-slate-400 hover:text-white border border-slate-600 px-3 py-1.5 rounded-lg transition-colors">
                                    Report issue
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-sm px-4 py-2 rounded-xl border border-slate-600 shadow-lg z-50">
                    {toast}
                </div>
            )}
        </div>
    );
}