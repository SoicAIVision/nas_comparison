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
  Shuffle,
  Layers,
  Plus,
  Minus,
  Sparkles,
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
  const {
    config,
    nasModel,
    hddModel,
    isMixedDrives,
    mixedDriveItems,
    storage,
    cost,
    usedBays,
    freeBays,
    compatibilityWarnings,
    shrAdvantageTb,
  } = evaluation;

  const handleNasChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNasId = e.target.value;
    const targetNas = NAS_MODELS.find((m) => m.id === newNasId);
    let newHddCount = config.hddCount;
    if (targetNas && newHddCount > targetNas.bays) {
      newHddCount = targetNas.bays;
    }
    updatePlan(config.id, { nasModelId: newNasId, hddCount: newHddCount });
  };

  // Toggle between Single Drive mode and Mixed Drive mode
  const handleToggleMixedMode = (enableMixed: boolean) => {
    if (enableMixed) {
      // Initialize mixed drives array from current single drive
      const initialMixed = [
        { hddModelId: config.hddModelId, count: Math.max(2, Math.floor(config.hddCount / 2)) },
        {
          hddModelId:
            HARD_DRIVES.find((h) => h.id !== config.hddModelId)?.id || HARD_DRIVES[1].id,
          count: Math.max(1, config.hddCount - Math.max(2, Math.floor(config.hddCount / 2))),
        },
      ];
      updatePlan(config.id, { isMixedDrives: true, mixedDrives: initialMixed });
    } else {
      // Revert back to single drive mode
      const primaryId = config.mixedDrives?.[0]?.hddModelId || config.hddModelId;
      updatePlan(config.id, { isMixedDrives: false, hddModelId: primaryId, hddCount: usedBays });
    }
  };

  const handleSingleHddChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePlan(config.id, { hddModelId: e.target.value });
  };

  const handleSingleDiskCountChange = (count: number) => {
    updatePlan(config.id, { hddCount: count });
  };

  // Mixed Drives Handlers
  const handleUpdateMixedDriveModel = (index: number, newModelId: string) => {
    const current = config.mixedDrives ? [...config.mixedDrives] : [];
    if (current[index]) {
      current[index] = { ...current[index], hddModelId: newModelId };
      updatePlan(config.id, { mixedDrives: current });
    }
  };

  const handleUpdateMixedDriveCount = (index: number, delta: number) => {
    const current = config.mixedDrives ? [...config.mixedDrives] : [];
    if (current[index]) {
      const newCount = current[index].count + delta;
      if (newCount <= 0) return;
      // Check total bay limit
      const otherBays = current.reduce((sum, item, idx) => (idx === index ? sum : sum + item.count), 0);
      if (otherBays + newCount > nasModel.bays) return;

      current[index] = { ...current[index], count: newCount };
      updatePlan(config.id, { mixedDrives: current });
    }
  };

  const handleAddMixedDriveRow = () => {
    const current = config.mixedDrives ? [...config.mixedDrives] : [];
    if (usedBays >= nasModel.bays) return;
    // Find an unused HDD model or default
    const availableHdd =
      HARD_DRIVES.find((h) => !current.some((c) => c.hddModelId === h.id)) || HARD_DRIVES[0];
    current.push({ hddModelId: availableHdd.id, count: 1 });
    updatePlan(config.id, { mixedDrives: current });
  };

  const handleRemoveMixedDriveRow = (index: number) => {
    const current = config.mixedDrives ? [...config.mixedDrives] : [];
    if (current.length <= 1) return;
    current.splice(index, 1);
    updatePlan(config.id, { mixedDrives: current });
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
            <div className="flex items-center gap-2 mt-1 px-1">
              <span className="text-xs font-semibold text-sky-400 bg-sky-950/70 border border-sky-800/70 px-2.5 py-0.5 rounded-md flex-shrink-0">
                {nasModel.name}
              </span>
              <span className="text-sm text-slate-400 truncate">
                {isMixedDrives
                  ? `混搭 ${usedBays} 顆硬碟 (${config.raidType})`
                  : `${config.hddCount} 顆 × ${hddModel.capacityTb}TB (${config.raidType})`}
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

        {/* Compatibility Warnings */}
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
                  title="查看各機型特色與選購差異"
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
              {NAS_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.bays} Bay / {model.defaultRamGb}GB {model.defaultRamType} / {model.ethernetPorts}) - NT$ {model.pricing.bestPrice?.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Hard Drive Mode Header (Single vs Mixed Mode Toggle) */}
          <div>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <HddIcon className="w-4 h-4 text-sky-400" />
                硬碟配置模式
                <button
                  type="button"
                  onClick={() => onOpenHardwareGuide('hdd')}
                  className="text-slate-400 hover:text-sky-300 cursor-pointer"
                  title="查看硬碟品牌、混搭防暴斃與保固指南"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </span>

              {/* Mode Toggle Button */}
              <button
                type="button"
                onClick={() => handleToggleMixedMode(!isMixedDrives)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                  isMixedDrives
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
                title="切換單一型號配置或多品牌/容量混搭模式"
              >
                {isMixedDrives ? (
                  <>
                    <Shuffle className="w-3.5 h-3.5" />
                    混搭模式中
                  </>
                ) : (
                  <>
                    <Layers className="w-3.5 h-3.5" />
                    切換混搭不同型號
                  </>
                )}
              </button>
            </div>

            {/* SINGLE DRIVE MODE */}
            {!isMixedDrives ? (
              <div className="space-y-3">
                <div className="relative">
                  <select
                    value={config.hddModelId}
                    onChange={handleSingleHddChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500 transition cursor-pointer"
                  >
                    {HARD_DRIVES.map((hdd) => (
                      <option key={hdd.id} value={hdd.id}>
                        {hdd.brand} {hdd.series} {hdd.capacityTb}TB ({hdd.rpm}轉/{hdd.warrantyYears}年保) - NT$ {hdd.pricing.bestPrice?.toLocaleString()}/顆
                      </option>
                    ))}
                  </select>
                </div>

                {/* Single Bay Occupancy & Slots */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span>硬碟數量：{config.hddCount} 顆</span>
                    <span className="text-sky-400 font-mono">
                      佔用 {usedBays} / {nasModel.bays} Bay (剩餘 {freeBays} 空槽)
                    </span>
                  </div>

                  <div className="grid grid-cols-8 gap-2">
                    {Array.from({ length: nasModel.bays }).map((_, idx) => {
                      const isOccupied = idx < config.hddCount;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSingleDiskCountChange(idx + 1)}
                          className={`h-8 rounded-lg text-xs font-bold flex items-center justify-center transition cursor-pointer ${
                            isOccupied
                              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                              : 'bg-slate-800/90 text-slate-500 border border-dashed border-slate-700 hover:border-slate-500'
                          }`}
                          title={`點擊設定為 ${idx + 1} 顆硬碟`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* MIXED DRIVES MODE */
              <div className="space-y-2.5 bg-slate-950/70 p-3.5 border border-purple-900/50 rounded-xl">
                <div className="flex items-center justify-between text-xs text-purple-300 pb-1 border-b border-purple-950">
                  <span className="font-semibold flex items-center gap-1">
                    <Shuffle className="w-3.5 h-3.5" />
                    多型號/品牌硬碟混搭配單
                  </span>
                  <span className="font-mono font-bold text-sky-400">
                    總計已選 {usedBays} / {nasModel.bays} Bay ({freeBays} 空槽)
                  </span>
                </div>

                {/* Mixed Rows */}
                {mixedDriveItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={item.hddModel.id}
                      onChange={(e) => handleUpdateMixedDriveModel(idx, e.target.value)}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500 transition cursor-pointer"
                    >
                      {HARD_DRIVES.map((hdd) => (
                        <option key={hdd.id} value={hdd.id}>
                          {hdd.brand} {hdd.series} {hdd.capacityTb}TB (NT$ {hdd.pricing.bestPrice?.toLocaleString()})
                        </option>
                      ))}
                    </select>

                    {/* Counter Buttons */}
                    <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleUpdateMixedDriveCount(idx, -1)}
                        disabled={item.count <= 1}
                        className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-mono font-bold text-xs text-slate-100">
                        {item.count} 顆
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateMixedDriveCount(idx, 1)}
                        disabled={usedBays >= nasModel.bays}
                        className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Remove row */}
                    {mixedDriveItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMixedDriveRow(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                        title="移除此硬碟組合"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Add Row Button */}
                {usedBays < nasModel.bays && (
                  <button
                    type="button"
                    onClick={handleAddMixedDriveRow}
                    className="w-full py-1.5 px-3 bg-purple-950/60 hover:bg-purple-900/60 border border-dashed border-purple-700/60 text-purple-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    新增另一款硬碟組合 (剩餘 {freeBays} 槽可用)
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 3. RAID Mode Selector */}
          <div>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-300 mb-1.5">
              <span>RAID 磁碟陣列模式</span>
              <span className="text-xs text-slate-400 font-normal">
                {isMixedDrives ? '混搭推薦：Synology SHR-1' : '預設建議：RAID 5'}
              </span>
            </div>
            <select
              value={config.raidType}
              onChange={handleRaidChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500 transition cursor-pointer"
            >
              <option value="RAID5">RAID 5 (單碟容錯 / 推薦 / 至少 3 顆)</option>
              <option value="SHR1">Synology SHR-1 (智慧單碟容錯 / 混搭首選)</option>
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
              {RAM_MODULES.map((ram) => (
                <option key={ram.id} value={ram.id}>
                  加購 +{ram.capacityGb}GB ({ram.brand} {ram.type}) - NT$ {ram.pricing.bestPrice?.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Optional Add-ons */}
          <div>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-sky-400" />
                擴充配件 (網卡 / 快取)
              </span>
              <button
                type="button"
                onClick={() => onOpenHardwareGuide('addons')}
                className="text-xs text-sky-400 hover:text-sky-300 underline font-normal cursor-pointer"
              >
                10G 與快取用途？
              </button>
            </div>
            <div className="space-y-2">
              {ADDON_ACCESSORIES.map((addon) => {
                const isSelected = config.selectedAddonIds.includes(addon.id);
                return (
                  <label
                    key={addon.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition ${
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
                        className="rounded border-slate-700 text-sky-500 focus:ring-0 cursor-pointer"
                      />
                      <span className="font-medium text-slate-200 truncate text-xs">{addon.name}</span>
                    </div>
                    <span className="font-mono text-slate-300 flex-shrink-0 text-xs">
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
              {cost.totalCoolpc ? `NT$ ${cost.totalCoolpc.toLocaleString()}` : '品項缺貨/無報價'}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>欣亞數位估算總價：</span>
            <span className="font-mono text-slate-200">
              {cost.totalSinya ? `NT$ ${cost.totalSinya.toLocaleString()}` : '品項缺貨/無報價'}
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
