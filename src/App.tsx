import React, { useEffect, useState, useRef } from 'react';
import { useComparisonStore } from './store/useComparisonStore';
import { Navbar } from './components/Navbar';
import { PlanCard } from './components/PlanCard';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { VisualCharts } from './components/VisualCharts';
import { HardwareGuideModal } from './components/HardwareGuideModal';
import { ExportModal } from './components/ExportModal';
import { PriceOverrideModal } from './components/PriceOverrideModal';
import { Plus, Sliders, ShieldCheck, Sparkles, ExternalLink, BookOpen, CheckCircle, X } from 'lucide-react';

export const App: React.FC = () => {
  const { init, getEvaluatedPlans, addPlan, toastNotification, dismissToast } = useComparisonStore();
  const planSectionRef = useRef<HTMLDivElement>(null);

  const [guideModalConfig, setGuideModalConfig] = useState<{
    isOpen: boolean;
    tab: 'nas' | 'hdd' | 'ram' | 'm2' | 'addons';
  }>({
    isOpen: false,
    tab: 'nas',
  });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [overrideTarget, setOverrideTarget] = useState<{
    itemId: string;
    itemName: string;
    defaultPrice: number;
  } | null>(null);

  useEffect(() => {
    init();
  }, [init]);

  // Auto-scroll and auto-dismiss toast when plan is added
  useEffect(() => {
    if (toastNotification) {
      // Smooth scroll to the plan cards section
      if (planSectionRef.current) {
        planSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      const timer = setTimeout(() => {
        dismissToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastNotification, dismissToast]);

  const evaluations = getEvaluatedPlans();

  const handleOpenGuide = (tab: 'nas' | 'hdd' | 'ram' | 'm2' | 'addons' = 'nas') => {
    setGuideModalConfig({ isOpen: true, tab });
  };

  const handleAddPlanClick = () => {
    addPlan();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenHardwareGuide={() => handleOpenGuide('nas')}
      />

      {/* Main Content Area - Full width with comfortable side margins */}
      <main className="flex-1 max-w-[98%] 2xl:max-w-[1850px] w-full mx-auto px-3 sm:px-5 lg:px-6 py-5 space-y-7">
        {/* Intro / Mission Banner */}
        <div className="bg-gradient-to-r from-sky-950/80 via-slate-900/90 to-slate-900/90 border border-sky-900/60 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="max-w-4xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              企業/團隊 NAS 採購決策指南
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Synology 8-Bay 旗艦（DS1825+ / neo+）與 ≥ 50TB 方案配置評估
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              透過即時抓取 <strong>原價屋 (CoolPC)</strong> 與 <strong>欣亞數位 (Sinya)</strong> 價格，自動試算 RAID 5 / SHR 可用儲存容量（TB/TiB）、單 TB 建置成本與最佳混搭採購預算。
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>預設 RAID 5 單碟容錯保護</span>
            </div>
            <span>•</span>
            <div>目標有效容量：<strong className="text-slate-200">50 TB (約 45.5 TiB) 以上</strong></div>
            <span>•</span>
            <button
              onClick={() => handleOpenGuide('nas')}
              className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-medium transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              完整硬體選配與採購指南
            </button>
            <span>•</span>
            <a
              href="https://www.synology.com/zh-tw/products/DS1825+?lang=zh-tw#features"
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 transition"
            >
              Synology DS1825+ 原廠規格介紹 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Plan Cards Grid Section */}
        <section ref={planSectionRef} className="space-y-3 scroll-mt-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white">方案自訂與硬體配置 ({evaluations.length} 組比較方案)</h3>
            </div>
            <button
              onClick={handleAddPlanClick}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              新增比較方案
            </button>
          </div>

          {/* In-page Non-popup Toast Notification Banner */}
          {toastNotification && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-700/80 rounded-xl text-xs text-emerald-200 flex items-center justify-between shadow-lg animate-in slide-in-from-top-2 fade-in">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{toastNotification}</span>
              </div>
              <button
                onClick={dismissToast}
                className="p-1 text-emerald-400 hover:text-emerald-100 hover:bg-emerald-900/60 rounded-md transition"
                title="關閉提示"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {evaluations.map((evaluation) => (
              <PlanCard
                key={evaluation.config.id}
                evaluation={evaluation}
                onOpenHardwareGuide={handleOpenGuide}
                onOpenPriceOverride={(itemId, itemName, defaultPrice) =>
                  setOverrideTarget({ itemId, itemName, defaultPrice })
                }
              />
            ))}
          </div>
        </section>

        {/* Comparison Matrix Table */}
        <section>
          <ComparisonMatrix evaluations={evaluations} />
        </section>

        {/* Visualization Charts */}
        <section>
          <VisualCharts evaluations={evaluations} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-[98%] 2xl:max-w-[1850px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>NAS 視覺化與即時比價系統 • 支援 GitHub Pages 靜態部署與 URL Hash 狀態分享</div>
          <div className="flex items-center gap-3 text-[11px]">
            <a href="https://www.coolpc.com.tw/tw/" target="_blank" rel="noreferrer" className="hover:text-slate-400 transition">原價屋</a>
            <span>•</span>
            <a href="https://www.sinya.com.tw/" target="_blank" rel="noreferrer" className="hover:text-slate-400 transition">欣亞數位</a>
            <span>•</span>
            <a href="https://www.synology.com/zh-tw" target="_blank" rel="noreferrer" className="hover:text-slate-400 transition">Synology 官網</a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HardwareGuideModal
        isOpen={guideModalConfig.isOpen}
        defaultTab={guideModalConfig.tab}
        onClose={() => setGuideModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        evaluations={evaluations}
      />

      {overrideTarget && (
        <PriceOverrideModal
          isOpen={!!overrideTarget}
          onClose={() => setOverrideTarget(null)}
          itemId={overrideTarget.itemId}
          itemName={overrideTarget.itemName}
          defaultPrice={overrideTarget.defaultPrice}
        />
      )}
    </div>
  );
};
export default App;
