import React, { useState, useEffect } from 'react';
import {
  INITIAL_PROPERTIES,
  REGIONS,
  SORT_OPTIONS,
  RESIDENTIAL_ASSET_TYPES
} from './data/properties';
import { Property, RegionId } from './types';
import { PropertyCard } from './components/PropertyCard';
import { RegionSelector } from './components/RegionSelector';
import { ValidationGuide } from './components/ValidationGuide';
import { ScoutTerminal } from './components/ScoutTerminal';
import { YieldScatterMap } from './components/YieldScatterMap';
import { PwaBanner } from './components/PwaBanner';
import { Building2, Sparkles, Search, Code2 } from 'lucide-react';
import { SwiftNativeWorkspaceModal } from './components/SwiftNativeWorkspaceModal';

export const App: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionId>('pnw');
  const [showResidential, setShowResidential] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('valueScore');
  const [customProperties, setCustomProperties] = useState<Property[]>([]);
  const [isSwiftModalOpen, setIsSwiftModalOpen] = useState(false);

  // Load custom saved properties from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('custom_properties');
      if (saved) {
        setCustomProperties(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load saved properties:', e);
    }
  }, []);

  const handleAddProperty = (property: Property) => {
    const updated = [property, ...customProperties];
    setCustomProperties(updated);
    try {
      localStorage.setItem('custom_properties', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save property:', e);
    }

    // Automatically switch to property's region if matching
    const matchingRegion = REGIONS.find((r) =>
      r.states.includes(property.state.toUpperCase())
    );
    if (matchingRegion) {
      setSelectedRegion(matchingRegion.id);
    }
  };

  const handleRemoveCustomProperty = (id: string) => {
    const updated = customProperties.filter((p) => p.id !== id);
    setCustomProperties(updated);
    try {
      localStorage.setItem('custom_properties', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update saved properties:', e);
    }
  };

  const currentRegion = REGIONS.find((r) => r.id === selectedRegion) || REGIONS[0];

  // Combine initial properties and user-scouted properties
  const allProperties = [...customProperties, ...INITIAL_PROPERTIES];

  // Filter properties based on region, residential flag, and search query
  const filteredProperties = allProperties.filter((prop) => {
    // Region filter
    const matchesRegion =
      prop.region === selectedRegion ||
      currentRegion.states.includes(prop.state.toUpperCase());
    if (!matchesRegion) return false;

    // Residential toggle filter
    const isResidential = RESIDENTIAL_ASSET_TYPES.some((t) => t.id === prop.type);
    if (isResidential && !showResidential) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAddress = prop.address.toLowerCase().includes(q);
      const matchCity = prop.city.toLowerCase().includes(q);
      const matchState = prop.state.toLowerCase().includes(q);
      if (!matchAddress && !matchCity && !matchState) return false;
    }

    return true;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'valueScore') return b.valueScore - a.valueScore;
    if (sortBy === 'capRate') return b.metrics.capRate - a.metrics.capRate;
    if (sortBy === 'pricePerUnit') {
      const aUnit = a.metrics.pricePerUnit || Infinity;
      const bUnit = b.metrics.pricePerUnit || Infinity;
      return aUnit - bUnit;
    }
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'occupancy') return b.metrics.occupancyRate - a.metrics.occupancyRate;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-teal-950 text-white px-6 py-6 border-b border-teal-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="text-teal-400" size={24} />
              <h1 className="text-2xl font-extrabold tracking-tight">Value RE Scout</h1>
            </div>
            <p className="text-teal-300 text-sm mt-1 font-medium">
              Multi-Unit & Industrial Yield Screen • Real-Time AI Search Integration
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            <button
              onClick={() => setIsSwiftModalOpen(true)}
              className="flex items-center gap-1.5 bg-teal-800/80 hover:bg-teal-700 text-teal-100 px-3 py-1.5 rounded-lg text-xs font-semibold border border-teal-600/60 shadow-sm transition-colors cursor-pointer"
            >
              <Code2 size={14} className="text-teal-300" />
              <span>Swift iOS Native Code</span>
            </button>
            <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1.5 rounded-lg text-xs text-emerald-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold">Live Production Environment</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6 w-full flex-1">
        {/* Economics & Validation Guide */}
        <ValidationGuide />

        {/* Hybrid Property Register Callout */}
        <section className="bg-white rounded-xl border border-teal-100 p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-teal-50 p-2.5 rounded-lg text-teal-700 mt-1">
              <Sparkles size={22} className="animate-pulse" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-gray-900">
                Hybrid Property Register approach
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Paid commercial registers (CoStar, LoopNet, MLS APIs) cost thousands of dollars. Instead, our <strong>Value RE Scout hybrid engine</strong> is 100% free! It combines our core pre-loaded registers with an on-demand <strong>Google Search Grounded AI Scout</strong>. Paste any listing copy or enter raw keywords to retrieve investment statistics immediately, free of charge.
              </p>
            </div>
          </div>
        </section>

        {/* AI Opportunity Scout Terminal */}
        <ScoutTerminal onAddProperty={handleAddProperty} />

        {/* Regional Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            Active Regional Registers:
          </label>
          <RegionSelector selected={selectedRegion} onSelect={setSelectedRegion} />
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search address, city, state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 bg-white text-gray-900"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 bg-white text-gray-900 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowResidential((prev) => !prev)}
              className={`text-sm px-3 py-2 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                showResidential
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-amber-300'
              }`}
            >
              {showResidential ? '✓ Show Residential' : '+ Enable Residential Listings'}
            </button>
          </div>
        </div>

        {/* Value Score Range Legend */}
        <div className="flex gap-3 text-xs text-gray-500 flex-wrap">
          <span className="bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Score 70–100: Prime Margin (Optimal Yield)
          </span>
          <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Score 50–69: Reasonable Asset
          </span>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Score &lt;50: High Premium / Below Yield target
          </span>
        </div>

        {/* Scatter Plot Yield Map */}
        {sortedProperties.length > 0 && (
          <YieldScatterMap properties={sortedProperties} regionLabel={currentRegion.label} />
        )}

        {/* Results Counter & Badge */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <p>
            Showing <strong>{sortedProperties.length}</strong> asset
            {sortedProperties.length !== 1 ? 's' : ''} in the{' '}
            <strong>{currentRegion.label}</strong> register
          </p>
          {customProperties.length > 0 && (
            <span className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full font-semibold">
              Includes {customProperties.length} user-scouted properties
            </span>
          )}
        </div>

        {/* Property Grid */}
        {sortedProperties.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 text-center py-16 px-4 space-y-3">
            <p className="text-gray-400 font-medium">
              No assets in {currentRegion.label} match your current filter and search settings.
            </p>
            {customProperties.length === 0 && (
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Tip: Try using the <strong>AI Opportunity Scout Terminal</strong> above to search and import any live property from Washington, Oregon, or other states!
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedProperties.map((property) => {
              const isCustom = customProperties.some((cp) => cp.id === property.id);
              return (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onRemove={isCustom ? handleRemoveCustomProperty : undefined}
                />
              );
            })}
          </div>
        )}

        {/* PWA iOS Setup Banner */}
        <PwaBanner />

        {/* Swift iOS Native Workspace Code Viewer */}
        <SwiftNativeWorkspaceModal
          isOpen={isSwiftModalOpen}
          onClose={() => setIsSwiftModalOpen(false)}
        />
      </main>
    </div>
  );
};

export default App;
