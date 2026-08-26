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

          {/* 2. Unified Hard Drive Configuration Section */}
          <div>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <HddIcon className="w-4 h-4 text-sky-400" />
                硬碟選購與槽位配置
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

            {/* Dynamic Drive List (Unified presentation) */}
            <div className="space-y-2.5 bg-slate-950/70 p-3.5 border border-slate-800 rounded-xl">
              {mixedDriveItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={item.hddModel.id}
                    onChange={(e) => handleUpdateDriveModel(idx, e.target.value)}
                    className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500 transition cursor-pointer truncate"
                  >
                    {HARD_DRIVES.map((hdd) => (
                      <option key={hdd.id} value={hdd.id}>
                        {hdd.brand} {hdd.series} {hdd.capacityTb}TB ({hdd.rpm}轉/{hdd.warrantyYears}年保) - NT$ {hdd.pricing.bestPrice?.toLocaleString()}/顆
                      </option>
                    ))}
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
              ))}

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

          {/* 3. RAID Mode Selector with Hover Tooltip for SHR-1 */}
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
