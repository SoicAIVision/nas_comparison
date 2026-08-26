import React, { useState } from 'react';
import { X, Server, HardDrive, Cpu, Zap, Info, AlertOctagon, CheckCircle2, ArrowRight } from 'lucide-react';

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
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] flex flex-col justify-between cursor-default"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition cursor-pointer"
          title="關閉指南 (亦可點擊外部空白處關閉)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl flex-shrink-0">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">NAS 採購評估與硬體配件選配指南</h3>
              <p className="text-sm text-slate-400 mt-0.5">
                深入解析 NAS 主機型號定位、硬碟選購差異、記憶體 ECC 機制與擴充配件
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2.5 mt-5 border-b border-slate-800 pb-2.5">
            <button
              onClick={() => setActiveTab('nas')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'nas'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Server className="w-4 h-4" />
              1. NAS 主機型號對比
            </button>
            <button
              onClick={() => setActiveTab('hdd')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'hdd'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              2. 硬碟選購與 50TB 空間
            </button>
            <button
              onClick={() => setActiveTab('ram')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'ram'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Cpu className="w-4 h-4" />
              3. 記憶體 (RAM) 與 TB傳輸需求
            </button>
            <button
              onClick={() => setActiveTab('addons')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'addons'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Zap className="w-4 h-4" />
              4. 10GbE 網卡與 M.2 快取
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto pr-1.5 space-y-4 text-sm text-slate-300 leading-relaxed">
          {/* TAB 1: NAS Models */}
          {activeTab === 'nas' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2.5">
                <div className="font-bold text-base text-sky-400 flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Synology 旗艦 8-Bay 機型定位（DS1825+ vs DS1825neo+）
                </div>
                <p>
                  對於目標建置 <strong>50TB 以上有效儲存容量</strong> 的團隊或企業，<strong>8-Bay 機型</strong> 是擴充彈性最高、最具投資效益的選擇。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-3.5 bg-slate-900 border border-sky-800/60 rounded-xl space-y-2">
                    <div className="font-bold text-base text-sky-300 flex items-center justify-between">
                      <span>Synology DS1825+ (標準版)</span>
                      <span className="text-xs bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded">企業首選</span>
                    </div>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 text-xs sm:text-sm">
                      <li><strong>出廠標配 8GB ECC DDR4 記憶體</strong>，直接享有企業級錯誤修正保護。</li>
                      <li>配備 4 核心 AMD Ryzen V1500B 處理器、雙 2.5GbE 網路埠、雙 M.2 NVMe 插槽。</li>
                      <li>具備 PCIe 3.0 x8 (x4 頻寬) 擴充槽，可升級 10GbE / 25GbE 高速網卡。</li>
                      <li>支援加掛 2 台 DX525 擴充櫃（最高擴充至 18 Bay）。</li>
                    </ul>
                  </div>

                  <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-xl space-y-2">
                    <div className="font-bold text-base text-emerald-300 flex items-center justify-between">
                      <span>Synology DS1825neo+ (預算親民版)</span>
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">高 CP 值</span>
                    </div>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 text-xs sm:text-sm">
                      <li>硬體核心架構（主機板、CPU、8-Bay 機構、雙 2.5GbE）與 DS1825+ 完全相同。</li>
                      <li><strong>出廠預載 4GB non-ECC 記憶體</strong>，主機售價比標準版更便宜約 NT$ 3,000 元。</li>
                      <li>未來同樣支援最高升級至 32GB ECC 記憶體（升級時需將原廠 4GB 拔下替換）。</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-sky-400" />
                  DS1825+ 是否有限制 3.5 吋或 2.5 吋硬碟？
                </div>
                <p className="text-slate-400 text-xs sm:text-sm">
                  <strong>完全沒有限制，DS1825+ 原生通用支援 3.5 吋與 2.5 吋！</strong>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                    <strong className="text-slate-200 block mb-0.5">1. 3.5 吋 SATA HDD</strong>
                    <span className="text-slate-400">免工具卡扣托盤，50TB 以上巨量儲存首選（單碟可達 14TB~24TB）。</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                    <strong className="text-slate-200 block mb-0.5">2. 2.5 吋 SATA SSD / HDD</strong>
                    <span className="text-slate-400">托盤底部預留標準 2.5 吋螺絲孔，可安裝 2.5 吋 SATA 固態硬碟。</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                    <strong className="text-slate-200 block mb-0.5">3. 雙 M.2 2280 NVMe SSD</strong>
                    <span className="text-slate-400">機身底部專屬免工具快拆槽，可用於讀寫快取或建立全快閃儲存池。</span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-sm text-slate-200">為什麼不優先選擇 4-Bay (DS923+) 或 5-Bay (DS1522+)？</div>
                <p className="text-slate-400 text-xs sm:text-sm">
                  建置 50TB 有效容量若採用 4-Bay NAS (RAID 5)，必須購買 4 顆 18TB 或 20TB 硬碟，<strong>4 個槽位將直接全部插滿</strong>。未來一旦空間不足，無法透過「加裝硬碟」無痛擴充，必須承擔高成本整批更換大容量硬碟。
                  而 <strong>8-Bay 機型先插 4 顆即達成 54TB (RAID 5)，還保留 4 個空槽</strong>，未來只需隨插隨加即可在線擴充容量！
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: HDDs */}
          {activeTab === 'hdd' && (
            <div className="space-y-4">
              {/* Special Warning: Why NOT regular Desktop PC Hard Drives */}
              <div className="p-4 sm:p-5 bg-rose-950/40 border border-rose-800/60 rounded-xl space-y-3">
                <div className="font-bold text-base text-rose-300 flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  為什麼必須使用 NAS 專用硬碟？能不能拿一般便宜的桌上型 PC 硬碟來用？
                </div>
                <p className="text-rose-200/90 leading-relaxed text-xs sm:text-sm">
                  許多人會好奇：「一般桌機硬碟便宜不少，能不能買來裝在 NAS 裡？」答案是：<strong>強烈不建議，尤其在 8-Bay 機型與 RAID 陣列環境下極易發生災難性故障！</strong>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1 text-slate-200">
                  <div className="p-3.5 bg-slate-900/80 border border-rose-900/40 rounded-xl space-y-1.5">
                    <div className="font-bold text-rose-300 text-sm">1. 多硬碟旋轉共振 (RV 感測器)</div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      8-Bay 機箱內多顆硬碟同時旋轉會產生巨大的震動共振。<strong>一般 PC 硬碟沒有旋轉震動感測器 (RV Sensors)</strong>，在多碟共振下會造成讀寫磁頭劇烈抖動偏移，導致嚴重的傳輸掉速、讀寫錯誤甚至<strong>磁頭直接劃傷碟盤造成實體壞軌</strong>。NAS 碟均內建硬體 RV 震動感測器能即時動態補償。
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-900/80 border border-rose-900/40 rounded-xl space-y-1.5">
                    <div className="font-bold text-rose-300 text-sm">2. 錯誤復原控制 (TLER) 與 RAID「掉盤」危機</div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      一般 PC 碟遇到讀取小錯誤時，會嘗試自行修復長達 <strong>30~60 秒</strong>（畫面卡死）。但在 NAS 的 RAID 5 陣列中，RAID 控制器只要 <strong>7~8 秒</strong> 得不到硬碟回應，就會<strong>直接判定該硬碟故障並將其「強制踢出陣列 (Drop Drive)」</strong>，造成 RAID 降級甚至崩潰！NAS 碟具備 <strong>TLER (限時錯誤復原)</strong>，7 秒內會主動將錯誤交由 RAID 奇偶校驗即時修復，不會輕易掉盤。
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-900/80 border border-rose-900/40 rounded-xl space-y-1.5">
                    <div className="font-bold text-rose-300 text-sm">3. 24x7 運轉壽命與工作負載量 (MTBF)</div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      一般 PC 碟是依照「每天開機 8 小時、每年 55 TB 讀寫量」設計；NAS 碟則是為 <strong>24x7 全年無休連續運轉、每年 180~550 TB 企業級負載量</strong> 設計，平均故障間隔 (MTBF) 高達 100~250 萬小時。
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-900/80 border border-rose-900/40 rounded-xl space-y-1.5">
                    <div className="font-bold text-rose-300 text-sm">4. CMR 傳統記錄 vs SMR 疊瓦陷阱</div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      市售許多便宜 PC 碟採用 SMR (疊瓦式記錄)，在 RAID 陣列重建 (Rebuild) 時會發生<strong>斷崖式掉速（降至 1~5 MB/s）甚至逾時造成重建失敗</strong>。所有推薦的 NAS 專用碟保證全系列採用 <strong>CMR (傳統垂直磁記錄)</strong>。
                    </p>
                  </div>
                </div>
              </div>

              {/* Mixed Drive Guide: Mixing Different Models & SHR Advantage */}
              <div className="p-4 sm:p-5 bg-purple-950/40 border border-purple-800/60 rounded-xl space-y-3">
                <div className="font-bold text-base text-purple-300 flex items-center gap-2">
                  <Server className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  硬碟可以買不同型號混搭嗎？（防集體暴斃 vs 空間利用）
                </div>
                <p className="text-purple-200/90 text-xs sm:text-sm leading-relaxed">
                  <strong>答案是：完全可以，甚至在進階實務上「同容量跨品牌混搭」是強烈推薦的最佳防禦策略！</strong>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1 text-slate-200">
                  <div className="p-3.5 bg-slate-900/80 border border-purple-900/40 rounded-xl space-y-1.5">
                    <div className="font-bold text-purple-300 text-sm">1. 同容量跨品牌混搭（例如 2x Seagate 18TB + 2x WD 18TB）</div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      💡 <strong>防止同批次集體陣亡：</strong> 一次買 4 顆同廠牌同出廠批次的硬碟，生命衰退曲線相同。當第 1 顆故障觸發漫長的 RAID 重建讀寫時，同批次其他硬碟極易因高負載接連暴斃。混搭不同品牌或跨店家採購可錯開故障週期，大幅提升陣列安全性！
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-900/80 border border-purple-900/40 rounded-xl space-y-1.5">
                    <div className="font-bold text-purple-300 text-sm">2. 不同容量混搭（例如 2x 18TB + 3x 14TB）</div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      💡 <strong>推薦選用 Synology SHR-1：</strong> 傳統 RAID 5 會受限於最小的 14TB（多出的 8TB 空間會被無情浪費）；而 Synology 獨家 <strong>SHR-1 (智慧陣列)</strong> 則能自動分層重組，將剩餘空間組合成 RAID 1，<strong>達成 60TB 完全零浪費全部可用</strong>！
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RAM & TB Transfer Analysis */}
          {activeTab === 'ram' && (
            <div className="space-y-4">
              {/* Dedicated TB-level Transfer analysis */}
              <div className="p-4 sm:p-5 bg-sky-950/40 border border-sky-800/60 rounded-xl space-y-3">
                <div className="font-bold text-base text-sky-300 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-sky-400 flex-shrink-0" />
                  【關鍵問題解答】團隊有 TB 級大檔上傳/下載需求，8GB RAM 到底夠用嗎？
                </div>
                
                <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    核心結論：純 TB 級「大檔循序傳輸」，標配 8GB ECC 綽綽有餘！
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    在 Linux 與 Synology DSM 系統中，大檔案（如數百 GB 或數 TB 的資料封包、備份映像檔、資料庫 dump）的傳輸是採用 <strong>串流式 I/O (Streaming DMA)</strong> 機制。
                    資料從網路卡接收後，會分批直接循序寫入硬碟陣列，<strong>並不需要、也不會把整個 1TB 的檔案載入記憶體中</strong>。傳輸時記憶體佔用率通常僅維持在 20%~35% 之間。
                  </p>
                  <p className="text-xs text-slate-400">
                    💡 <strong>傳輸真正的瓶頸在於</strong>：<strong>網路介面頻寬</strong>（原生 2.5GbE 約 280MB/s，加裝 10GbE 網卡可達 1,100MB/s）與 <strong>硬碟陣列循序寫入速率</strong>（4 顆 7200轉硬碟在 RAID 5 下寫入約 500~700MB/s）。
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="font-bold text-sm text-amber-300">什麼情況下「TB 級傳輸」會需要加裝記憶體至 16GB / 24GB？</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                      <div className="font-bold text-slate-100 flex items-center gap-1">
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                        數十萬至百萬個「零碎小檔案」
                      </div>
                      <p className="text-slate-400 text-xs">
                        若 1TB 資料是由百萬個小檔案組成，Btrfs 檔案系統需頻繁檢索 Inode 與中繼資料 (Metadata)。加裝 RAM 可以放大 Metadata 快取，小檔傳輸與檢索會更靈敏。
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                      <div className="font-bold text-slate-100 flex items-center gap-1">
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                        多人同時高併發傳輸 + 背景備份
                      </div>
                      <p className="text-slate-400 text-xs">
                        若多名團隊成員同時上傳下載，且 NAS 背景正在執行 Hyper Backup 或 Drive 同步，多加一條 16GB 記憶體可提供更充裕的緩衝空間。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ECC Importance */}
              <div className="p-4 sm:p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2.5">
                <div className="font-bold text-base text-amber-400 flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  為什麼 50TB 巨量資料強烈需要 ECC 記憶體？
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  當 NAS 管理 50TB 以上巨量資料時，記憶體中每秒處理數萬筆讀寫。一般的 non-ECC 記憶體若遭受宇宙射線或電氣雜訊引起單元翻轉（Bit Flip），錯誤的資料將會被<strong>直接寫入硬碟儲存</strong>，導致檔案無聲損壞（Silent Data Corruption）。<strong>ECC 記憶體能在硬體層級即時偵測並修正單元錯誤</strong>，保護重要備份與企業資料庫安全。
                </p>
                <div className="text-xs text-slate-400 pt-1">
                  • <strong>DS1825+ 標配 8GB ECC</strong>，天生具備錯誤修正優勢。<br/>
                  • <strong>加購建議</strong>：若日後需加裝，可挑選原廠 16GB ECC (D4ECSO-3200-16G) 或高 CP 值的創見/金士頓 DDR4-3200 ECC SODIMM (約 NT$ 2,600)。
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Addons & Networking */}
          {activeTab === 'addons' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2.5">
                <div className="font-bold text-base text-purple-400 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  10GbE 高速網路擴充卡與 M.2 NVMe SSD 快取
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
                    <div className="font-bold text-slate-100 flex items-center justify-between text-sm">
                      <span>10GbE 網路擴充卡 (E10G18-T1)</span>
                      <span className="text-xs text-sky-400 font-mono">PCIe 3.0 x4 RJ-45</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400">
                      DS1825+ 原生標配雙 2.5GbE 網路埠（傳輸約 280 MB/s）。若團隊有大量 TB 級大檔頻繁讀寫或多人並行存取，加裝 10GbE 網卡可將傳輸頻寬提升至 <strong>1000+ MB/s</strong>，大幅縮短傳輸等待時間。
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
                    <div className="font-bold text-slate-100 flex items-center justify-between text-sm">
                      <span>M.2 NVMe SSD (SNV3410 800G)</span>
                      <span className="text-xs text-purple-400 font-mono">企業級高耐寫度 M.2</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400">
                      DS1825+ 內建雙 M.2 2280 插槽，不僅可做為<strong>讀寫快取 (Read/Write Cache)</strong> 加速資料庫與小檔案隨機讀寫 IOPS，更支援直接建立 <strong>全快閃 M.2 儲存集區 (Storage Pool)</strong> 供虛擬機或 Docker 高速運行。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>提示：點擊半透明空白處亦可快速關閉</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            關閉指南
          </button>
        </div>
      </div>
    </div>
  );
};
