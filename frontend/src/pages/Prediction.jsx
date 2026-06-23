import { useState } from "react";
import { predictAttack } from "../api/api";
import toast from "react-hot-toast";

export default function Prediction() {
    // Standard 78 features for CICIDS2017/similar datasets
    const [features, setFeatures] = useState(Array(78).fill(""));
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (index, value) => {
        const updated = [...features];
        updated[index] = value;
        setFeatures(updated);
    };

    const fillSampleData = (type) => {
        const sample = Array(78).fill(0);
        if (type === "benign") {
            sample[0] = 80;
            sample[1] = 6;
            sample.fill(1, 2, 10);
            sample.fill(0, 10, 78);
            toast.success("Filled with Normal Traffic Profile");
        } else if (type === "attack") {
            sample[0] = 80;
            sample[1] = 6;
            sample.fill(1000, 2, 20);
            sample.fill(500, 20, 78);
            toast.success("Filled with Malicious Profile");
        } else {
            setFeatures(Array(78).fill(""));
            toast("Cleared all fields", { icon: "🧹" });
            return;
        }
        setFeatures(sample);
    };

    const handlePredict = async () => {
        try {
            setLoading(true);
            setResult(null);
            setErrorMsg("");

            // Convert to numeric and default empty to 0
            const numericFeatures = features.map((value) => 
                value === "" ? 0 : Number(value)
            );
            
            const token = localStorage.getItem("token");
            if (!token) {
                setErrorMsg("Authentication required. Please login again.");
                toast.error("Authentication required");
                return;
            }

            const data = await predictAttack(numericFeatures, token);
            
            if (data && data.success) {
                setResult(data.prediction);
                if (data.prediction.is_attack) {
                    toast.error("Threat Detected!");
                } else {
                    toast.success("Traffic is Safe");
                }
            } else {
                setErrorMsg(data.error || "Prediction failed");
                toast.error(data.error || "Prediction failed");
            }

        } catch (error) {
            console.error(error);
            const msg = error?.response?.data?.error || error.message || "Prediction failed";
            setErrorMsg(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto text-slate-200">
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                        Attack Prediction Model
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base">
                        Test the intrusion detection model with custom 78-dimensional feature vectors.
                    </p>
                </div>
            </header>

            {errorMsg && (
                <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-xl flex items-center text-red-200 shadow-lg animate-in fade-in slide-in-from-top-2">
                    <svg className="w-6 h-6 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    {errorMsg}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Control Panel & Results */}
                <div className="space-y-6">
                    <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg className="w-24 h-24 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 11.5l-10-5v5.5l10 5 10-5v-5.5l-10 5z"></path></svg>
                        </div>
                        
                        <h2 className="text-xl font-bold mb-6 flex items-center text-slate-100">
                            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            Control Panel
                        </h2>
                        
                        <div className="space-y-4 mb-6 relative z-10">
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-2">Quick Fill Vectors</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => fillSampleData("benign")}
                                        className="flex-1 bg-slate-700/50 hover:bg-slate-600 text-sm py-2.5 rounded-lg transition-colors border border-slate-600 hover:border-slate-500 font-medium text-slate-300"
                                    >
                                        Benign
                                    </button>
                                    <button
                                        onClick={() => fillSampleData("attack")}
                                        className="flex-1 bg-red-900/30 hover:bg-red-800/50 text-sm py-2.5 rounded-lg transition-colors border border-red-800/40 hover:border-red-500/50 font-medium text-red-300"
                                    >
                                        Malicious
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => fillSampleData("clear")}
                                className="w-full bg-slate-900/50 hover:bg-slate-800 text-slate-400 text-sm py-2 rounded-lg transition-colors border border-slate-800 hover:border-slate-600 font-medium"
                            >
                                Clear Form
                            </button>
                        </div>

                        <button
                            onClick={handlePredict}
                            disabled={loading}
                            className="w-full relative z-10 flex items-center justify-center py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/30 disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full -translate-x-full transition-transform duration-500 ease-in-out skew-x-12" />
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            )}
                            {loading ? "Analyzing Vector..." : "Run Prediction Engine"}
                        </button>
                    </div>

                    {result && (
                        <div className={`backdrop-blur-md border rounded-2xl p-6 shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden ${result.is_attack ? 'bg-red-950/40 border-red-500/50 shadow-red-900/20' : 'bg-emerald-950/40 border-emerald-500/50 shadow-emerald-900/20'}`}>
                            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: result.is_attack ? '#ef4444' : '#10b981' }}></div>
                            
                            <h2 className="text-xl font-bold mb-5 flex items-center relative z-10">
                                {result.is_attack ? (
                                    <><svg className="w-6 h-6 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> Threat Detected</>
                                ) : (
                                    <><svg className="w-6 h-6 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Traffic Safe</>
                                )}
                            </h2>
                            
                            <div className="space-y-5 relative z-10">
                                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">Classification</p>
                                    <p className={`text-2xl font-bold ${result.is_attack ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {result.attack_label}
                                    </p>
                                </div>
                                
                                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Confidence Score</p>
                                        <span className="font-mono font-bold text-slate-200">{(result.confidence * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-1000 ease-out rounded-full ${result.is_attack ? 'bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]' : 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'}`}
                                                style={{ width: `${(result.confidence * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Features Grid */}
                <div className="xl:col-span-2 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl flex flex-col h-[750px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center text-slate-100">
                            <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                            Feature Vector
                        </h2>
                        <span className="bg-slate-700/50 text-slate-300 text-xs px-2.5 py-1 rounded-full border border-slate-600">
                            78 Dimensions
                        </span>
                    </div>
                    
                    <div className="overflow-y-auto flex-1 pr-3 -mr-3 custom-scrollbar">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-4">
                            {features.map((value, index) => (
                                <div key={index} className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <span className="text-[10px] font-mono text-slate-500 font-semibold group-focus-within:text-cyan-400 transition-colors">
                                            F{index + 1}
                                        </span>
                                    </div>
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        placeholder="0"
                                        className="w-full bg-slate-900/60 border border-slate-700/80 rounded-lg py-2.5 pl-9 pr-3 text-slate-200 text-sm font-mono placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none hover:border-slate-600 shadow-inner"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Custom scrollbar styles specific to this page if global CSS doesn't have it */}
            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(30, 41, 59, 0.5);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(71, 85, 105, 0.8);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(148, 163, 184, 0.8);
                }
            `}</style>
        </div>
    );
}