import React from 'react';
import { CompletePlanEvaluation, RaidType } from '../types';
import { NAS_MODELS } from '../data/nasModels';
import { HARD_DRIVES, RAM_MODULES, ADDON_ACCESSORIES } from '../data/accessories';
import { useComparisonStore } from '../store/useComparisonStore';
import {
  Server,
  HardDrive as HddIcon,
  Cpu,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Trash2,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Tag,
  HelpCircle,
} from 'lucide-react';

interface PlanCardProps {
  evaluation: CompletePlanEvaluation;
  onOpenHardwareGuide: (tab: 'nas' | 'hdd' | 'ram' | 'addons') => void;
  onOpenPriceOverride: (itemId: string, itemName: string, currentPrice: number) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  evaluation,
  onOpenHardwareGuide,
  onOpenPriceOverride,
}) => {
  const { updatePlan, duplicatePlan, removePlan, plans } = useComparisonStore();
  const { config, nasModel, hddModel, storage, cost, usedBays, freeBays, compatibilityWarnings } = evaluation;

  const handleNasChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNasId = e.target.value;
    const targetNas = NAS_MODELS.find((m) => m.id === newNasId);
    let newHddCount = config.hddCount;
    if (targetNas && newHddCount > targetNas.bays) {
      newHddCount = targetNas.bays;
    }
    updatePlan(config.id, { nasModelId: newNasId, hddCount: newHddCount });
  };

  const handleHddChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePlan(config.id, { hddModelId: e.target.value });
  };

  const handleDiskCountChange = (count: number) => {
    updatePlan(config.id, { hddCount: count });
  };

  const handleRaidChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePlan(config.id, { raidType: e.target.value as RaidType });
  };

  const handleRamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    updatePlan(config.id, { selectedRamId: val === 'none' ? undefined : val });
  };

  const handleToggleAddon = (addonId: string) => {
    const exists = config.selectedAddonIds.includes(addonId);
    const updated = exists
      ? config.selectedAddonIds.filter((id) => id !== addonId)
      : [...config.selectedAddonIds, addonId];
    updatePlan(config.id, { selectedAddonIds: updated });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/90 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between relative overflow-hidden">
      {/* Top Banner & Header */}
      <div>
        <div className="flex items-start justify-between gap-2.5 mb-4">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={config.name}
              onChange={(e) => updatePlan(config.id, { name: e.target.value })}
              className="w-full bg-transparent font-bold text-base text-slate-100 border-b border-transparent hover:border-slate-700 focus:border-sky-500 focus:outline-none px-1 py-0.5 rounded transition truncate"
              title="點擊可直接修改方案名稱"
            />
            <div className="flex items-center gap-2 mt-1 px-1">
              <span className="text-xs font-semibold text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded-md flex-shrink-0">
                {nasModel.name}
              </span>
              <span className="text-xs text-slate-400 truncate">
                {config.hddCount} 顆 × {hddModel.capacityTb}TB ({config.raidType})
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => duplicatePlan(config.id)}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
              title="複製此方案"
            >
              <Copy className="w-4 h-4" />
            </button>
            {plans.length > 1 && (
              <button
                onClick={() => removePlan(config.id)}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                title="刪除此方案"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Compatibility Warnings */}
        {compatibilityWarnings.length > 0 && (
          <div className="mb-4 p-3 bg-amber-950/50 border border-amber-800/60 rounded-xl text-xs text-amber-300 space-y-1">
            {compatibilityWarnings.map((warn, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-400" />
                <span>{warn}</span>
              </div>
            ))}
          </div>
        )}

        {/* Form Controls */}
        <div className="space-y-3.5">
          {/* 1. NAS Model Selector */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-sky-400" />
                NAS 主機型號
                <button
                  type="button"
                  onClick={() => onOpenHardwareGuide('nas')}
                  className="text-slate-400 hover:text-sky-300"
                  title="查看各機型特色與選購差異"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </span>
              <button
                type="button"
                onClick={() =>
                  onOpenPriceOverride(
                    nasModel.id,
                    `${nasModel.name} 主機`,
                    nasModel.pricing.bestPrice || nasModel.msrp
                  )
                }
                className="text-[11px] text-slate-400 hover:text-sky-400 flex items-center gap-0.5 font-normal"
                title="自訂/覆寫此機型價格"
              >
                <Tag className="w-3 h-3" />
                自訂底價
              </button>
            </div>
            <select
              value={config.nasModelId}
              onChange={handleNasChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 transition"
            >
              {NAS_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.bays} Bay / {model.defaultRamGb}GB {model.defaultRamType} / {model.ethernetPorts}) - NT$ {model.pricing.bestPrice?.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Hard Drive Selector */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <HddIcon className="w-3.5 h-3.5 text-sky-400" />
                搭配硬碟型號
                <button
                  type="button"
                  onClick={() => onOpenHardwareGuide('hdd')}
                  className="text-slate-400 hover:text-sky-300"
                  title="查看硬碟品牌、轉速與保固指南"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </span>
              <button
                type="button"
                onClick={() =>
                  onOpenPriceOverride(
                    hddModel.id,
                    `${hddModel.brand} ${hddModel.series} ${hddModel.capacityTb}TB`,
                    hddModel.pricing.bestPrice || 10000
                  )
                }
                className="text-[11px] text-slate-400 hover:text-sky-400 flex items-center gap-0.5 font-normal"
                title="自訂/覆寫此硬碟單價"
              >
                <Tag className="w-3 h-3" />
                自訂單價
              </button>
            </div>
            <select
              value={config.hddModelId}
              onChange={handleHddChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 transition"
            >
              {HARD_DRIVES.map((hdd) => (
                <option key={hdd.id} value={hdd.id}>
                  {hdd.brand} {hdd.series} {hdd.capacityTb}TB ({hdd.rpm}轉/{hdd.warrantyYears}年保) - NT$ {hdd.pricing.bestPrice?.toLocaleString()}/顆
                </option>
              ))}
            </select>
          </div>

          {/* 3. Disk Count & Bay Occupancy */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>硬碟數量 (槽位佔用)</span>
              <span className="text-sky-400 font-mono">
                {usedBays} / {nasModel.bays} Bay (剩餘 {freeBays} 空槽)
              </span>
            </div>

            {/* Visual Bay Slots */}
            <div className="grid grid-cols-8 gap-1.5 mb-1.5">
              {Array.from({ length: nasModel.bays }).map((_, idx) => {
                const isOccupied = idx < config.hddCount;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDiskCountChange(idx + 1)}
                    className={`h-7 rounded-md text-[10px] font-bold flex items-center justify-center transition ${
                      isOccupied
                        ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                        : 'bg-slate-800/80 text-slate-500 border border-dashed border-slate-700 hover:border-slate-500'
                    }`}
                    title={`點擊設定為 ${idx + 1} 顆硬碟`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. RAID Mode Selector */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>RAID 磁碟陣列模式</span>
              <span className="text-[11px] text-slate-400 font-normal">預設建議：RAID 5</span>
            </div>
            <select
              value={config.raidType}
              onChange={handleRaidChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 transition"
            >
              <option value="RAID5">RAID 5 (單碟容錯 / 推薦 / 至少 3 顆)</option>
              <option value="SHR1">Synology SHR-1 (智慧單碟容錯 / 推薦)</option>
              <option value="RAID6">RAID 6 (雙碟容錯 / 高安全性 / 至少 4 顆)</option>
              <option value="RAID10">RAID 10 (極速讀寫 + 鏡像 / 偶數顆)</option>
              <option value="RAID1">RAID 1 (鏡像備份 / 2 顆)</option>
              <option value="RAID0">RAID 0 (無容錯 / 容量疊加)</option>
            </select>
          </div>

          {/* 5. RAM Expansion */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                記憶體 (RAM) 配置
              </span>
              <button
                type="button"
                onClick={() => onOpenHardwareGuide('ram')}
                className="text-[11px] text-sky-400 hover:text-sky-300 underline font-normal"
              >
                RAM 影響與 ECC？
              </button>
            </div>
            <select
              value={config.selectedRamId || 'none'}
              onChange={handleRamChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 transition"
            >
              <option value="none">
                標配 {nasModel.defaultRamGb}GB {nasModel.defaultRamType} (日常/備份/照片足夠) - NT$ 0
              </option>
              {RAM_MODULES.map((ram) => (
                <option key={ram.id} value={ram.id}>
                  加購 +{ram.capacityGb}GB ({ram.brand} {ram.type}) - NT$ {ram.pricing.bestPrice?.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Optional Add-ons */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                擴充配件 (網卡 / 快取)
              </span>
              <button
                type="button"
                onClick={() => onOpenHardwareGuide('addons')}
                className="text-[11px] text-sky-400 hover:text-sky-300 underline font-normal"
              >
                10G 與快取用途？
              </button>
            </div>
            <div className="space-y-1.5">
              {ADDON_ACCESSORIES.map((addon) => {
                const isSelected = config.selectedAddonIds.includes(addon.id);
                return (
                  <label
                    key={addon.id}
                    className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition ${
                      isSelected
                        ? 'bg-sky-950/40 border-sky-600/80 text-sky-200'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleAddon(addon.id)}
                        className="rounded border-slate-700 text-sky-500 focus:ring-0"
                      />
                      <span className="font-medium text-slate-200 truncate">{addon.name}</span>
                    </div>
                    <span className="font-mono text-slate-300 flex-shrink-0">
                      +NT$ {addon.pricing.bestPrice?.toLocaleString()}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Results Box */}
      <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
        {/* Storage Goal Achievement Box */}
        <div
          className={`p-3 rounded-xl border flex items-center justify-between ${
            storage.meets50TbTarget
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
              : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {storage.meets50TbTarget ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
            )}
            <div>
              <div className="font-bold text-xs">
                {storage.meets50TbTarget ? '🎉 達成 ≥ 50TB 採購目標' : '⚠️ 未達 50TB 採購目標'}
              </div>
              <div className="text-[11px] opacity-80">
                真實可用：{storage.usableTb} TB ({storage.usableTib} TiB)
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono font-bold">
              🛡️ 容許 {storage.faultToleranceDisks} 顆損壞
            </div>
            <div className="text-[10px] opacity-80">利用率 {storage.storageEfficiencyPercent}%</div>
          </div>
        </div>

        {/* Cost Matrix Summary */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>原價屋估算總價：</span>
            <span className="font-mono text-slate-200">
              {cost.totalCoolpc ? `NT$ ${cost.totalCoolpc.toLocaleString()}` : '品項缺貨/無報價'}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>欣亞數位估算總價：</span>
            <span className="font-mono text-slate-200">
              {cost.totalSinya ? `NT$ ${cost.totalSinya.toLocaleString()}` : '品項缺貨/無報價'}
            </span>
          </div>
          <div className="flex justify-between items-center pt-1.5 border-t border-slate-800">
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              最低混搭預算：
            </span>
            <span className="text-sm font-extrabold font-mono text-emerald-400">
              NT$ {cost.totalBest.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400 pt-0.5">
            <span>每可用 TB 建置成本：</span>
            <span className="font-mono font-semibold text-sky-400">
              NT$ {cost.costPerUsableTb.toLocaleString()} / TB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
