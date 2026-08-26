import React, { useState } from 'react';
import { useComparisonStore } from '../store/useComparisonStore';
import { extractLatestTimestamps } from '../services/priceMatcher';
import { RefreshCw, Share2, Plus, RotateCcw, FileSpreadsheet, HardDrive, Info, Check } from 'lucide-react';

interface NavbarProps {
  onOpenExport: () => void;
  onOpenRamAdvice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenExport, onOpenRamAdvice }) => {
  const { priceDb, isRefreshing, refreshStatus, refreshPrices, addPlan, resetToDefaults } = useComparisonStore();
  const [copied, setCopied] = useState(false);
  const [showTimestampTooltip, setShowTimestampTooltip] = useState(false);

  const timestamps = priceDb
    ? extractLatestTimestamps(priceDb)
    : {
        rawTimestamp: '',
        coolpcFormatted: '載入中...',
        sinyaFormatted: '載入中...',
        globalFormatted: '載入中...',
      };

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error('Failed to copy share link:', err);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-sky-500 to-blue-700 rounded-xl shadow-md shadow-sky-500/20 text-white flex items-center justify-center">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-white tracking-tight">NAS 視覺化與即時比價系統</h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-sky-500/20 text-sky-400 rounded-full border border-sky-500/30">
                Synology DS1825+ 專題
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>目標容量 $\ge$ 50TB</span>
              <span>•</span>
              <span>預設 RAID 5</span>
              <span>•</span>
              <button
                onClick={onOpenRamAdvice}
                className="text-sky-400 hover:text-sky-300 underline font-medium inline-flex items-center gap-0.5"
              >
                <Info className="w-3 h-3" />
                RAM 影響與選配指南
              </button>
            </p>
          </div>
        </div>

        {/* Timestamps & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timestamp Indicator with Tooltip */}
          <div
            className="relative"
            onMouseEnter={() => setShowTimestampTooltip(true)}
            onMouseLeave={() => setShowTimestampTooltip(false)}
          >
            <div className="px-3 py-1.5 bg-slate-800/90 border border-slate-700/80 rounded-lg text-xs text-slate-300 flex items-center gap-2 cursor-help transition hover:border-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                報價時間：<strong className="text-slate-100 font-semibold">{timestamps.globalFormatted}</strong>
              </span>
            </div>

            {/* Hover Tooltip */}
            {showTimestampTooltip && (
              <div className="absolute right-0 top-full mt-2 w-72 p-3 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 text-xs text-slate-300 space-y-1.5 animate-in fade-in zoom-in-95">
                <div className="font-semibold text-slate-100 border-b border-slate-700 pb-1 flex items-center justify-between">
                  <span>📊 數據來源時間詳情</span>
                  <span className="text-[10px] text-sky-400">重整可刷新</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">原價屋報價：</span>
                  <span className="text-slate-200 font-mono">{timestamps.coolpcFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">欣亞數位報價：</span>
                  <span className="text-slate-200 font-mono">{timestamps.sinyaFormatted}</span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                  點擊右側「🔄 重新整理」按鈕可發送即時請求同步兩大電商最新報價。
                </p>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => refreshPrices()}
            disabled={isRefreshing}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition disabled:opacity-50"
            title="重新抓取原價屋與欣亞最新價格"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            <span>{isRefreshing ? '更新中...' : '重新整理報價'}</span>
          </button>

          {/* Share Button (URL Hash) */}
          <button
            onClick={handleShare}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition"
            title="複製當前配置與比價結果分享連結（URL Hash 零後端完整保存）"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? '已複製分享連結！' : '複製分享連結'}</span>
          </button>

          {/* Export CSV / Report */}
          <button
            onClick={onOpenExport}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
            title="匯出採購評估報表或 CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>匯出報表</span>
          </button>

          {/* Add Plan Button */}
          <button
            onClick={() => addPlan()}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
            title="新增一組比較方案"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增方案</span>
          </button>

          {/* Reset to Default */}
          <button
            onClick={resetToDefaults}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            title="重設為預設方案"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Refresh Status Toast Banner */}
      {refreshStatus.type !== 'idle' && (
        <div
          className={`mt-2 py-1 px-4 text-center text-xs rounded-md transition ${
            refreshStatus.type === 'loading'
              ? 'bg-sky-950/60 text-sky-300 border border-sky-800/50'
              : refreshStatus.type === 'success'
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
              : 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
          }`}
        >
          {refreshStatus.message}
        </div>
      )}
    </header>
  );
};
