# NAS 視覺化方案配置與即時比價系統 (Synology DS1825+ 專題)

> 專為團隊採購與 NAS 方案評估打造的視覺化互動比價工具，即時動態比對**原價屋 (CoolPC)** 與 **欣亞數位 (Sinya)** 配件報價，支援 **RAID 5 空間試算**、**$\ge$ 50TB 採購目標檢查**、**RAM 影響指南** 與 **URL Hash 零後端完整狀態分享**。

---

## ✨ 核心特色與功能

1. **Synology DS1825+ / DS1825neo+ 8-Bay 旗艦專案**：
   - 預載 Synology DS1825+ (8GB ECC 標配)、DS1825neo+ (4GB 標配)、DS1621+、DS1522+、DS923+ 規格庫。
   - 包含處理器 (AMD Ryzen)、擴充槽、原生 Bay 數、2.5GbE/10GbE 網卡介面等硬體參數。

2. **$\ge$ 50TB 採購目標與 RAID 5 儲存計算引擎**：
   - 預設採用 **RAID 5**，自動換算十進位 (TB) 與二進位 (TiB) 真實容量。
   - 預載 **4 顆 $\times$ 18TB (有效 54TB / 剩 4 空槽)**、**4 顆 $\times$ 20TB (有效 60TB)**、**5 顆 $\times$ 14TB (有效 56TB)** 等高 CP 推薦配置。
   - 自動即時提示是否滿足 $\ge 50\text{TB}$ 採購門檻。

3. **原價屋 & 欣亞數位 動態比價與時間戳記**：
   - 畫面清楚標註每筆價格的抓取時間戳記（如 `報價時間：2026-08-26 13:30`）。
   - 滑鼠懸停價格可查看數據來源與說明，提供 **「🔄 重新整理報價」** 即時刷新。
   - 自動計算「原價屋總價」、「欣亞數位總價」、「最低混搭預算」與「每 TB 建置成本 (NT$/TB)」。

4. **NAS 記憶體 (RAM) 選配指南與影響深度分析**：
   - 深入分析標配 8GB ECC 在純檔案分享/備份/Photos 照片索引下的充足性（待機約 1.5G~2.5G，其餘轉為 Page Cache）。
   - 提供 Container Manager (Docker)、VM 虛擬機、10GbE 高速傳輸何時建議升級至 16GB/32GB ECC 之專業建議。

5. **URL Hash 零後端完美分享**：
   - 任何方案配置調整即時編碼寫入網址 Hash（`lz-string` 高壓縮比）。
   - 複製網址傳給同事，同事點開即可百分之百重現一模一樣的自訂配置與比較矩陣。

6. **多維度視覺化圖表與報表匯出**：
   - 價格結構堆疊長條圖（主機 vs 硬碟 vs 記憶體 vs 配件）。
   - 一鍵匯出 **Excel 相容 CSV 試算表** 或 **Markdown 會議採購評估報告**。

---

## 🚀 本地開發與測試 (Local Development)

```bash
# 1. 安裝依賴
npm install

# 2. 執行單元測試 (TDD 閉環驗證)
npm run test:run

# 3. 啟動本地開發伺服器
npm run dev

# 4. 建置生產環境靜態檔案
npm run build
npm run preview
```

---

## 🌐 部署至 GitHub Pages

專案內建 [`.github/workflows/deploy.yml`](file:///d:/project/nas_comparison/.github/workflows/deploy.yml)，當程式碼 Push 至 `main` 分支時，GitHub Actions 會自動執行測試、建置並發布至 GitHub Pages。

定時爬價工作流程 [`.github/workflows/update-prices.yml`](file:///d:/project/nas_comparison/.github/workflows/update-prices.yml) 會每日自動同步最新價格快照至 `public/data/prices.json`。
