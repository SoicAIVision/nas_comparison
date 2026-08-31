import React from 'react';
import { CompletePlanEvaluation } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

interface VisualChartsProps {
  evaluations: CompletePlanEvaluation[];
}

export const VisualCharts: React.FC<VisualChartsProps> = ({ evaluations }) => {
  if (evaluations.length === 0) return null;

  // Prepare simplified data for Stacked Price Breakdown Chart with clean concise names
  const priceChartData = evaluations.map((e, idx) => {
    const shortName = e.config.name.includes('：')
      ? e.config.name.split('：')[0] + ` (${e.usedBays}x${e.hddModel.capacityTb}TB)`
      : `方案 ${String.fromCharCode(65 + idx)} (${e.usedBays}x${e.hddModel.capacityTb}TB)`;

    return {
      name: shortName,
      fullName: e.config.name,
      主機成本: e.cost.nasCost.best,
      硬碟成本: e.cost.hddCost.best,
      M2系統碟成本: e.cost.m2SsdCost.best,
      記憶體成本: e.cost.ramCost.best,
      配件成本: e.cost.addonsCost.best,
      總價: e.cost.totalBest,
      每TB成本: e.cost.costPerUsableTb,
    };
  });

  // Prepare data for Capacity & Cost efficiency
  const capacityChartData = evaluations.map((e, idx) => {
    const shortName = e.config.name.includes('：')
      ? e.config.name.split('：')[0] + ` (${e.usedBays}x${e.hddModel.capacityTb}TB)`
      : `方案 ${String.fromCharCode(65 + idx)} (${e.usedBays}x${e.hddModel.capacityTb}TB)`;

    return {
      name: shortName,
      fullName: e.config.name,
      有效可用容量: e.storage.usableTb,
      每TB建置成本: e.cost.costPerUsableTb,
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Stacked Price Breakdown Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-sky-400" />
            各方案價格結構拆解 (Stacked Cost Breakdown)
          </h3>
          <p className="text-sm text-slate-400 mb-3">
            拆解「NAS 主機 vs 3.5吋硬碟 vs M.2系統碟 vs 記憶體/擴充配件」支出比重
          </p>
        </div>

        <div className="h-88 w-full min-h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={priceChartData}
              margin={{ top: 10, right: 15, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={13}
                tickLine={false}
                interval={0}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={13}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `NT$ ${value.toLocaleString()}`,
                  name,
                ]}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0] && payload[0].payload) {
                    return payload[0].payload.fullName || label;
                  }
                  return label;
                }}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '13px',
                  color: '#f8fafc',
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '16px', fontSize: '13px' }}
              />
              <Bar dataKey="主機成本" stackId="a" fill="#0284c7" />
              <Bar dataKey="硬碟成本" stackId="a" fill="#10b981" />
              <Bar dataKey="M2系統碟成本" stackId="a" fill="#a855f7" />
              <Bar dataKey="記憶體成本" stackId="a" fill="#f59e0b" />
              <Bar dataKey="配件成本" stackId="a" fill="#64748b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Usable Capacity vs Cost-per-TB */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            有效儲存容量 (TB) 與單 TB 建置成本 (NT$/TB)
          </h3>
          <p className="text-sm text-slate-400 mb-3">
            綠色為有效可用空間（需 ≥ 50TB），橘色為每 TB 採購成本（越低越划算）
          </p>
        </div>

        <div className="h-88 w-full min-h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={capacityChartData}
              margin={{ top: 10, right: 15, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={13}
                tickLine={false}
                interval={0}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#10b981"
                fontSize={13}
                tickFormatter={(val) => `${val} TB`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#f97316"
                fontSize={13}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name.includes('容量') ? `${value} TB` : `NT$ ${value.toLocaleString()} / TB`,
                  name,
                ]}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0] && payload[0].payload) {
                    return payload[0].payload.fullName || label;
                  }
                  return label;
                }}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '13px',
                  color: '#f8fafc',
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '16px', fontSize: '13px' }}
              />
              <Bar yAxisId="left" dataKey="有效可用容量" fill="#10b981" radius={[4, 4, 0, 0]} name="有效可用容量 (TB)" />
              <Bar yAxisId="right" dataKey="每TB建置成本" fill="#f97316" radius={[4, 4, 0, 0]} name="每TB建置成本 (NT$)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
