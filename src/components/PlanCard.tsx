import React from 'react';
import { CompletePlanEvaluation, RaidType } from '../types';
import { NAS_MODELS } from '../data/nasModels';
import { HARD_DRIVES, RAM_MODULES, M2_SSD_MODULES, ADDON_ACCESSORIES } from '../data/accessories';
import { useComparisonStore } from '../store/useComparisonStore';
import { getDualStorePricingInfo } from '../utils/priceFormatter';
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
  Plus,
  Minus,
  Sparkles,
  Store,
  Layers,
  Network,
} from 'lucide-react';

interface PlanCardProps {
  evaluation: CompletePlanEvaluation;
  onOpenHardwareGuide: (tab: 'nas' | 'hdd' | 'ram' | 'm2' | 'addons') => void;
  onOpenPriceOverride: (itemId: string, itemName: string, currentPrice: number) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  evaluation,
  onOpenHardwareGuide,
  onOpenPriceOverride,
}) => {
  const { updatePlan, duplicatePlan, removePlan, plans } = useComparisonStore();
  const {
    config,
    nasModel,
    mixedDriveItems,
    m2SsdModule,
    m2SsdCount,
    m2Usage,
    hasBuiltIn10G,
    storage,
    cost,
    usedBays,
    freeBays,
    compatibilityWarnings,
    shrAdvantageTb,
  } = evaluation;

  const nasPriceInfo = getDualStorePricingInfo(nasModel.pricing);

  const handleNasChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNasId = e.target.value;
    const targetNas = NAS_MODELS.find((m) => m.id === newNasId);
    let newHddCount = config.hddCount;
    if (targetNas && newHddCount > targetNas.bays) {
      newHddCount = targetNas.bays;
    }
    updatePlan(config.id, { nasModelId: newNasId, hddCount: newHddCount });
  };

  // Mixed Drives Handlers
  const handleUpdateDriveModel = (index: number, newModelId: string) => {
    const current = config.mixedDrives ? [...config.mixedDrives] : [];
    if (current[index]) {
      current[index] = { ...current[index], hddModelId: newModelId };
      updatePlan(config.id, { mixedDrives: current, hddModelId: current[0].hddModelId });
    }
  };

  const handleUpdateDriveCount = (index: number, delta: number) => {
    const current = config.mixedDrives ? [...config.mixedDrives] : [];
    if (current[index]) {
      const newCount = current[index].count + delta;
      if (newCount <= 0) return;
      // Check total bay limit
      const otherBays = current.reduce((sum, item, idx) => (idx === index ? sum : sum + item.count), 0);
      if (otherBays + newCount > nasModel.bays) return;

      current[index] = { ...current[index], count: newCount };
      const totalCount = current.reduce((s, i) => s + i.count, 0);
      updatePlan(config.id, { mixedDrives: current, hddCount: totalCount });
    }
  };

  const handleAddDriveRow = () => {
    const current = config.mixedDrives ? [...config.mixedDrives] : [];
    if (usedBays >= nasModel.bays) return;
    // Find an unused HDD model or default
    const availableHdd =
      HARD_DRIVES.find((h) => !current.some((c) => c.hddModelId === h.id)) || HARD_DRIVES[0];
    current.push({ hddModelId: availableHdd.id, count: 1 });
    const totalCount = current.reduce((s, i) => s + i.count, 0);
    updatePlan(config.id, { mixedDrives: current, hddCount: totalCount });
  };

  const handleRemoveDriveRow = (index: number) => {
    const current = config.mixedDrives ? [...config.mixedDrives] : [];
    if (current.length <= 1) return;
    current.splice(index, 1);
    const totalCount = current.reduce((s, i) => s + i.count, 0);
    updatePlan(config.id, {
      mixedDrives: current,
      hddModelId: current[0]?.hddModelId || config.hddModelId,
      hddCount: totalCount,
    });
  };

  const handleRaidChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePlan(config.id, { raidType: e.target.value as RaidType });
  };

  const handleRamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    updatePlan(config.id, { selectedRamId: val === 'none' ? undefined : val });
  };

  // M.2 SSD Handlers
  const handleM2ModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'none') {
      updatePlan(config.id, { selectedM2SsdId: undefined, m2SsdCount: 0 });
    } else {
      updatePlan(config.id, {
        selectedM2SsdId: val,
        m2SsdCount: config.m2SsdCount && config.m2SsdCount > 0 ? config.m2SsdCount : 1,
      });
    }
  };

  const handleM2CountChange = (count: number) => {
    if (count === 0) {
      updatePlan(config.id, { selectedM2SsdId: undefined, m2SsdCount: 0 });
    } else {
      const defaultM2 = config.selectedM2SsdId || M2_SSD_MODULES[2].id; // default Kingston 1TB
      updatePlan(config.id, { selectedM2SsdId: defaultM2, m2SsdCount: count });
    }
  };

  const handleM2UsageChange = (usage: 'storage_pool' | 'cache') => {
    updatePlan(config.id, { m2Usage: usage });
  };

  const handleToggleAddon = (addonId: string) => {
    const exists = config.selectedAddonIds.includes(addonId);
    const updated = exists
      ? config.selectedAddonIds.filter((id) => id !== addonId)
      : [...config.selectedAddonIds, addonId];
    updatePlan(config.id, { selectedAddonIds: updated });
  };

  const m2PriceInfo = m2SsdModule ? getDualStorePricingInfo(m2SsdModule.pricing) : null;

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl transition-all flex flex-col justify-between relative overflow-hidden">
      {/* Top Banner & Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={config.name}
              onChange={(e) => updatePlan(config.id, { name: e.target.value })}
              className="w-full bg-transparent font-bold text-lg text-slate-100 border-b border-transparent hover:border-slate-700 focus:border-sky-500 focus:outline-none px-1 py-0.5 rounded transition truncate"
              title="點擊可直接修改方案名稱"
            />
            <div className="flex flex-wrap items-center gap-2 mt-1 px-1">
              <span className="text-xs font-semibold text-sky-400 bg-sky-950/70 border border-sky-800/70 px-2.5 py-0.5 rounded-md flex-shrink-0">
                {nasModel.name}
              </span>
              {hasBuiltIn10G && (
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Network className="w-3 h-3 text-emerald-400" />
                  原生 10GbE 網卡
                </span>
              )}
              {m2SsdCount > 0 && m2SsdModule && (
                <span className="text-xs font-semibold text-purple-400 bg-purple-950/70 border border-purple-800/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Layers className="w-3 h-3 text-purple-400" />
                  {m2SsdCount}x {m2SsdModule.capacityGb}GB M.2 {m2Usage === 'storage_pool' ? '系統集區' : '快取'}
                </span>
              )}
              <span className="text-sm text-slate-400 truncate">
                {mixedDriveItems.length === 1
                  ? `${usedBays} 顆 × ${mixedDriveItems[0]?.hddModel.capacityTb}TB (${config.raidType})`
                  : `混搭 ${usedBays} 顆硬碟 (${config.raidType})`}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => duplicatePlan(config.id)}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="複製此方案"
            >
              <Copy className="w-4 h-4" />
            </button>
            {plans.length > 1 && (
              <button
                onClick={() => removePlan(config.id)}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                title="刪除此方案"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Compatibility Warnings & Intelligent Prompts */}
        {compatibilityWarnings.length > 0 && (
          <div className="mb-4 p-3.5 bg-amber-950/50 border border-amber-800/60 rounded-xl text-sm text-amber-300 space-y-1">
            {compatibilityWarnings.map((warn, i) => (
              <div key={i} className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-400" />
                <span>{warn}</span>
              </div>
            ))}
          </div>
        )}

        {/* SHR Advantage Recommendation Callout */}
        {shrAdvantageTb && shrAdvantageTb > 0 && (
          <div className="mb-4 p-3.5 bg-sky-950/60 border border-sky-600/70 rounded-xl text-xs sm:text-sm text-sky-200 space-y-2 animate-in fade-in">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 mt-0.5 text-sky-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-sky-300">💡 發現容量釋放機會：</span>
                您選擇了不同容量混搭。若切換為 <strong>Synology SHR-1</strong> 陣列，可多獲得{' '}
                <strong className="text-emerald-300">+{shrAdvantageTb} TB</strong> 有效空間（避免傳統 RAID 5 浪費空間）！
              </div>
            </div>
            <button
              onClick={() => updatePlan(config.id, { raidType: 'SHR1' })}
              className="w-full py-1.5 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-semibold text-xs transition flex items-center justify-center gap-1 cursor-pointer shadow"
            >
              <Zap className="w-3.5 h-3.5" />
              一鍵切換為 Synology SHR-1 (釋放全部空間)
            </button>
          </div>
        )}

        {/* Form Controls */}
        <div className="space-y-4">
          {/* 1. NAS Model Selector */}
          <div>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Server className="w-4 h-4 text-sky-400" />
                NAS 主機型號
                <button
                  type="button"
                  onClick={() => onOpenHardwareGuide('nas')}
                  className="text-slate-400 hover:text-sky-300 cursor-pointer"
                  title="查看各機型特色與 3.5/2.5 吋插槽支援說明"
                >
                  <HelpCircle className="w-4 h-4" />
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
                className="text-xs text-slate-400 hover:text-sky-400 flex items-center gap-1 font-normal cursor-pointer"
                title="自訂/覆寫此機型價格"
              >
                <Tag className="w-3.5 h-3.5" />
                自訂底價
              </button>
            </div>
            <select
              value={config.nasModelId}
              onChange={handleNasChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500 transition cursor-pointer"
            >
              {NAS_MODELS.map((model) => {
                const info = getDualStorePricingInfo(model.pricing);
                const tag10g = model.hasBuiltIn10G ? ' [⚡內建10GbE]' : '';
                return (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.bays} Bay / {model.defaultRamGb}GB {model.defaultRamType}){tag10g} [{info.dropdownText}] - 最低 NT$ {info.bestPrice.toLocaleString()}
                  </option>
                );
              })}
            </select>

            {/* Dual Store Comparison Banner for NAS */}
            <div className="flex items-center justify-between mt-1 px-1 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Store className="w-3 h-3 text-sky-400" />
                原價屋: <strong className="text-slate-200">{nasPriceInfo.coolpcText}</strong>
                <span className="text-slate-600">|</span>
                欣亞: <strong className="text-slate-200">{nasPriceInfo.sinyaText}</strong>
              </span>
              {nasPriceInfo.diffText && (
                <span className="text-emerald-400 font-medium">{nasPriceInfo.diffText}</span>
              )}
            </div>
          </div>

          {/* 2. Unified Hard Drive Configuration Section */}
          <div>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <HddIcon className="w-4 h-4 text-sky-400" />
                3.5吋 硬碟選購與槽位配置 (資料儲存集區)
                <button
                  type="button"
                  onClick={() => onOpenHardwareGuide('hdd')}
                  className="text-slate-400 hover:text-sky-300 cursor-pointer"
                  title="查看硬碟品牌、混搭防暴斃與保固指南"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </span>

              <span className="font-mono text-xs text-sky-400 font-medium">
                已選 {usedBays} / {nasModel.bays} 槽 ({freeBays > 0 ? `剩 ${freeBays} 空槽` : '滿槽'})
              </span>
            </div>

            {/* Dynamic Drive List */}
            <div className="space-y-3 bg-slate-950/70 p-3.5 border border-slate-800 rounded-xl">
              {mixedDriveItems.map((item, idx) => {
                const driveInfo = getDualStorePricingInfo(item.hddModel.pricing);
                return (
                  <div key={idx} className="space-y-1 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <select
                        value={item.hddModel.id}
                        onChange={(e) => handleUpdateDriveModel(idx, e.target.value)}
                        className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500 transition cursor-pointer truncate"
                      >
                        {HARD_DRIVES.map((hdd) => {
                          const hInfo = getDualStorePricingInfo(hdd.pricing);
                          return (
                            <option key={hdd.id} value={hdd.id}>
                              {hdd.brand} {hdd.series} {hdd.capacityTb}TB ({hdd.rpm}轉/{hdd.warrantyYears}年保) [{hInfo.dropdownText}] - NT$ {hInfo.bestPrice.toLocaleString()}
                            </option>
                          );
                        })}
                      </select>

                      {/* Quantity Counter Buttons */}
                      <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateDriveCount(idx, -1)}
                          disabled={item.count <= 1}
                          className="px-2 py-1.5 text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                          title="減少顆數"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 font-mono font-bold text-xs text-slate-100 min-w-[36px] text-center">
                          {item.count} 顆
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateDriveCount(idx, 1)}
                          disabled={usedBays >= nasModel.bays}
                          className="px-2 py-1.5 text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                          title="增加顆數"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove row button (if multiple rows) */}
                      {mixedDriveItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDriveRow(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition cursor-pointer flex-shrink-0"
                          title="移除此硬碟組合"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Dual Store Pricing Row for This Specific HDD */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-0.5">
                      <span className="flex items-center gap-1.5">
                        <Store className="w-3 h-3 text-sky-400" />
                        原價屋: <strong className="text-slate-200">{driveInfo.coolpcText}</strong>
                        <span className="text-slate-600">|</span>
                        欣亞: <strong className="text-slate-200">{driveInfo.sinyaText}</strong>
                      </span>
                      {driveInfo.diffText && (
                        <span className="text-emerald-400 font-medium">{driveInfo.diffText}</span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Add New Drive Row Button */}
              {usedBays < nasModel.bays && (
                <button
                  type="button"
                  onClick={handleAddDriveRow}
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800/90 border border-dashed border-slate-700 hover:border-slate-500 text-sky-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  混搭另一款硬碟 (剩餘 {freeBays} 槽可配置)
                </button>
              )}
            </div>
          </div>

          {/* 3. RAID Mode Selector */}
          <div>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                RAID 磁碟陣列模式
              </span>

              {/* SHR-1 Hover Tooltip */}
              <div className="relative group inline-block">
                <span className="text-xs text-sky-400 font-medium flex items-center gap-1 cursor-help hover:text-sky-300 transition">
                  <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                  SHR-1 切片原理？
                </span>

                {/* Floating Tooltip Box */}
                <div className="absolute right-0 bottom-full mb-2 w-80 sm:w-96 p-4 bg-slate-950 border border-sky-600/80 rounded-2xl shadow-2xl z-50 text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto leading-relaxed animate-in fade-in zoom-in-95">
                  <div className="font-bold text-sky-300 text-sm border-b border-slate-800 pb-1.5 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Synology SHR-1 智慧切片技術原理
                  </div>
                  <p className="mb-2 text-slate-200">
                    傳統 RAID 5 混搭硬碟時會被最小硬碟容量限制（例如 18TB+14TB 只能當 14TB 算，多出容量全數浪費）。
                  </p>
                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 space-y-1 text-slate-300">
                    <div className="font-semibold text-sky-400">💡 SHR-1 垂直切片機制：</div>
                    <div>• 共同基礎容量（如 14TB）組合成 RAID 5（單碟容錯）。</div>
                    <div>• 多出的容量區塊（如 18TB 多出的 4TB）自動額外組合成 RAID 1（鏡像保護）。</div>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-slate-800 text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    不同容量硬碟混搭也能達成 0 空間浪費！
                  </div>
                </div>
              </div>
            </div>

            <select
              value={config.raidType}
              onChange={handleRaidChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500 transition cursor-pointer"
            >
              <option value="RAID5">RAID 5 (單碟容錯 / 推薦 / 至少 3 顆)</option>
              <option value="SHR1">Synology SHR-1 (智慧單碟容錯 / 混搭推薦首選)</option>
              <option value="RAID6">RAID 6 (雙碟容錯 / 高安全性 / 至少 4 顆)</option>
              <option value="RAID10">RAID 10 (極速讀寫 + 鏡像 / 偶數顆)</option>
              <option value="RAID1">RAID 1 (鏡像備份 / 2 顆)</option>
              <option value="RAID0">RAID 0 (無容錯 / 容量疊加)</option>
            </select>
          </div>

          {/* 4. RAM Expansion */}
          <div>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-sky-400" />
                記憶體 (RAM) 配置
              </span>
              <button
                type="button"
                onClick={() => onOpenHardwareGuide('ram')}
                className="text-xs text-sky-400 hover:text-sky-300 underline font-normal cursor-pointer"
              >
                RAM 影響與 TB傳輸？
              </button>
            </div>
            <select
              value={config.selectedRamId || 'none'}
              onChange={handleRamChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500 transition cursor-pointer"
            >
              <option value="none">
                標配 {nasModel.defaultRamGb}GB {nasModel.defaultRamType} (大檔傳輸/備份足夠) - NT$ 0
              </option>
              {RAM_MODULES.map((ram) => {
                const info = getDualStorePricingInfo(ram.pricing);
                return (
                  <option key={ram.id} value={ram.id}>
                    加購 +{ram.capacityGb}GB ({ram.brand} {ram.type}) [{info.dropdownText}] - 最低 NT$ {info.bestPrice.toLocaleString()}
                  </option>
                );
              })}
            </select>
          </div>

          {/* 5. M.2 NVMe SSD Expansion Section (NEW) */}
          <div>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" />
                M.2 NVMe 高速系統硬碟 / 快取選購
                <button
                  type="button"
                  onClick={() => onOpenHardwareGuide('m2')}
                  className="text-slate-400 hover:text-purple-300 cursor-pointer"
                  title="查看 M.2 系統碟 (Volume) vs 3.5 吋 Bay 硬碟之優勢說明"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </span>
              <span className="text-xs text-purple-400 font-medium">
                機身專屬 M.2 槽位 (不佔用 8 Bay)
              </span>
            </div>

            <div className="bg-slate-950/70 p-3.5 border border-slate-800 rounded-xl space-y-2.5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <select
                  value={m2SsdCount > 0 ? config.selectedM2SsdId || M2_SSD_MODULES[2].id : 'none'}
                  onChange={handleM2ModelChange}
                  className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500 transition cursor-pointer truncate"
                >
                  <option value="none">不加購 M.2 SSD (僅使用 3.5 吋硬碟)</option>
                  {M2_SSD_MODULES.map((m2) => {
                    const info = getDualStorePricingInfo(m2.pricing);
                    return (
                      <option key={m2.id} value={m2.id}>
                        {m2.brand} {m2.capacityGb}GB ({m2.readSpeedMb}MB/s) [{info.dropdownText}] - NT$ {info.bestPrice.toLocaleString()}
                      </option>
                    );
                  })}
                </select>

                {/* M.2 Quantity Buttons */}
                <div className="flex items-center justify-center bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleM2CountChange(Math.max(0, m2SsdCount - 1))}
                    disabled={m2SsdCount <= 0}
                    className="px-2.5 py-1.5 text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                    title="減少 M.2 顆數"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 font-mono font-bold text-xs text-slate-100 min-w-[48px] text-center">
                    {m2SsdCount === 0 ? '無' : `${m2SsdCount} 顆`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleM2CountChange(Math.min(2, m2SsdCount + 1))}
                    disabled={m2SsdCount >= nasModel.m2Slots}
                    className="px-2.5 py-1.5 text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                    title="增加 M.2 顆數 (最高 2 顆)"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* M.2 Usage Purpose Selector (if count > 0) */}
              {m2SsdCount > 0 && (
                <div className="pt-1 border-t border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">用途模式：</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleM2UsageChange('storage_pool')}
                        className={`px-2 py-1 rounded text-xs font-medium transition cursor-pointer ${
                          m2Usage === 'storage_pool'
                            ? 'bg-purple-600 text-white shadow'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                        title="建立獨立高速系統儲存集區，供 Docker、VM、套件與 Photos 高速運算"
                      >
                        🚀 系統儲存集區 (推薦)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleM2UsageChange('cache')}
                        className={`px-2 py-1 rounded text-xs font-medium transition cursor-pointer ${
                          m2Usage === 'cache'
                            ? 'bg-purple-600 text-white shadow'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                        title="作為大容量 HDD 陣列的隨機讀寫快取"
                      >
                        ⚡ 讀寫快取 (Cache)
                      </button>
                    </div>
                  </div>

                  {m2PriceInfo && (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-0.5">
                      <span className="flex items-center gap-1.5">
                        <Store className="w-3 h-3 text-purple-400" />
                        原: <strong className="text-slate-200">{m2PriceInfo.coolpcText}</strong> | 欣: <strong className="text-slate-200">{m2PriceInfo.sinyaText}</strong>
                      </span>
                      <span className="font-mono text-purple-300 font-semibold">
                        小計: NT$ {(m2PriceInfo.bestPrice * m2SsdCount).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 6. Optional Add-ons */}
          <div>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-sky-400" />
                擴充配件 (網卡 / 擴充櫃)
              </span>
              <button
                type="button"
                onClick={() => onOpenHardwareGuide('addons')}
                className="text-xs text-sky-400 hover:text-sky-300 underline font-normal cursor-pointer"
              >
                10G 與擴充用途？
              </button>
            </div>
            <div className="space-y-2.5">
              {ADDON_ACCESSORIES.map((addon) => {
                const isSelected = config.selectedAddonIds.includes(addon.id);
                const info = getDualStorePricingInfo(addon.pricing);
                const isNic10g = addon.type === 'nic_10g' && addon.id === 'synology-e10g18-t1';

                return (
                  <label
                    key={addon.id}
                    className={`block p-3 rounded-xl border text-xs cursor-pointer transition ${
                      isSelected
                        ? 'bg-sky-950/50 border-sky-600/90 text-sky-100 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0 pr-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleAddon(addon.id)}
                          className="mt-0.5 rounded border-slate-700 text-sky-500 focus:ring-0 cursor-pointer"
                        />
                        <div>
                          <div className="font-semibold text-slate-100 text-xs sm:text-sm flex flex-wrap items-center gap-1.5">
                            <span>{addon.name}</span>
                            {isNic10g && hasBuiltIn10G && (
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-950/90 border border-amber-800 px-1.5 py-0.5 rounded">
                                ⚡ 本機已內建10G (免加購)
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            原價屋: <strong className="text-slate-200">{info.coolpcText}</strong> | 欣亞: <strong className="text-slate-200">{info.sinyaText}</strong>
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-slate-200 flex-shrink-0 text-xs font-bold bg-slate-900/80 px-2 py-1 rounded-md border border-slate-700/60">
                        +NT$ {info.bestPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Actual Practical Function Explanation (實際作用說明) */}
                    <div className="mt-2 pt-2 border-t border-slate-700/50 text-[11px] text-slate-300 leading-relaxed pl-6">
                      <p className="text-sky-300/90">{addon.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Results Box */}
      <div className="mt-6 pt-5 border-t border-slate-800 space-y-3.5">
        {/* Storage Goal Achievement Box */}
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between ${
            storage.meets50TbTarget
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
              : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {storage.meets50TbTarget ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
            )}
            <div>
              <div className="font-bold text-sm">
                {storage.meets50TbTarget ? '🎉 達成 ≥ 50TB 採購目標' : '⚠️ 未達 50TB 採購目標'}
              </div>
              <div className="text-xs opacity-85">
                真實可用：<strong>{storage.usableTb} TB</strong> ({storage.usableTib} TiB)
                {storage.unallocatedTb > 0 && (
                  <span className="text-amber-400 ml-1">({storage.unallocatedTb}TB 未配置浪費)</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono font-bold">
              🛡️ 容許 {storage.faultToleranceDisks} 顆損壞
            </div>
            <div className="text-xs opacity-80">利用率 {storage.storageEfficiencyPercent}%</div>
          </div>
        </div>

        {/* Cost Matrix Summary */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2 text-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span>原價屋估算總價：</span>
            <span className="font-mono text-slate-200">
              {cost.totalCoolpc ? `NT$ ${cost.totalCoolpc.toLocaleString()}` : '部分品項缺貨/無報價'}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>欣亞數位估算總價：</span>
            <span className="font-mono text-slate-200">
              {cost.totalSinya ? `NT$ ${cost.totalSinya.toLocaleString()}` : '部分品項缺貨/無報價'}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-800">
            <span className="font-bold text-emerald-400 flex items-center gap-1 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              最低混搭預算：
            </span>
            <span className="text-base font-extrabold font-mono text-emerald-400">
              NT$ {cost.totalBest.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400 pt-0.5">
            <span>每可用 TB 建置成本：</span>
            <span className="font-mono font-semibold text-sky-400 text-sm">
              NT$ {cost.costPerUsableTb.toLocaleString()} / TB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
