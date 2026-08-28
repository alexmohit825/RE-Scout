import React, { useState } from 'react';
import { Property } from '../types';
import { ValueScoreBadge } from './ValueScoreBadge';
import { PRIMARY_ASSET_TYPES, RESIDENTIAL_ASSET_TYPES } from '../data/properties';
import {
  Building2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Map,
  Compass,
  Globe,
  ExternalLink,
  Info
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onRemove?: (id: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onRemove }) => {
  const [expanded, setExpanded] = useState(false);

  const allTypes = [...PRIMARY_ASSET_TYPES, ...RESIDENTIAL_ASSET_TYPES];
  const typeObj = allTypes.find((t) => t.id === property.type);
  const typeLabel = typeObj ? typeObj.label : property.type.replace(/_/g, ' ');

  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    }
    return `$${(val / 1000).toFixed(0)}k`;
  };

  const isIndustrial =
    property.type.includes('industrial') ||
    property.type.includes('warehouse') ||
    property.type.includes('distribution') ||
    property.type.includes('manufacturing');

  const targetCap = isIndustrial ? 7.0 : 6.0;
  const capPoints = Math.min(30, (property.metrics.capRate / targetCap) * 30);
  const occPoints = Math.min(25, (property.metrics.occupancyRate / 90) * 25);
  const yieldPoints = Math.min(25, (property.metrics.grossYield / 8.0) * 25);
  let discountPoints = 0;
  if (property.metrics.pricePerUnit && property.metrics.pricePerUnit > 0) {
    if (property.metrics.pricePerUnit < 150000) discountPoints = 20;
    else if (property.metrics.pricePerUnit < 200000) discountPoints = 10;
  } else {
    if (property.metrics.pricePerSqFt < 100) discountPoints = 20;
    else if (property.metrics.pricePerSqFt < 140) discountPoints = 10;
  }

  const encodedQuery = encodeURIComponent(`${property.address}, ${property.city}, ${property.state}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${encodedQuery}`;
  const googleEarthUrl = `https://earth.google.com/web/search/${encodedQuery}`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-teal-700 font-semibold mb-0.5">
              <Building2 size={13} className="shrink-0" />
              <span className="truncate">{typeLabel}</span>
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug truncate">
              {property.address}
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              {property.city}, {property.state}
            </p>
          </div>
          <ValueScoreBadge score={property.valueScore} />
        </div>

        {/* Core Quick Metrics */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
          <div>
            <div className="text-[10px] text-gray-500 font-medium uppercase">Price</div>
            <div className="text-sm font-bold text-teal-800">{formatCurrency(property.price)}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-medium uppercase">Cap Rate</div>
            <div className="text-sm font-bold text-gray-900">{property.metrics.capRate}%</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-medium uppercase">Occupancy</div>
            <div className="text-sm font-bold text-gray-900">{property.metrics.occupancyRate}%</div>
          </div>
        </div>

        {/* Secondary line */}
        <div className="flex justify-between items-center text-xs text-gray-600 px-1">
          <span>
            NOI: <strong className="text-gray-900">${property.metrics.noi.toLocaleString()}</strong>
          </span>
          <span>
            {property.metrics.pricePerUnit > 0 ? (
              <>
                $/Unit:{' '}
                <strong className="text-gray-900">
                  ${property.metrics.pricePerUnit.toLocaleString()}
                </strong>
              </>
            ) : (
              <>
                $/SqFt:{' '}
                <strong className="text-gray-900">${property.metrics.pricePerSqFt}/sf</strong>
              </>
            )}
          </span>
        </div>

        {/* Expandable Section */}
        {expanded && (
          <div className="pt-3 border-t border-gray-100 space-y-3.5 text-xs">
            {/* Financial Underwriting Breakdown */}
            <div className="space-y-1.5">
              <div className="font-bold text-gray-900 text-[11px] uppercase tracking-wider">
                Financial Underwriting Breakdown
              </div>
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-lg text-gray-600">
                <div>
                  Gross Yield:{' '}
                  <strong className="text-gray-900">{property.metrics.grossYield}%</strong>
                </div>
                <div>
                  Net Revenue:{' '}
                  <strong className="text-gray-900">${property.metrics.noi.toLocaleString()}</strong>
                </div>
                {property.metrics.unitCount && (
                  <div>
                    Units: <strong className="text-gray-900">{property.metrics.unitCount}</strong>
                  </div>
                )}
                {property.sqft && (
                  <div>
                    Total Size:{' '}
                    <strong className="text-gray-900">{property.sqft.toLocaleString()} sqft</strong>
                  </div>
                )}
                {property.yearBuilt && (
                  <div>
                    Built: <strong className="text-gray-900">{property.yearBuilt}</strong>
                  </div>
                )}
                <div>
                  Vacancy Margin:{' '}
                  <strong className="text-gray-900">{100 - property.metrics.occupancyRate}%</strong>
                </div>
              </div>
            </div>

            {/* Existing Financing / Synthetic Loan */}
            {property.loan && property.loan.hasLoan && (
              <div className="bg-teal-50/70 border border-teal-200/80 rounded-lg p-2.5 space-y-1 text-teal-950">
                <div className="font-bold text-[11px] uppercase tracking-wider flex items-center justify-between text-teal-900">
                  <span>Current Financing (Estimated)</span>
                  <span className="text-[10px] bg-teal-200/60 px-1.5 py-0.2 rounded font-mono">
                    CRE Mortgage
                  </span>
                </div>
                <div className="text-[11px] text-teal-800">
                  Lender: <strong className="text-teal-950">{property.loan.bankName}</strong>
                </div>
                <div className="flex justify-between text-[11px] pt-0.5">
                  <span>
                    Balance:{' '}
                    <strong>${property.loan.outstandingBalance?.toLocaleString()}</strong>
                  </span>
                  <span>
                    Monthly:{' '}
                    <strong>${property.loan.monthlyPayment?.toLocaleString()}/mo</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Score Factor Weights */}
            <div className="space-y-1.5">
              <div className="font-bold text-gray-900 text-[11px] uppercase tracking-wider flex justify-between">
                <span>Value Score Allocation</span>
                <span className="text-teal-700">{property.valueScore}/100 pts</span>
              </div>
              <div className="space-y-1 text-[11px] text-gray-500">
                <div className="flex justify-between">
                  <span>Cap Rate ({property.metrics.capRate}% vs {targetCap}%)</span>
                  <span className="font-mono text-gray-800">{capPoints.toFixed(1)}/30 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Occupancy ({property.metrics.occupancyRate}%)</span>
                  <span className="font-mono text-gray-800">{occPoints.toFixed(1)}/25 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Gross Yield ({property.metrics.grossYield}%)</span>
                  <span className="font-mono text-gray-800">{yieldPoints.toFixed(1)}/25 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Valuation Discount Bonus</span>
                  <span className="font-mono text-gray-800">{discountPoints}/20 pts</span>
                </div>
              </div>
            </div>

            {/* Real-World Geographic Verification */}
            <div className="space-y-1.5 pt-1">
              <div className="font-bold text-gray-900 text-[11px] uppercase tracking-wider">
                Geographic Verification
              </div>
              <div className="flex flex-wrap gap-1.5">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-gray-300 hover:border-teal-500 text-gray-700 hover:text-teal-700 px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                >
                  <Map size={11} className="text-teal-600" /> Google Maps
                  <ExternalLink size={10} className="text-gray-400" />
                </a>
                <a
                  href={appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-gray-300 hover:border-teal-500 text-gray-700 hover:text-teal-700 px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                >
                  <Compass size={11} className="text-teal-600" /> Apple Maps
                  <ExternalLink size={10} className="text-gray-400" />
                </a>
                <a
                  href={googleEarthUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-gray-300 hover:border-teal-500 text-gray-700 hover:text-teal-700 px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                >
                  <Globe size={11} className="text-teal-600" /> Google Earth 3D
                  <ExternalLink size={10} className="text-gray-400" />
                </a>
              </div>
            </div>

            {property.description && (
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-600 italic text-[11px] leading-relaxed">
                "{property.description}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer transition-colors"
        >
          {expanded ? (
            <>
              Less Details <ChevronUp size={14} />
            </>
          ) : (
            <>
              Underwrite & Verify <ChevronDown size={14} />
            </>
          )}
        </button>

        {onRemove && (
          <button
            onClick={() => onRemove(property.id)}
            title="Remove property from register"
            className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
