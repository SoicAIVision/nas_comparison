@echo off
chcp 65001 >nul
title NAS 視覺化系統 - 生產環境預覽

echo ========================================================
echo   NAS 視覺化與即時比價系統 (生產環境打包預覽)
echo ========================================================
echo.
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"

echo 正在啟動生產環境預覽伺服器...
start http://localhost:4173
npm run preview
pause
