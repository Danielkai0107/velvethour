# Velvet Hour - Firebase Hosting 部署指南

## 🚀 快速部署步驟

### 方法一：使用我們的自動化腳本（推薦）

1. **登入 Firebase**（只需執行一次）：
   ```bash
   firebase login
   ```

2. **選擇或建立 Firebase 專案**（只需執行一次）：
   ```bash
   firebase use --add
   ```
   選擇現有專案或建立新專案 `velvethour-app`

3. **一鍵部署**：
   ```bash
   ./deploy.sh
   ```

### 方法二：使用 npm 腳本

1. **初始化設定**（只需執行一次）：
   ```bash
   npm run deploy:init
   ```

2. **部署**：
   ```bash
   npm run deploy
   ```

### 方法三：手動步驟

1. **登入 Firebase**：
   ```bash
   firebase login
   ```

2. **設定專案**：
   ```bash
   firebase use --add
   ```

3. **建構專案**：
   ```bash
   npm run build
   ```

4. **部署**：
   ```bash
   firebase deploy --only hosting
   ```

## 📁 已建立的配置檔案

- ✅ `firebase.json` - Firebase Hosting 配置
- ✅ `.firebaserc` - Firebase 專案配置
- ✅ `deploy.sh` - 自動化部署腳本
- ✅ `package.json` - 新增部署腳本

## 🔧 Firebase 專案設定

如果您還沒有 Firebase 專案：

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊「建立專案」
3. 輸入專案名稱：`velvethour-app`
4. 完成專案建立流程
5. 在專案中啟用 Hosting 功能

## 🌐 部署後的網址

部署成功後，您的應用程式將可在以下網址存取：
- `https://velvethour-app.web.app`
- `https://velvethour-app.firebaseapp.com`

## 🔄 後續更新

每次更新程式碼後，只需執行：
```bash
./deploy.sh
```

## ❗ 注意事項

1. **環境變數**：目前使用 demo 配置，如需使用真實 Firebase 功能，請設定環境變數
2. **專案 ID**：如果您的 Firebase 專案 ID 不是 `velvethour-app`，請修改 `.firebaserc` 檔案
3. **首次部署**：首次部署需要約 2-5 分鐘，後續更新會更快

## 🆘 常見問題

**Q: 登入失敗怎麼辦？**
A: 嘗試 `firebase logout` 然後重新 `firebase login`

**Q: 專案 ID 錯誤？**
A: 修改 `.firebaserc` 檔案中的專案 ID

**Q: 部署失敗？**
A: 檢查網路連線，確認已正確登入 Firebase
