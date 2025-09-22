#!/bin/bash

# Velvet Hour Firebase Hosting 部署腳本

echo "🔥 開始部署 Velvet Hour 到 Firebase Hosting..."

# 檢查 Firebase CLI 是否已安裝
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI 未安裝，正在安裝..."
    npm install -g firebase-tools
fi

echo "✅ Firebase CLI 已就緒"

# 建構專案
echo "🔨 建構專案..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 專案建構完成"
else
    echo "❌ 專案建構失敗"
    exit 1
fi

# 檢查是否已登入
echo "🔐 檢查 Firebase 登入狀態..."
firebase projects:list > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "🔑 需要登入 Firebase，請執行以下指令："
    echo "   firebase login"
    echo ""
    echo "登入後，請再次執行此腳本進行部署。"
    echo ""
    echo "或者，您可以手動執行以下指令："
    echo "1. firebase login"
    echo "2. firebase use --add (選擇您的專案)"
    echo "3. firebase deploy --only hosting"
    exit 1
fi

# 檢查是否設定了專案
if [ ! -f ".firebaserc" ] || grep -q "your-project-id" .firebaserc; then
    echo "⚠️  請設定您的 Firebase 專案 ID"
    echo "執行: firebase use --add"
    echo "然後選擇您的專案"
    exit 1
fi

# 部署到 Firebase Hosting
echo "🚀 部署到 Firebase Hosting..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 部署成功！"
    echo "您的應用程式現在可以在以下網址存取："
    firebase hosting:channel:open live
else
    echo "❌ 部署失敗"
    exit 1
fi
