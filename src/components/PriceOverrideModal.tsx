import React, { useState, useEffect } from 'react';
import { useComparisonStore } from '../store/useComparisonStore';
import { X, Tag, RotateCcw } from 'lucide-react';

interface PriceOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string | null;
  itemName: string;
  defaultPrice: number;
}

export const PriceOverrideModal: React.FC<PriceOverrideModalProps> = ({
  isOpen,
  onClose,
  itemId,
  itemName,
  defaultPrice,
}) => {
  const { priceOverrides, setPriceOverride, clearPriceOverride } = useComparisonStore();
  const [customPrice, setCustomPrice] = useState<string>('');

  useEffect(() => {
    if (itemId) {
      const currentOverride = priceOverrides[itemId];
      setCustomPrice(currentOverride !== undefined ? currentOverride.toString() : defaultPrice.toString());
    }
  }, [itemId, defaultPrice, priceOverrides]);

  if (!isOpen || !itemId) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(customPrice, 10);
    if (!isNaN(num) && num >= 0) {
      setPriceOverride(itemId, num);
      onClose();
    }
  };

  const handleReset = () => {
    clearPriceOverride(itemId);
    onClose();
  };

  const isOverridden = priceOverrides[itemId] !== undefined;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative cursor-default"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">自訂/覆寫商品價格</h3>
            <p className="text-xs text-slate-400">{itemName}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 my-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              輸入自訂單價 (新台幣 NTD)：
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-mono">NT$</span>
              <input
                type="number"
                min="0"
                step="1"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-amber-500"
                placeholder="例如 13500"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              電商線上建議/爬取參考價：NT$ {defaultPrice.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            {isOverridden ? (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                恢復電商預設價
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-amber-600/20 transition"
              >
                儲存自訂價
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
