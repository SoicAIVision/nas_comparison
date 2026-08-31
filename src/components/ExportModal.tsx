import React, { useState } from 'react';
import { CompletePlanEvaluation } from '../types';
import { X, Download, Copy, Check, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluations: CompletePlanEvaluation[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, evaluations }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate CSV string
  const generateCsv = () => {
    const headers = [
      '方案名稱',
      'NAS主機型號',
      '網路規格',
      '3.5吋硬碟配置',
      'RAID模式',
      '標稱可用容量(TB)',
      '真實可用容量(TiB)',
      '滿足50TB目標',
      'M.2 NVMe配置',
      '記憶體配置',
      '原價屋總價(NTD)',
      '欣亞數位總價(NTD)',
      '最低混搭總價(NTD)',
      '每TB建置成本(NTD/TB)',
    ];

    const rows = evaluations.map((e) => {
      const hddDesc = e.isMixedDrives
        ? e.mixedDriveItems.map((item) => `${item.count}顆 ${item.hddModel.capacityTb}TB ${item.hddModel.brand}`).join(' + ')
        : `${e.config.hddCount}顆 x ${e.hddModel.brand} ${e.hddModel.capacityTb}TB ${e.hddModel.series}`;

      const m2Desc = e.m2SsdCount > 0 && e.m2SsdModule
        ? `${e.m2SsdCount}顆 x ${e.m2SsdModule.capacityGb}GB (${e.m2Usage === 'storage_pool' ? '系統集區' : '快取'})`
        : '無加購';

      return [
        `"${e.config.name}"`,
        `"${e.nasModel.name} (${e.nasModel.series})"`,
        `"${e.nasModel.ethernetPorts}"`,
        `"${hddDesc}"`,
        `"${e.config.raidType}"`,
        e.storage.usableTb,
        e.storage.usableTib,
        e.storage.meets50TbTarget ? '是' : '否',
        `"${m2Desc}"`,
        `"${e.totalRamGb}GB ${e.ramIsEcc ? 'ECC' : 'non-ECC'}"`,
        e.cost.totalCoolpc ?? '缺貨/無報價',
        e.cost.totalSinya ?? '缺貨/無報價',
        e.cost.totalBest,
        e.cost.costPerUsableTb,
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    return csvContent;
  };

  const handleDownloadCsv = () => {
    const csvContent = generateCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NAS_比價評估報告_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate Markdown report
  const generateMarkdownReport = () => {
    let md = `# NAS 採購評估與即時比價報告\n\n`;
    md += `*產出時間：${new Date().toLocaleString()}*\n\n`;
    md += `| 方案名稱 | NAS 機型 | 網路 | 3.5吋硬碟組合 | RAID | 可用容量 (TB/TiB) | 50TB目標 | M.2 系統碟/快取 | RAM | 原價屋總價 | 欣亞總價 | 最低混搭價 | 每 TB 成本 |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    for (const e of evaluations) {
      const hddDesc = e.isMixedDrives
        ? e.mixedDriveItems.map((item) => `${item.count}顆 ${item.hddModel.capacityTb}TB ${item.hddModel.brand}`).join(' + ')
        : `${e.config.hddCount}顆 x ${e.hddModel.capacityTb}TB ${e.hddModel.brand}`;

      const m2Desc = e.m2SsdCount > 0 && e.m2SsdModule
        ? `${e.m2SsdCount}x ${e.m2SsdModule.capacityGb}G (${e.m2Usage === 'storage_pool' ? '系統碟' : '快取'})`
        : '-';

      const coolpc = e.cost.totalCoolpc ? `NT$ ${e.cost.totalCoolpc.toLocaleString()}` : '-';
      const sinya = e.cost.totalSinya ? `NT$ ${e.cost.totalSinya.toLocaleString()}` : '-';
      const best = `**NT$ ${e.cost.totalBest.toLocaleString()}**`;
      const costPerTb = `NT$ ${e.cost.costPerUsableTb.toLocaleString()}/TB`;
      const meetsTarget = e.storage.meets50TbTarget ? '✅ 達成' : '⚠️ 未達';

      md += `| ${e.config.name} | ${e.nasModel.name} | ${e.hasBuiltIn10G ? '⚡10GbE' : '2.5GbE'} | ${hddDesc} | ${e.config.raidType} | ${e.storage.usableTb} TB (${e.storage.usableTib} TiB) | ${meetsTarget} | ${m2Desc} | ${e.totalRamGb}GB ${e.ramIsEcc ? 'ECC' : ''} | ${coolpc} | ${sinya} | ${best} | ${costPerTb} |\n`;
    }

    return md;
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(generateMarkdownReport());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative cursor-default"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">匯出 NAS 方案採購評估報告</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              提供 Excel 相容 CSV 試算表下載與會議簡報 Markdown 格式複製
            </p>
          </div>
        </div>

        <div className="space-y-3.5 my-6">
          <button
            onClick={handleDownloadCsv}
            className="w-full p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 rounded-xl flex items-center justify-between group transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
              <div className="text-left">
                <div className="font-semibold text-slate-100 text-sm">下載 Excel 相容 CSV 試算表 (.csv)</div>
                <div className="text-xs text-slate-400">包含完整硬碟型號、RAID 計算、雙店價格矩陣與每 TB 成本</div>
              </div>
            </div>
            <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-md font-mono">
              .CSV
            </span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="w-full p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-sky-500/60 rounded-xl flex items-center justify-between group transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {copied ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <Copy className="w-5 h-5 text-sky-400 group-hover:scale-110 transition" />
              )}
              <div className="text-left">
                <div className="font-semibold text-slate-100 text-sm">
                  {copied ? '✅ 已複製 Markdown 表格到剪貼簿！' : '複製 Markdown 評估表格'}
                </div>
                <div className="text-xs text-slate-400">適合直接貼入 HackMD、Notion、GitHub Issue 或 Email 進行決策會議</div>
              </div>
            </div>
            <span className="text-xs bg-sky-950 text-sky-300 border border-sky-800 px-2.5 py-1 rounded-md font-mono">
              .MD
            </span>
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition cursor-pointer"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
