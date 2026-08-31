import React from 'react';
import { CompletePlanEvaluation } from '../types';
import { CheckCircle2, ShieldCheck, ShieldAlert, Trophy, DollarSign, Shuffle, Layers, Network } from 'lucide-react';

interface ComparisonMatrixProps {
  evaluations: CompletePlanEvaluation[];
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ evaluations }) => {
  if (evaluations.length === 0) return null;

  // Find lowest total cost & lowest cost per TB
  const lowestTotalCost = Math.min(...evaluations.map((e) => e.cost.totalBest));
  const lowestCostPerTb = Math.min(...evaluations.map((e) => e.cost.costPerUsableTb).filter((c) => c > 0));
  const highestCapacity = Math.max(...evaluations.map((e) => e.storage.usableTb));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            多方案規格與價錢並列比較大看板 (Comparison Matrix)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            即時對比各方案的容量效益、硬體規格與原價屋/欣亞最低建置成本
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-200 text-sm">
              <th className="py-4 px-4 font-bold w-48 sticky left-0 bg-slate-950/95 z-10">
                比較維度 / 方案
              </th>
              {evaluations.map((evalItem) => {
                const isBestPrice = evalItem.cost.totalBest === lowestTotalCost;
                const isBestValue = evalItem.cost.costPerUsableTb === lowestCostPerTb;
                return (
                  <th key={evalItem.config.id} className="py-4 px-4 font-bold min-w-[260px] text-slate-100 text-base">
                    <div className="flex items-center justify-between gap-1.5">
                      <span>{evalItem.config.name}</span>
                      {isBestPrice && (
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded flex-shrink-0">
                          總價最省
                        </span>
                      )}
                      {isBestValue && !isBestPrice && (
                        <span className="text-xs bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded flex-shrink-0">
                          單 TB 最划算
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {/* NAS Model */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3.5 px-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/95 z-10">
                NAS 主機與系列
              </td>
              {evaluations.map((e) => (
                <td key={e.config.id} className="py-3.5 px-4">
                  <div className="font-bold text-slate-100 text-base flex items-center gap-1.5">
                    {e.nasModel.name}
                    {e.hasBuiltIn10G && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-1.5 py-0.5 rounded">
                        10GbE
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{e.nasModel.series} 系列 / {e.nasModel.cpu}</div>
                </td>
              ))}
            </tr>

            {/* Bay Occupancy */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3.5 px-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/95 z-10">
                3.5吋 硬碟槽位佔用
              </td>
              {evaluations.map((e) => (
                <td key={e.config.id} className="py-3.5 px-4 font-mono">
                  <span className="font-semibold text-sky-300 text-sm">使用 {e.usedBays} 槽</span>
                  <span className="text-slate-500"> / </span>
                  <span className="text-slate-300 text-sm">共 {e.nasModel.bays} 槽</span>
                  <span className="block text-xs text-emerald-400 mt-1">
                    {e.freeBays > 0 ? `✨ 保留 ${e.freeBays} 個空槽供未來擴充` : '⚠️ 8 槽插滿'}
                  </span>
                </td>
              ))}
            </tr>

            {/* Hard Drives */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3.5 px-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/95 z-10">
                搭配硬碟與規格
              </td>
              {evaluations.map((e) => (
                <td key={e.config.id} className="py-3.5 px-4">
                  {e.isMixedDrives ? (
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-purple-300 flex items-center gap-1">
                        <Shuffle className="w-3 h-3" />
                        混搭硬碟組合：
                      </div>
                      {e.mixedDriveItems.map((item, idx) => (
                        <div key={idx} className="text-xs text-slate-200">
                          • {item.count} 顆 × {item.hddModel.brand} {item.hddModel.capacityTb}TB ({item.hddModel.series})
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div className="font-semibold text-slate-100 text-sm">
                        {e.config.hddCount} 顆 × {e.hddModel.brand} {e.hddModel.capacityTb}TB
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {e.hddModel.series} ({e.hddModel.rpm}轉 / CMR / {e.hddModel.warrantyYears}年保)
                      </div>
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {/* RAID Mode */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3.5 px-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/95 z-10">
                磁碟陣列 (RAID) 模式
              </td>
              {evaluations.map((e) => (
                <td key={e.config.id} className="py-3.5 px-4">
                  <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md font-mono font-semibold text-slate-100 text-xs">
                    {e.config.raidType}
                  </span>
                  <span className="text-xs text-slate-400 ml-2.5">
                    🛡️ 容許 {e.storage.faultToleranceDisks} 顆損壞
                  </span>
                </td>
              ))}
            </tr>

            {/* Usable Storage & 50TB Target */}
            <tr className="bg-slate-950/40 hover:bg-slate-800/40 transition">
              <td className="py-4 px-4 font-bold text-slate-200 sticky left-0 bg-slate-950/95 z-10">
                有效可用儲存容量
              </td>
              {evaluations.map((e) => {
                const isMaxCapacity = e.storage.usableTb === highestCapacity;
                return (
                  <td key={e.config.id} className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold font-mono text-sky-400">
                        {e.storage.usableTb} TB
                      </span>
                      <span className="text-xs text-slate-400">({e.storage.usableTib} TiB)</span>
                      {isMaxCapacity && (
                        <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded">
                          容量最高
                        </span>
                      )}
                    </div>
                    {e.storage.unallocatedTb > 0 && (
                      <div className="text-[11px] text-amber-400 mt-0.5">
                        ⚠️ 陣列瓶頸導致 {e.storage.unallocatedTb}TB 空間浪費
                      </div>
                    )}
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {e.storage.meets50TbTarget ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          已達成 ≥ 50TB 採購目標
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          未達 50TB 目標
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* M.2 NVMe SSD Expansion Row (NEW) */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3.5 px-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/95 z-10">
                M.2 NVMe 系統硬碟/快取
              </td>
              {evaluations.map((e) => (
                <td key={e.config.id} className="py-3.5 px-4">
                  {e.m2SsdCount > 0 && e.m2SsdModule ? (
                    <div>
                      <div className="font-semibold text-purple-300 text-sm flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-purple-400" />
                        {e.m2SsdCount} 顆 × {e.m2SsdModule.capacityGb}GB ({e.m2SsdModule.brand})
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {e.m2Usage === 'storage_pool'
                          ? e.m2SsdCount > 1
                            ? '🚀 RAID 1 鏡像高速系統儲存集區 (Docker/VM/套件)'
                            : '🚀 單碟獨立系統儲存集區 (Docker/VM)'
                          : '⚡ 讀寫快取 (Cache 加速)'}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">無加購 (僅使用 3.5 吋硬碟)</span>
                  )}
                </td>
              ))}
            </tr>

            {/* RAM Config & Advice */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3.5 px-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/95 z-10">
                記憶體 (RAM) 配置
              </td>
              {evaluations.map((e) => (
                <td key={e.config.id} className="py-3.5 px-4">
                  <div className="font-semibold text-slate-100 font-mono text-sm">
                    總計 {e.totalRamGb} GB {e.ramIsEcc ? '(ECC)' : '(non-ECC)'}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {e.ramModule
                      ? `標配 ${e.nasModel.defaultRamGb}G + 加購 ${e.ramModule.capacityGb}G`
                      : `標配 ${e.nasModel.defaultRamGb}G (大檔傳輸/備份/照片足夠)`}
                  </div>
                </td>
              ))}
            </tr>

            {/* Networking Ports */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3.5 px-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/95 z-10">
                網路與擴充介面
              </td>
              {evaluations.map((e) => (
                <td key={e.config.id} className="py-3.5 px-4 text-xs text-slate-300">
                  <div className="font-medium text-slate-200 flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-sky-400" />
                    {e.nasModel.ethernetPorts}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{e.nasModel.pcieSlots}</div>
                  {e.addons.length > 0 && (
                    <div className="text-xs text-sky-400 mt-1 font-medium">
                      + {e.addons.map((a) => a.name).join(', ')}
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {/* CoolPC Total Price */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3.5 px-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/95 z-10">
                原價屋線上估價
              </td>
              {evaluations.map((e) => (
                <td key={e.config.id} className="py-3.5 px-4 font-mono text-sm">
                  {e.cost.totalCoolpc ? (
                    <span className="text-slate-200">NT$ {e.cost.totalCoolpc.toLocaleString()}</span>
                  ) : (
                    <span className="text-slate-500">品項缺貨/無報價</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Sinya Total Price */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="py-3.5 px-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/95 z-10">
                欣亞數位線上估價
              </td>
              {evaluations.map((e) => (
                <td key={e.config.id} className="py-3.5 px-4 font-mono text-sm">
                  {e.cost.totalSinya ? (
                    <span className="text-slate-200">NT$ {e.cost.totalSinya.toLocaleString()}</span>
                  ) : (
                    <span className="text-slate-500">品項缺貨/無報價</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Best Mixed Total Cost (Highlighted) */}
            <tr className="bg-emerald-950/20 hover:bg-emerald-950/30 transition border-t-2 border-emerald-800/40">
              <td className="py-4 px-4 font-bold text-emerald-400 sticky left-0 bg-slate-900/95 z-10 flex items-center gap-1.5 text-sm">
                <DollarSign className="w-5 h-5" />
                最低混搭建置總預算
              </td>
              {evaluations.map((e) => {
                const isBest = e.cost.totalBest === lowestTotalCost;
                return (
                  <td key={e.config.id} className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-extrabold font-mono ${isBest ? 'text-emerald-300' : 'text-emerald-400'}`}>
                        NT$ {e.cost.totalBest.toLocaleString()}
                      </span>
                      {isBest && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Cost per Usable TB */}
            <tr className="bg-sky-950/20 hover:bg-sky-950/30 transition">
              <td className="py-4 px-4 font-bold text-sky-400 sticky left-0 bg-slate-900/95 z-10 text-sm">
                每可用 TB 建置成本
              </td>
              {evaluations.map((e) => {
                const isBestValue = e.cost.costPerUsableTb === lowestCostPerTb;
                return (
                  <td key={e.config.id} className="py-4 px-4">
                    <span className={`text-base font-extrabold font-mono ${isBestValue ? 'text-sky-300' : 'text-sky-400'}`}>
                      NT$ {e.cost.costPerUsableTb.toLocaleString()} / TB
                    </span>
                    <div className="text-xs text-slate-400 mt-0.5">
                      (約 NT$ {e.cost.costPerUsableTib.toLocaleString()} / TiB)
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
