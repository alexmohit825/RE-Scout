import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { Property } from '../types';
import { TrendingUp, Info } from 'lucide-react';

interface YieldScatterMapProps {
  properties: Property[];
  regionLabel: string;
}

const CustomScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs space-y-1 z-50">
        <div className="font-bold text-teal-300">{data.address}</div>
        <div className="text-slate-300">
          {data.city}, {data.state}
        </div>
        <div className="pt-1 flex gap-3 text-[11px] border-t border-slate-800">
          <div>
            Price:{' '}
            <strong className="text-white">
              {data.price >= 1000000
                ? `$${(data.price / 1000000).toFixed(2)}M`
                : `$${(data.price / 1000).toFixed(0)}k`}
            </strong>
          </div>
          <div>
            Cap Rate: <strong className="text-teal-400">{data.yCapRate}%</strong>
          </div>
        </div>
        <div className="text-[11px]">
          Score:{' '}
          <strong
            className={
              data.valueScore >= 70
                ? 'text-emerald-400'
                : data.valueScore >= 50
                ? 'text-amber-400'
                : 'text-slate-400'
            }
          >
            {data.valueScore}/100
          </strong>
        </div>
      </div>
    );
  }
  return null;
};

export const YieldScatterMap: React.FC<YieldScatterMapProps> = ({ properties, regionLabel }) => {
  const chartData = properties.map((p) => ({
    ...p,
    yCapRate: p.metrics.capRate
  }));

  const formatPriceTick = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${(val / 1000).toFixed(0)}k`;
  };

  const formatCapTick = (val: number) => `${val}%`;

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
            <TrendingUp className="text-teal-700" size={18} />
            Market Cluster Yield Map (Cap Rate vs. Price)
          </h3>
          <p className="text-xs text-gray-500">
            Visualizing pricing efficiency and yield clusters in the current {regionLabel} register.
          </p>
        </div>
        <div className="flex gap-4 text-[11px] text-gray-500 self-start sm:self-center">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Prime Yield (Score 70+)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Reasonable (Score 50-69)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            Below Target (Score &lt;50)
          </span>
        </div>
      </div>

      <div className="h-[320px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 15, right: 20, bottom: 15, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              type="number"
              dataKey="price"
              name="Price"
              tickFormatter={formatPriceTick}
              domain={['auto', 'auto']}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="yCapRate"
              name="Cap Rate"
              tickFormatter={formatCapTick}
              domain={['auto', 'auto']}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
            />
            <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Properties" data={chartData}>
              {chartData.map((entry, index) => {
                let fill = '#94a3b8';
                if (entry.valueScore >= 70) fill = '#10b981';
                else if (entry.valueScore >= 50) fill = '#f59e0b';
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={fill}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-50 rounded-lg p-3 text-[11px] text-slate-600 flex items-start gap-2 border border-slate-100">
        <Info size={14} className="shrink-0 mt-0.5 text-teal-700" />
        <p className="leading-relaxed">
          <strong>How to read this chart:</strong> In commercial scouting, the upper-left quadrant represents high-yielding assets under a pricing advantage (optimal investment value). The scatter plot clusters active assets based on their financial metrics to help you visually locate high-efficiency outliers.
        </p>
      </div>
    </section>
  );
};
