@echo off
chcp 65001 >nul
title NAS 視覺化方案配置與即時比價系統 - 本地伺服器

echo ========================================================
echo   NAS 視覺化與即時比價系統 (Synology DS1825+ 專題)
echo ========================================================
echo.
echo [1/2] 正在載入使用者目錄免安裝 Node.js 環境...
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"

echo [2/2] 正在啟動本地伺服器並開啟瀏覽器...
echo.
echo 提示：請勿關閉此視窗，關閉此視窗將停止網頁服務。
echo.

start http://localhost:3000
npm run dev
pause
