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
      '硬碟配置',
      'RAID模式',
      '標稱可用容量(TB)',
      '真實可用容量(TiB)',
      '滿足50TB目標',
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

      return [
        `"${e.config.name}"`,
        `"${e.nasModel.name} (${e.nasModel.series})"`,
        `"${hddDesc}"`,
        `"${e.config.raidType}"`,
        e.storage.usableTb,
        e.storage.usableTib,
        e.storage.meets50TbTarget ? '是' : '否',
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
    md += `| 方案名稱 | NAS 機型 | 硬碟組合 | RAID | 可用容量 (TB/TiB) | 50TB目標 | RAM | 原價屋總價 | 欣亞總價 | 最低混搭價 | 每 TB 成本 |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- | :--- |\n`;

    for (const e of evaluations) {
      const hddDesc = e.isMixedDrives
        ? e.mixedDriveItems.map((item) => `${item.count}顆 ${item.hddModel.capacityTb}TB ${item.hddModel.brand}`).join(' + ')
        : `${e.config.hddCount}顆 x ${e.hddModel.capacityTb}TB ${e.hddModel.brand}`;

      const coolpc = e.cost.totalCoolpc ? `NT$ ${e.cost.totalCoolpc.toLocaleString()}` : '-';
      const sinya = e.cost.totalSinya ? `NT$ ${e.cost.totalSinya.toLocaleString()}` : '-';
      const best = `**NT$ ${e.cost.totalBest.toLocaleString()}**`;
      const costPerTb = `NT$ ${e.cost.costPerUsableTb.toLocaleString()}/TB`;
      const meetsTarget = e.storage.meets50TbTarget ? '✅ 達成' : '⚠️ 未達';

      md += `| ${e.config.name} | ${e.nasModel.name} | ${hddDesc} | ${e.config.raidType} | ${e.storage.usableTb} TB (${e.storage.usableTib} TiB) | ${meetsTarget} | ${e.totalRamGb}GB ${e.ramIsEcc ? 'ECC' : ''} | ${coolpc} | ${sinya} | ${best} | ${costPerTb} |\n`;
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
            <h3 className="text-lg font-bold text-white">匯出 NAS 採購評估報告</h3>
            <p className="text-xs text-slate-400">
              一鍵匯出 Excel 相容之 CSV 試算表或會議採購 Markdown 摘要
            </p>
          </div>
        </div>

        <div className="space-y-4 my-6">
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs text-slate-100 mb-0.5">
                📊 CSV 試算表 (支援 Excel / Google Sheets)
              </div>
              <p className="text-[11px] text-slate-400">
                包含所有方案之規格明細、有效容量、原價屋與欣亞報價矩陣
              </p>
            </div>
            <button
              onClick={handleDownloadCsv}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              下載 CSV
            </button>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs text-slate-100 mb-0.5">
                📝 Markdown 格式表格 (適用於 Slack / Teams / Notion)
              </div>
              <p className="text-[11px] text-slate-400">
                複製為 Markdown 語法表格，方便直接貼入工作紀錄或採購提報
              </p>
            </div>
            <button
              onClick={handleCopyMarkdown}
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition flex-shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copied ? '已複製！' : '複製 Markdown'}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
