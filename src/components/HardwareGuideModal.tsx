import React, { useState } from 'react';
import { X, Server, HardDrive, Cpu, Zap, Info } from 'lucide-react';

interface HardwareGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'nas' | 'hdd' | 'ram' | 'addons';
}

export const HardwareGuideModal: React.FC<HardwareGuideModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'nas',
}) => {
  const [activeTab, setActiveTab] = useState<'nas' | 'hdd' | 'ram' | 'addons'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col justify-between">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">NAS 採購評估與硬體配件選配指南</h3>
              <p className="text-xs text-slate-400">
                深入解析 NAS 主機型號定位、硬碟選購差異、記憶體 ECC 機制與擴充配件
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mt-4 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('nas')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'nas'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              1. NAS 主機型號對比
            </button>
            <button
              onClick={() => setActiveTab('hdd')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'hdd'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              2. 硬碟選購與 50TB 空間
            </button>
            <button
              onClick={() => setActiveTab('ram')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'ram'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              3. 記憶體 (RAM) 與 ECC 重要性
            </button>
            <button
              onClick={() => setActiveTab('addons')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'addons'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              4. 10GbE 網卡與 M.2 快取
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs text-slate-300 leading-relaxed">
          {/* TAB 1: NAS Models */}
          {activeTab === 'nas' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-sm text-sky-400 flex items-center gap-1.5">
                  <Server className="w-4 h-4" />
                  Synology 旗艦 8-Bay 機型定位（DS1825+ vs DS1825neo+）
                </div>
                <p>
                  對於目標建置 <strong>50TB 以上有效儲存容量</strong> 的團隊或企業，<strong>8-Bay 機型</strong> 是擴充彈性最高、最具投資效益的選擇。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-900 border border-sky-800/50 rounded-lg space-y-1.5">
                    <div className="font-bold text-sky-300 flex items-center justify-between">
                      <span>Synology DS1825+ (標準版)</span>
                      <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded">企業首選</span>
                    </div>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                      <li><strong>出廠標配 8GB ECC DDR4 記憶體</strong>，直接享有企業級錯誤修正能力。</li>
                      <li>配備 4 核心 AMD Ryzen V1500B 處理器、雙 2.5GbE 網路埠、雙 M.2 NVMe 插槽。</li>
                      <li>具備 PCIe 3.0 x8 (x4 頻寬) 擴充槽，可升級 10GbE / 25GbE 高速網卡。</li>
                      <li>支援加掛 2 台 DX525 擴充櫃（最高擴充至 18 Bay）。</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg space-y-1.5">
                    <div className="font-bold text-emerald-300 flex items-center justify-between">
                      <span>Synology DS1825neo+ (預算親民版)</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">高 CP 值</span>
                    </div>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                      <li>硬體核心架構（主機板、CPU、8-Bay 機構、雙 2.5GbE）與 DS1825+ 完全相同。</li>
                      <li><strong>出廠預載 4GB non-ECC 記憶體</strong>，主機售價比標準版更便宜約 NT$ 3,000 元。</li>
                      <li>未來同樣支援最高升級至 32GB ECC 記憶體（升級時需將原廠 4GB 拔下替換）。</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-xs text-slate-200">為什麼不優先選擇 4-Bay (DS923+) 或 5-Bay (DS1522+)？</div>
                <p className="text-slate-400">
                  建置 50TB 有效容量若採用 4-Bay NAS (RAID 5)，必須購買 4 顆 18TB 或 20TB 硬碟，<strong>4 個槽位將直接全部插滿</strong>。未來一旦空間不足，無法透過「加裝硬碟」無痛擴充，必須承擔高成本整批更換大容量硬碟。
                  而 <strong>8-Bay 機型先插 4 顆即達成 54TB (RAID 5)，還保留 4 個空槽</strong>，未來只需隨插隨加即可在線擴充容量！
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: HDDs */}
          {activeTab === 'hdd' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4" />
                  NAS 專用硬碟品牌與系列選購要點
                </div>
                <p>NAS 專用硬碟專為 24x7 小時不間斷運轉、多硬碟共振抑制（RV 感測器）與 RAID 錯誤復原（TLER/ERC）設計：</p>
                <div className="space-y-2.5 pt-1">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="font-bold text-slate-100 flex items-center justify-between">
                      <span>Seagate IronWolf Pro (那嘶狼 Pro) 16TB / 18TB / 20TB</span>
                      <span className="text-[10px] text-sky-400 font-mono">7200轉 / 550TB/年 / 5年保+5年原廠Rescue資料救援</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      市場主流首選，具備 5 年原廠免費資料救援服務（Rescue Data Recovery），對企業重要資料多一層意外保障。
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="font-bold text-slate-100 flex items-center justify-between">
                      <span>Western Digital Red Pro (紅標 Pro) 18TB</span>
                      <span className="text-[10px] text-amber-400 font-mono">7200轉 / 512MB 快取 / 550TB/年 / 5年保</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      配備超大 512MB 快取與 3D Active Balance Plus 雙面平衡技術，適合高負載多使用者企業存取。
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="font-bold text-slate-100 flex items-center justify-between">
                      <span>Toshiba N300 14TB / 16TB</span>
                      <span className="text-[10px] text-emerald-400 font-mono">7200轉 / 512MB 快取 / 180TB/年 / 3年保</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      單 TB 建置成本最低的價格破壞者，若預算有限且追求每 TB 成本極致划算，Toshiba 14TB/16TB 為首選。
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                <div className="font-bold text-xs text-slate-200">50TB 採購目標之推薦硬碟組合（RAID 5）</div>
                <div className="text-[11px] text-slate-300">
                  • <strong>4 顆 18TB (RAID 5)</strong>：有效可用 <strong>54 TB (49.11 TiB)</strong>，初期花費適中，空出 4 槽位。<br/>
                  • <strong>4 顆 20TB (RAID 5)</strong>：有效可用 <strong>60 TB (54.57 TiB)</strong>，實體突破 50 TiB 門檻。<br/>
                  • <strong>5 顆 14TB (RAID 5)</strong>：有效可用 <strong>56 TB (50.93 TiB)</strong>，均攤成本低，空出 3 槽位。
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RAM & ECC */}
          {activeTab === 'ram' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  為什麼 NAS 需要 ECC 記憶體？為什麼原廠記憶體較貴？
                </div>
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="font-semibold text-slate-200">1. ECC (錯誤校正碼) 的核心價值：防止靜態資料損毀</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      當 NAS 管理 50TB 以上巨量資料時，記憶體中每秒處理數萬筆讀寫。一般的 non-ECC 記憶體若遭受宇宙射線或電氣雜訊引起單元翻轉（Bit Flip），錯誤的資料將會被<strong>直接寫入硬碟儲存</strong>，導致檔案無聲損壞（Silent Data Corruption）。<strong>ECC 記憶體能在硬體層級即時偵測並修正單元錯誤</strong>，保護重要備份與企業資料庫安全。
                    </p>
                  </div>

                  <div>
                    <div className="font-semibold text-slate-200">2. 原廠記憶體 vs 副廠/相容記憶體差異</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      • <strong>Synology 原廠記憶體</strong>：經過群暉官方完整相容性測試與韌體簽署，DSM 系統不會跳出「非原廠記憶體」相容性警告，且享有群暉原廠保固支援。<br/>
                      • <strong>創見 / 金士頓相容 ECC 記憶體</strong>：採用相同 DDR4-3200 ECC SODIMM 規格，價格僅為原廠約 1/3，功能正常，唯部分 DSM 版本可能在系統日誌提示非原廠模組。
                    </p>
                  </div>

                  <div>
                    <div className="font-semibold text-slate-200">3. DS1825+ 標配 8GB ECC 是否足夠？</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      • <strong>日常檔案共享、備份與 Synology Photos/Drive</strong>：8GB 非常充裕（系統閒置約佔 2GB，其餘 6GB 自動做為檔案快取）。<br/>
                      • <strong>Container Manager (Docker) 或 虛擬機 (VM)</strong>：若要運行多個資料庫/應用容器或 Windows 虛擬機，強烈建議加裝 1 條 16GB ECC（總計 24GB）或升級至 32GB (16G x 2)。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Addons & Networking */}
          {activeTab === 'addons' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-sm text-purple-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  10GbE 高速網路擴充卡與 M.2 NVMe SSD 快取
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5">
                    <div className="font-bold text-slate-100 flex items-center justify-between">
                      <span>10GbE 網路擴充卡 (E10G18-T1)</span>
                      <span className="text-[10px] text-sky-400 font-mono">PCIe 3.0 x4 RJ-45</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      DS1825+ 原生標配雙 2.5GbE 網路埠（傳輸約 280 MB/s）。若團隊有 4K/8K 影音即時剪輯、大量虛擬機讀寫需求，加裝 10GbE 網卡可將傳輸頻寬提升至 <strong>1000+ MB/s</strong>，大幅提升團隊工作效率。
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5">
                    <div className="font-bold text-slate-100 flex items-center justify-between">
                      <span>M.2 NVMe SSD (SNV3410 800G)</span>
                      <span className="text-[10px] text-purple-400 font-mono">企業級高耐寫度 M.2</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      DS1825+ 內建雙 M.2 2280 插槽，不僅可做為<strong>讀寫快取 (Read/Write Cache)</strong> 加速資料庫與小檔案隨機讀寫 IOPS，更支援直接建立 <strong>全快閃 M.2 儲存集區 (Storage Pool)</strong> 供虛擬機或 Docker 高速運行。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition"
          >
            關閉指南
          </button>
        </div>
      </div>
    </div>
  );
};
