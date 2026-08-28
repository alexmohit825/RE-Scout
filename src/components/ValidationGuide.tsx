import React, { useState } from 'react';
import {
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  Percent,
  Sparkles,
  Info,
  DollarSign,
  Globe
} from 'lucide-react';

export const ValidationGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'score' | 'validation' | 'yield' | 'edge'>('score');

  return (
    <section className="bg-white rounded-xl border border-teal-200/80 shadow-md overflow-hidden">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-950 to-slate-900 text-white p-5 border-b border-teal-800">
        <div className="flex items-center gap-3">
          <div className="bg-teal-800/60 p-2 rounded-lg text-teal-300">
            <HelpCircle size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              Real Estate Economics & Value Score Validation Guide
            </h2>
            <p className="text-xs text-teal-300 font-medium">
              Multi-Unit Yield Formulas, Risk Mitigation Benchmark spreads, and Regional Model Backtesting
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-50 border-b border-gray-200 px-5 py-2.5 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('score')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'score'
              ? 'bg-teal-100 text-teal-900 shadow-sm border border-teal-200'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
          }`}
        >
          <TrendingUp size={14} /> Value Score Formula
        </button>
        <button
          onClick={() => setActiveTab('validation')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'validation'
              ? 'bg-teal-100 text-teal-900 shadow-sm border border-teal-200'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
          }`}
        >
          <CheckCircle2 size={14} /> Model Validation & Backtesting
        </button>
        <button
          onClick={() => setActiveTab('yield')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'yield'
              ? 'bg-teal-100 text-teal-900 shadow-sm border border-teal-200'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
          }`}
        >
          <Percent size={14} /> Cap Rate & Net Income (NOI) Explained
        </button>
        <button
          onClick={() => setActiveTab('edge')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'edge'
              ? 'bg-teal-100 text-teal-900 shadow-sm border border-teal-200'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
          }`}
        >
          <Sparkles className="text-teal-600" size={14} /> Why Value RE Scout (Our Edge)
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {activeTab === 'score' && (
          <div className="space-y-4">
            <div className="flex items-start gap-2 text-sm text-gray-700 bg-teal-50/50 p-3 rounded-lg border border-teal-100/50">
              <Info className="text-teal-700 shrink-0 mt-0.5" size={16} />
              <p className="leading-relaxed">
                The <strong>Value Score (max 100 points)</strong> is a multi-factor risk-reward metric used to score multi-unit residential and commercial industrial buildings. It penalizes overpriced low-yielding listings and rewards high stability, capital yield spread, and price efficiency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="border border-gray-100 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-gray-900">1. Cap Rate Yield Contribution</span>
                    <span className="text-teal-700 font-bold text-xs">Up to 30 Pts</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: '30%' }} />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                    Calculated as <code className="bg-gray-50 px-1 py-0.5 rounded text-gray-700 font-mono">Min(30, (CapRate / Target) * 30)</code>. Target rate is <strong>7.0%</strong> for industrial, warehousing, and distribution, and <strong>6.0%</strong> for residential complexes.
                  </p>
                </div>

                <div className="border border-gray-100 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-gray-900">2. Occupancy Rate Stability</span>
                    <span className="text-teal-700 font-bold text-xs">Up to 25 Pts</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: '25%' }} />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                    Calculated as <code className="bg-gray-50 px-1 py-0.5 rounded text-gray-700 font-mono">Min(25, (OccupancyRate / 90) * 25)</code>. Rewards assets maintaining stable, low-vacancy tenancy at or above a 90% floor.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="border border-gray-100 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-gray-900">3. Gross Rental Yield Efficiency</span>
                    <span className="text-teal-700 font-bold text-xs">Up to 25 Pts</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: '25%' }} />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                    Calculated as <code className="bg-gray-50 px-1 py-0.5 rounded text-gray-700 font-mono">Min(25, (GrossYield / 8) * 25)</code>. Measures raw rental generation power against purchase price prior to operational expenses.
                  </p>
                </div>

                <div className="border border-gray-100 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-gray-900">4. Valuation Discount Bonus</span>
                    <span className="text-teal-700 font-bold text-xs">Up to 20 Pts</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: '20%' }} />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                    Evaluates local price efficiency benchmarks:<br />
                    • <strong>Residential:</strong> +20 pts if price-per-unit is under $150k; +10 pts if under $200k.<br />
                    • <strong>Industrial:</strong> +20 pts if price-per-sqft is under $100; +10 pts if under $140.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'validation' && (
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-gray-100 space-y-2">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                  1. Backtesting & Local Registries
                </h4>
                <p className="text-xs">
                  Value targets and discount coefficients are backtested against actual historical property register records. By matching model evaluations with final closing transactions in the Pacific Northwest and the Southwest, the algorithm isolates high-yielding outliers without sacrificing structural safety.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-gray-100 space-y-2">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                  2. Yield Spreads vs. Risk-Free Rate
                </h4>
                <p className="text-xs">
                  The target thresholds are validated dynamically against prevailing macroeconomic conditions, ensuring that scored properties deliver a robust risk premium spread (at least 250-350 bps) above the 10-Year US Treasury yield. If the risk-free rate increases, target Cap Rates adjust to protect yield spreads.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-gray-100 space-y-2">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                  3. Multi-Query AI Verification
                </h4>
                <p className="text-xs">
                  For real-time on-demand scouted properties, our system routes through structured extraction schemas. It forces mathematical consistency between Price, Cap Rate, and Net Operating Income (NOI), discarding entries where the formulas do not align, protecting users from listing misinformation.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'yield' && (
          <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1">
                  <Percent size={14} className="text-teal-700" /> Capitalization Rate (Cap Rate)
                </h4>
                <p className="text-sm">
                  The Capitalization Rate is the estimated annual yield of an asset, assuming an all-cash purchase (without considering mortgage debt or leverage). It is the premier metric used by stock brokers, commercial traders, and real estate scouts to compare asset yield efficiencies across disparate regions.
                </p>
                <div className="bg-slate-900 text-teal-400 p-3.5 rounded-lg font-mono text-center border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                    Cap Rate Formula
                  </div>
                  <div className="text-sm font-bold text-slate-100">
                    Cap Rate = (Net Operating Income / Purchase Price) × 100
                  </div>
                  <div className="text-[10px] text-teal-300/80 mt-1">
                    Example: $150,000 NOI / $2,000,000 Price = 7.5% Cap Rate
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1">
                  <DollarSign size={14} className="text-teal-700" /> Net Revenue / Net Operating Income (NOI)
                </h4>
                <p className="text-sm">
                  Net Operating Income is the real net profit generated by a property's day-to-day operations. It represents the income remaining after subtracting all necessary operating expenses from the gross rental income, but before subtracting debt costs or income taxes.
                </p>
                <div className="bg-slate-900 text-teal-400 p-3.5 rounded-lg font-mono text-center border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                    Net Income (NOI) Formula
                  </div>
                  <div className="text-sm font-bold text-slate-100">
                    NOI = Gross Revenue - Operating Expenses
                  </div>
                  <div className="text-[10px] text-teal-300/80 mt-1">
                    Expenses include: property taxes, management, maintenance, insurance, utilities
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 mt-2 flex items-start gap-2">
              <Info size={16} className="shrink-0 mt-0.5 text-amber-600" />
              <p className="text-[11px] leading-relaxed">
                <strong>Note:</strong> Operating expenses strictly exclude mortgage payments (principal/interest), depreciation, and corporate income taxes. Therefore, NOI remains identical regardless of whether a purchaser finances 80% of the acquisition or pays 100% in physical cash.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'edge' && (
          <div className="space-y-6 text-xs text-gray-600 leading-relaxed">
            <div className="flex flex-col lg:flex-row gap-5 items-stretch">
              <div className="flex-1 space-y-4">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Sparkles size={16} className="text-teal-700" /> What Makes Value RE Scout Superior?
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Traditional commercial real estate scouting is intentionally gated behind paywalls or lost in complex spreadsheets. Our approach introduces a <strong>modern, math-validated, search-grounded alternative</strong> that democratizes institutional-grade trading mechanics for general brokers, property scouts, and options partners.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-teal-50/50 border border-teal-100 p-4 rounded-xl space-y-2">
                    <h5 className="font-bold text-teal-900 text-xs flex items-center gap-1.5">
                      <Globe size={14} className="text-teal-700" /> 1. Dynamic Search Grounding
                    </h5>
                    <p className="text-[11px] text-gray-600">
                      Unlike static CoStar databases that contain stale data, our scout integrates the <strong>Gemini Flash Model</strong> with live Google Search Grounding. It extracts structured real estate metrics directly from current web listings on-demand.
                    </p>
                  </div>
                  <div className="bg-teal-50/50 border border-teal-100 p-4 rounded-xl space-y-2">
                    <h5 className="font-bold text-teal-900 text-xs flex items-center gap-1.5">
                      <TrendingUp size={14} className="text-teal-700" /> 2. Institutional Value Scoring
                    </h5>
                    <p className="text-[11px] text-gray-600">
                      A listing is just a list. Value RE Scout applies a multi-factor underwriting algorithm that scores every opportunity on a 100-point scale, instantly flagging whether it offers prime margins or overpriced yield.
                    </p>
                  </div>
                  <div className="bg-teal-50/50 border border-teal-100 p-4 rounded-xl space-y-2">
                    <h5 className="font-bold text-teal-900 text-xs flex items-center gap-1.5">
                      <Sparkles size={14} className="text-teal-700" /> 3. Seamless PWA Workflow
                    </h5>
                    <p className="text-[11px] text-gray-600">
                      Engineered to live natively on your mobile home screen. One-tap access to live cap rate scatter plots and instant underwriting calculations in the field.
                    </p>
                  </div>
                  <div className="bg-teal-50/50 border border-teal-100 p-4 rounded-xl space-y-2">
                    <h5 className="font-bold text-teal-900 text-xs flex items-center gap-1.5">
                      <Percent size={14} className="text-teal-700" /> 4. Full Live Transparency
                    </h5>
                    <p className="text-[11px] text-gray-600">
                      No corporate salespeople or obscure scoring parameters. Every calculation, discount coefficient, and yield formula is fully transparent, backtested, and explained in the validation guide.
                    </p>
                  </div>
                </div>
              </div>

              {/* Competitive Matrix */}
              <div className="w-full lg:w-80 bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                    Competitive Matrix
                  </h4>
                  <div className="space-y-3.5 divide-y divide-slate-800 text-[11px]">
                    <div className="pt-0 space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-400">Target Feature</span>
                        <span className="text-teal-400">Value RE Scout</span>
                      </div>
                      <div className="flex justify-between text-slate-400 mt-1">
                        <span>Cost / Month</span>
                        <span className="text-emerald-400 font-bold">Free (Live Production)</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        LoopNet/CoStar costs upwards of $1k/mo.
                      </div>
                    </div>
                    <div className="pt-3 space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-400">Dynamic AI Grounding</span>
                        <span className="text-teal-400">Supported (Real-time)</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Other sites rely on slow manual broker entry.
                      </div>
                    </div>
                    <div className="pt-3 space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-400">Underwriting Intelligence</span>
                        <span className="text-teal-400">Automatic 100-Pt Score</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Other services display listings without objective ranking.
                      </div>
                    </div>
                    <div className="pt-3 space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-400">Visual Clustering</span>
                        <span className="text-teal-400">Cap Rate Scatter Plot</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Normally limited to institutional terminal suites.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-400 italic">
                  "By combining on-demand extraction with math-driven scoring, brokers can isolate underpriced assets before they hit standard mailing lists."
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
