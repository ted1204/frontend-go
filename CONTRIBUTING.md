# 貢獻指南

## Monorepo 結構
- 共用元件請放於 `packages/components-shared`
- 共用 hooks/i18n 請放於 `packages/utils`
- UI 元件請放於 `packages/ui`
- app 端專案請放於 `packages/frontend-app`

## 開發流程
1. 請先拉取最新 main 分支
2. 新增/搬移共用元件時，請於對應 package 目錄下開發
3. 執行 `npm run lint`、`npm run format`、`npx tsc -b` 確認無誤
4. 提交 PR 前請確保 CI 通過

## CI/CD
- PR 及 main push 會自動執行格式檢查、Linter、TypeScript build 及各 package build

## 其他
- 如需新增 package，請同步更新根目錄 `package.json` 的 workspaces 設定
- 有任何問題請於 PR 或 issue 中說明
