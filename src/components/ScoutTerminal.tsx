import React, { useState } from 'react';
import { Sparkles, Globe, FileText, Search, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Property } from '../types';
import { calculateValueScore } from '../data/properties';

interface ScoutTerminalProps {
  onAddProperty: (property: Property) => void;
}

const SEARCH_STATUS_MESSAGES = [
  'Querying Google Search Grounding for live listings...',
  'Extracting commercial metrics for Pacific Northwest and regional properties...',
  'Analyzing zoning patterns and commercial occupancy rates...',
  'Estimating Capitalization Rate and Net Operating Income...',
  'Calculating final Value Score...'
];

const PASTE_STATUS_MESSAGES = [
  'Scanning pasted text elements for metrics...',
  'Extracting listing price, square footage, and unit numbers...',
  'Cross-referencing net operational expenses...',
  'Generating professional real estate investment synopsis...',
  'Calculating final Value Score...'
];

export const ScoutTerminal: React.FC<ScoutTerminalProps> = ({ onAddProperty }) => {
  const [mode, setMode] = useState<'search' | 'paste'>('search');
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [draftProperty, setDraftProperty] = useState<Property | null>(null);

  const handleScout = async () => {
    if (!inputQuery.trim()) return;

    setLoading(true);
    setErrorMessage('');
    setDraftProperty(null);

    const messages = mode === 'search' ? SEARCH_STATUS_MESSAGES : PASTE_STATUS_MESSAGES;
    let step = 0;
    setStatusMessage(messages[0]);
    const interval = setInterval(() => {
      step = (step + 1) % messages.length;
      setStatusMessage(messages[step]);
    }, 1800);

    try {
      const res = await fetch('/api/scout-property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: inputQuery })
      });

      clearInterval(interval);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to process property data.');
      }

      const data = await res.json();
      if (data.success && data.property) {
        const score = calculateValueScore(data.property.metrics, data.property.type);
        const completeProperty: Property = {
          ...data.property,
          id: `custom-${Date.now()}`,
          valueScore: score
        };
        setDraftProperty(completeProperty);
      } else {
        throw new Error('Unable to parse a valid property. Try providing more details like price, rent or Cap Rate.');
      }
    } catch (err: any) {
      clearInterval(interval);
      setErrorMessage(err.message || 'Connection failed. Please check your network connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = () => {
    if (!draftProperty) return;
    onAddProperty(draftProperty);
    setDraftProperty(null);
    setInputQuery('');
  };

  return (
    <section className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-lg overflow-hidden">
      {/* Header & Mode Switcher */}
      <div className="bg-slate-800 px-5 py-3 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-teal-400" />
          <h3 className="font-bold text-sm tracking-wide uppercase text-teal-400">
            AI Opportunity Scout Terminal
          </h3>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => {
              setMode('search');
              setErrorMessage('');
            }}
            className={`px-3 py-1 rounded font-medium transition-all cursor-pointer ${
              mode === 'search' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe size={12} className="inline mr-1" /> Web Search Lookup
          </button>
          <button
            onClick={() => {
              setMode('paste');
              setErrorMessage('');
            }}
            className={`px-3 py-1 rounded font-medium transition-all cursor-pointer ${
              mode === 'paste' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText size={12} className="inline mr-1" /> Paste Listing Text
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {mode === 'search'
              ? 'Enter property address, name, or location keywords:'
              : 'Paste raw listing description, flyer details, or prospectus text:'}
          </label>

          {mode === 'search' ? (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="e.g., 3110 Judson St, Gig Harbor, WA multi business industrial building"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleScout()}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 text-slate-100 placeholder-slate-500"
                />
              </div>
              <button
                onClick={handleScout}
                disabled={loading || !inputQuery.trim()}
                className="bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 disabled:text-slate-500 text-slate-100 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                Scout
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                rows={4}
                placeholder="Paste text from LoopNet, Zillow, Redfin, or a flyer here... e.g., 'Commercial building at 512 Pioneer Way, Gig Harbor. List price $1.8M. Rent rolls indicate NOI is $120,000. 100% occupied...'"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-teal-500 text-slate-100 placeholder-slate-500 font-mono"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleScout}
                  disabled={loading || !inputQuery.trim()}
                  className="bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 disabled:text-slate-500 text-slate-100 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />}
                  Extract & Structure Listing
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-red-950/40 border border-red-800 p-3 rounded-lg flex items-start gap-2.5 text-red-200 text-xs">
            <AlertCircle className="text-red-400 shrink-0" size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Loading Progress Display */}
        {loading && (
          <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs text-teal-400 border border-slate-800 flex items-center gap-3">
            <Loader2 className="animate-spin text-teal-500" size={16} />
            <span className="animate-pulse">{statusMessage}</span>
          </div>
        )}

        {/* Draft Asset Confirmation */}
        {draftProperty && (
          <div className="bg-slate-950 rounded-lg border border-teal-900/50 p-5 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-800 uppercase tracking-widest font-bold">
                  Scouted Draft Asset
                </span>
                <h4 className="text-base font-bold text-slate-100 mt-1">{draftProperty.address}</h4>
                <p className="text-xs text-slate-400">
                  {draftProperty.city}, {draftProperty.state}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Scout Score</div>
                <div
                  className={`text-xl font-extrabold ${
                    draftProperty.valueScore >= 70
                      ? 'text-green-400'
                      : draftProperty.valueScore >= 50
                      ? 'text-amber-400'
                      : 'text-slate-400'
                  }`}
                >
                  {draftProperty.valueScore}{' '}
                  <span className="text-xs font-normal">/ 100</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase">List Price</div>
                <div className="font-bold text-teal-400 text-sm">
                  {draftProperty.price >= 1000000
                    ? `$${(draftProperty.price / 1000000).toFixed(2)}M`
                    : `$${(draftProperty.price / 1000).toFixed(0)}k`}
                </div>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase">Cap Rate</div>
                <div className="font-bold text-slate-100 text-sm">
                  {draftProperty.metrics.capRate}%
                </div>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase">Occupancy</div>
                <div className="font-bold text-slate-100 text-sm">
                  {draftProperty.metrics.occupancyRate}%
                </div>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase">Net Income (NOI)</div>
                <div className="font-bold text-slate-100 text-sm">
                  ${draftProperty.metrics.noi.toLocaleString()}
                </div>
              </div>
            </div>

            {draftProperty.description && (
              <div className="bg-slate-900 p-3 rounded text-xs text-slate-300 italic border-l-2 border-teal-500 leading-relaxed">
                "{draftProperty.description}"
              </div>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setDraftProperty(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-xs font-medium cursor-pointer"
              >
                Discard
              </button>
              <button
                onClick={handleCommit}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle2 size={14} /> Commit & Append to Register
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
