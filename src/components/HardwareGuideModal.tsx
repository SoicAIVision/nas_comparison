import React, { useState } from 'react';
import { X, Server, HardDrive, Cpu, Info, AlertOctagon, CheckCircle2, ArrowRight, Layers, Network } from 'lucide-react';

interface HardwareGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'nas' | 'hdd' | 'ram' | 'm2' | 'addons';
}

export const HardwareGuideModal: React.FC<HardwareGuideModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'nas',
}) => {
  const [activeTab, setActiveTab] = useState<'nas' | 'hdd' | 'ram' | 'm2' | 'addons'>(defaultTab);

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
                深入解析 NAS 主機型號定位、硬碟選購差異、M.2 系統碟優勢、記憶體 ECC 機制與 10G 網路規劃
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mt-5 border-b border-slate-800 pb-2.5">
            <button
              onClick={() => setActiveTab('nas')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition cursor-pointer ${
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
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'hdd'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              2. 3.5吋 硬碟與 50TB 空間
            </button>
            <button
              onClick={() => setActiveTab('m2')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'm2'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              3. M.2 系統碟 (Volume) vs Bay
            </button>
            <button
              onClick={() => setActiveTab('ram')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'ram'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Cpu className="w-4 h-4" />
              4. 記憶體 (RAM) 與大檔傳輸
            </button>
            <button
              onClick={() => setActiveTab('addons')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'addons'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Network className="w-4 h-4" />
              5. 10GbE 網卡與網路規劃
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
                  Synology 旗艦 8-Bay 三大機種定位（DS1823xs+ vs DS1825+ vs DS1825neo+）
                </div>
                <p>
                  對於目標建置 <strong>50TB 以上有效儲存容量</strong> 的團隊或企業，<strong>8-Bay 機型</strong> 是擴充彈性最高、最具投資效益的選擇。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
                  {/* DS1823xs+ */}
                  <div className="p-3.5 bg-slate-900 border border-emerald-800/70 rounded-xl space-y-2">
                    <div className="font-bold text-base text-emerald-300 flex items-center justify-between">
                      <span>DS1823xs+ (企業旗艦)</span>
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                        ⚡ 內建 10G
                      </span>
                    </div>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 text-xs">
                      <li><strong>AMD Ryzen V1780B</strong> 高主頻 3.35GHz 處理器（效能最強）。</li>
                      <li><strong>原生內建 1 x 10GbE RJ-45 網卡</strong>（免加購網卡直接享有 1,000MB/s 傳輸）。</li>
                      <li>標配 8GB ECC DDR4 記憶體。</li>
                      <li><strong>享有原廠 5 年頂級企業保固</strong>。</li>
                      <li>最新報價約 NT$ 53,850。</li>
                    </ul>
                  </div>

                  {/* DS1825+ */}
                  <div className="p-3.5 bg-slate-900 border border-sky-800/60 rounded-xl space-y-2">
                    <div className="font-bold text-base text-sky-300 flex items-center justify-between">
                      <span>DS1825+ (2025新世代)</span>
                      <span className="text-xs bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded">雙 2.5G</span>
                    </div>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 text-xs">
                      <li><strong>出廠標配 8GB ECC DDR4 記憶體</strong>。</li>
                      <li>AMD Ryzen V1500B 處理器、雙 2.5GbE 網路埠、雙 M.2 NVMe。</li>
                      <li>具備 PCIe Gen3 x8 插槽，可視需要加購 10GbE 網卡。</li>
                      <li>原廠 3 年保固，支援最新 DX525 擴充櫃。</li>
                      <li>最新報價約 NT$ 47,150。</li>
                    </ul>
                  </div>

                  {/* DS1825neo+ */}
                  <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-xl space-y-2">
                    <div className="font-bold text-base text-slate-200 flex items-center justify-between">
                      <span>DS1825neo+ (經濟版)</span>
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">親民入門</span>
                    </div>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 text-xs">
                      <li>硬體平台與 DS1825+ 完全相同。</li>
                      <li><strong>出廠預載 4GB non-ECC 記憶體</strong>，售價最親民。</li>
                      <li>原廠 3 年保固。</li>
                      <li>最新報價約 NT$ 29,888。</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-sky-400" />
                  DS1825+ / DS1823xs+ 是否有限制 3.5 吋或 2.5 吋硬碟？
                </div>
                <p className="text-slate-400 text-xs sm:text-sm">
                  <strong>完全沒有限制，原生通用支援 3.5 吋 SATA 硬碟、2.5 吋 SATA SSD 與 雙 M.2 NVMe SSD！</strong>
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
                    <span className="text-slate-400">機身底部專屬免工具快拆槽，可用於讀寫快取或建立獨立系統儲存集區。</span>
                  </div>
                </div>
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

              {/* Mixed Drive Guide */}
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

          {/* TAB 3: M.2 NVMe System Volume vs Bay HDDs */}
          {activeTab === 'm2' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 bg-purple-950/40 border border-purple-800/60 rounded-xl space-y-3">
                <div className="font-bold text-base text-purple-300 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  M.2 NVMe 高速系統儲存集區 (System Volume) vs 3.5 吋 Bay 機械硬碟
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  許多同事常問：「NAS 已經插了 4 顆 18TB 機械硬碟，為什麼還建議再加購 M.2 NVMe SSD？這兩者有什麼差別？」
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1 text-slate-200">
                  <div className="p-3.5 bg-slate-900/80 border border-purple-900/40 rounded-xl space-y-2">
                    <div className="font-bold text-purple-300 text-sm flex items-center gap-1.5">
                      <HardDrive className="w-4 h-4 text-sky-400" />
                      3.5 吋 Bay 機械硬碟：大容量資料池 (Bulk Data Pool)
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      • <strong>用途</strong>：存放 50TB+ 專案檔案、大檔備份、相片影片等冷熱資料。<br/>
                      • <strong>特性</strong>：容量巨大（單顆 14~24TB）、每 TB 建置成本極低。<br/>
                      • <strong>缺點</strong>：隨機讀寫 IOPS 較低（約 150 IOPS），執行頻繁資料庫檢索時會有機械尋道雜音。
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-900/80 border border-purple-900/40 rounded-xl space-y-2">
                    <div className="font-bold text-purple-300 text-sm flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-purple-400" />
                      M.2 NVMe SSD：獨立高速系統集區 (System Pool)
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      • <strong>用途</strong>：建立獨立高速 Volume 1，專門安裝 <strong>DSM 系統套件、Docker (Container Manager)、VM 虛擬機、資料庫與 Photos AI 縮圖庫</strong>。<br/>
                      • <strong>特性</strong>：零機械噪音、超高隨機讀寫 (高達 500,000 IOPS)。<br/>
                      • <strong>關鍵優勢</strong>：<strong>完全不佔用正面 8 個 3.5 吋 Bay 槽位</strong>！
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    為什麼建議使用 2 顆 M.2 SSD 組 RAID 1 鏡像系統碟？
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    加裝 2 顆 M.2 NVMe SSD (如 2 顆 Kingston KC3000 1TB 或 Synology 原廠 SNV3410) 建立 <strong>RAID 1 鏡像</strong>，不僅能享有百萬級 IOPS 高速反應，還具備單碟容錯防護。即使其中 1 顆固態硬碟損壞，系統與所有 Docker 服務依然不停機正常運作！
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RAM & TB Transfer Analysis */}
          {activeTab === 'ram' && (
            <div className="space-y-4">
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
              </div>
            </div>
          )}

          {/* TAB 5: 10GbE & Networking */}
          {activeTab === 'addons' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                <div className="font-bold text-base text-sky-400 flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  10GbE 網路速度提升與機種選購建議
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  <div className="p-3.5 bg-slate-900 border border-emerald-800/70 rounded-xl space-y-2">
                    <div className="font-bold text-emerald-300 flex items-center justify-between text-sm">
                      <span>方案 1：選用 DS1823xs+ (原生標配 10GbE)</span>
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold">
                        最省事首選
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      DS1823xs+ <strong>出廠即內建 1 x 10GbE RJ-45 高速埠</strong>，完全無需額外加購任何網卡，直接插上 10G Switch 或電腦 10G 網卡即可享有 <strong>1,000+ MB/s</strong> 極速傳輸，且享原廠 5 年頂級保固。
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-xl space-y-2">
                    <div className="font-bold text-slate-100 flex items-center justify-between text-sm">
                      <span>方案 2：DS1825+ 透過 PCIe 加裝 E10G18-T1</span>
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">彈性擴充</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      DS1825+ 原生標配雙 2.5GbE（傳輸約 280 MB/s）。若後續需要 10G 傳輸，可隨時購買 Synology E10G18-T1 擴充卡 (約 NT$ 4,499) 插入 PCIe Gen3 x8 插槽升級。
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
