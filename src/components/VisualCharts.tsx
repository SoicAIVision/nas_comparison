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

  // Prepare data for Stacked Price Breakdown Chart
  const priceChartData = evaluations.map((e) => ({
    name: e.config.name,
    主機成本: e.cost.nasCost.best,
    硬碟成本: e.cost.hddCost.best,
    記憶體成本: e.cost.ramCost.best,
    配件成本: e.cost.addonsCost.best,
    總價: e.cost.totalBest,
    每TB成本: e.cost.costPerUsableTb,
  }));

  // Prepare data for Capacity & Cost efficiency
  const capacityChartData = evaluations.map((e) => ({
    name: e.config.name,
    有效可用容量TB: e.storage.usableTb,
    每TB建置成本NT: e.cost.costPerUsableTb,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Stacked Price Breakdown Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-sky-400" />
            各方案價格結構拆解 (Stacked Cost Breakdown)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            拆解「NAS 主機 vs 硬碟群 vs 記憶體/擴充配件」支出比重
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={priceChartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `NT$ ${value.toLocaleString()}`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />
              <Bar dataKey="主機成本" stackId="a" fill="#0284c7" radius={[0, 0, 0, 0]} />
              <Bar dataKey="硬碟成本" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="記憶體成本" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
              <Bar dataKey="配件成本" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Usable Capacity vs Cost-per-TB */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            有效儲存容量 (TB) 與單 TB 建置成本 (NT$/TB)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            綠色為有效可用空間（需 $\ge$ 50TB），橘色為每 TB 採購成本（越低越划算）
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={capacityChartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#10b981"
                fontSize={11}
                tickFormatter={(val) => `${val} TB`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#f97316"
                fontSize={11}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name.includes('容量') ? `${value} TB` : `NT$ ${value.toLocaleString()} / TB`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />
              <Bar yAxisId="left" dataKey="有效可用容量TB" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="每TB建置成本NT" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
