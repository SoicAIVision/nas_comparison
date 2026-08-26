import React from 'react';
import { X, Cpu, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

interface RAMAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RAMAdviceModal: React.FC<RAMAdviceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Synology NAS 記憶體 (RAM) 影響與選配指南</h3>
            <p className="text-xs text-slate-400">
              針對 DS1825+ 標配 8GB ECC 與 50TB+ 儲存環境之深度實務建議
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          {/* Section 1: Default 8GB is enough for what? */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <div className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              1. 標配 8GB ECC 記憶體：日常存取與辦公已非常充裕
            </div>
            <p>
              Synology DSM 7.2 作業系統開機日常待機僅佔用約 <strong>1.5 GB ~ 2.2 GB</strong> 記憶體。
              剩餘未使用的 5~6 GB 記憶體會被 Linux 核心全數轉為 <strong>Page Cache（檔案與 Btrfs Metadata 快取）</strong>。
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
              <li>
                <strong>一般檔案伺服器 (SMB / NFS / AFP)</strong>：數十人同時讀寫小檔案非常流暢。
              </li>
              <li>
                <strong>Synology Photos & Drive 協同</strong>：管理 50TB 等級的家庭/企業照片與文件版本控制，8GB 記憶體使用率約在 55%~65%，運作極為順暢。
              </li>
              <li>
                <strong>Hyper Backup / Snapshot Replication 快照</strong>：排程備份與異地備援不卡頓。
              </li>
            </ul>
          </div>

          {/* Section 2: When to upgrade to 16GB / 32GB? */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <div className="font-bold text-sm text-sky-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              2. 何時強烈建議升級到 16GB 或 32GB ECC？
            </div>
            <p>若您的 NAS 除了儲存檔案外，還承擔以下高負載應用，建議加購記憶體：</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="font-semibold text-slate-100 mb-1">🐳 Container Manager (Docker)</div>
                <p className="text-[11px] text-slate-400">
                  若在 NAS 上運行多個 Docker 服務（如 GitLab、MySQL/PostgreSQL 資料庫、Prometheus 監控），建議至少 <strong>16GB</strong>。
                </p>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="font-semibold text-slate-100 mb-1">💻 Virtual Machine (虛擬機)</div>
                <p className="text-[11px] text-slate-400">
                  若要在 NAS 內安裝 Windows 10/11 或 Linux 虛擬機，每台 VM 需分配 4~8GB RAM，強烈建議直上 <strong>32GB (16G x 2)</strong>。
                </p>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="font-semibold text-slate-100 mb-1">⚡ 10GbE 高速網路協作</div>
                <p className="text-[11px] text-slate-400">
                  若升級 10G 網卡進行大型影音剪輯或多專案讀寫，更大記憶體能做為緩衝，顯著降低硬碟直接尋道等待時間。
                </p>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="font-semibold text-slate-100 mb-1">🔍 數百萬巨量檔案搜尋</div>
                <p className="text-[11px] text-slate-400">
                  Universal Search 全文檢索上百萬筆專案檔案時，更多記憶體能縮短索引與搜尋時間。
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Why ECC matters? */}
          <div className="p-4 bg-amber-950/30 border border-amber-800/50 rounded-xl space-y-1.5">
            <div className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              3. 為什麼 ECC (錯誤校正碼) 對 50TB 關鍵資料如此重要？
            </div>
            <p className="text-amber-200/90">
              DS1825+ 標配的 <strong>8GB ECC DDR4</strong> 能自動偵測並修正記憶體中的單元翻轉（Bit Flip），避免在記憶體寫入硬碟時發生<strong>靜態資料損毀 (Silent Data Corruption)</strong>。
              後續升級時，強烈建議挑選原廠或相容的 <strong>ECC SODIMM</strong> 模組以維持最高資料保護水準。
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition"
          >
            我瞭解了，關閉說明
          </button>
        </div>
      </div>
    </div>
  );
};
