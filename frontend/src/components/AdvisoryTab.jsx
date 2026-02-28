import React, { useState } from 'react';
import axios from 'axios';
import { Search, MapPin, TrendingUp, DollarSign, Building, Loader2, Sparkles, Filter } from 'lucide-react';

export default function AdvisoryTab() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setSearched(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/search?q=${query}`);
            setResults(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 max-w-5xl mx-auto">

            {/* Hero Section / Search */}
            <div className="text-center space-y-6 pt-8">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-artha-saffron/10 border border-artha-saffron/20 text-artha-saffron text-xs font-bold uppercase tracking-widest animate-float">
                    <Sparkles className="w-3 h-3 mr-2" />
                    Powered by MSME Growth Engine
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight">
                    Discovery <span className="text-artha-saffron">Intelligence</span>
                </h1>
                <p className="text-artha-slate max-w-2xl mx-auto font-medium">
                    Search over 5,000 MSME profiles to identify high-potential economic clusters and policy fitment.
                </p>

                <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group pt-4">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-artha-slate group-focus-within:text-artha-saffron transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="search-input pl-12 h-16 text-lg"
                        placeholder="Search by ID, Sector (e.g. Textile), or Location..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                        <button type="submit" className="premium-button h-12 flex items-center px-6">
                            Analyze
                        </button>
                    </div>
                </form>

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                    {['Textiles', 'Electronics', 'Surat', 'High Growth', 'Fintech'].map(tag => (
                        <button
                            key={tag}
                            onClick={() => { setQuery(tag); handleSearch(); }}
                            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-artha-slate uppercase hover:bg-white/10 hover:text-white transition-all"
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            <div className="space-y-8 min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center space-y-4 py-20">
                        <Loader2 className="h-12 w-12 text-artha-saffron animate-spin" />
                        <p className="text-artha-slate font-display font-bold animate-pulse">Scanning Neural Databanks...</p>
                    </div>
                ) : searched && results.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <p className="text-artha-slate font-medium">No entities matched your search criteria within the current simulation parameters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((item, idx) => (
                            <div
                                key={idx}
                                className="glass-card glass-card-hover p-6 flex flex-col justify-between group animate-in zoom-in-95 duration-300"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-artha-navy rounded-lg border border-white/5">
                                            <Building className="w-5 h-5 text-artha-saffron" />
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.Growth_Category === 'High' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                item.Growth_Category === 'Moderate' ? 'bg-artha-saffron/20 text-artha-saffron border border-artha-saffron/30' :
                                                    'bg-artha-slate/20 text-artha-slate border border-white/10'
                                            }`}>
                                            {item.Growth_Category} Growth
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-white mb-1 group-hover:text-artha-saffron transition-colors">
                                        {item.MSME_ID}
                                    </h3>
                                    <div className="flex items-center text-xs text-artha-slate font-semibold mb-4">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {item.Location_Type} &bull; {item.Sector}
                                    </div>

                                    <div className="space-y-3 mt-6">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-artha-slate/70 flex items-center">
                                                <DollarSign className="w-3 h-3 mr-1" /> Annual Revenue
                                            </span>
                                            <span className="text-white font-bold">₹{(item.Annual_Revenue / 10000000).toFixed(2)} Cr</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-artha-slate/70 flex items-center">
                                                <TrendingUp className="w-3 h-3 mr-1" /> Compliance
                                            </span>
                                            <span className="text-artha-gold font-bold">{item.GST_Compliance_Score.toFixed(0)}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {[1, 2].map(i => (
                                            <div key={i} className="w-6 h-6 rounded-full bg-artha-navy border border-white/20 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-artha-saffron"></div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="text-[10px] font-bold text-artha-saffron uppercase tracking-widest hover:underline decoration-artha-saffron underline-offset-4">
                                        Details &rarr;
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
