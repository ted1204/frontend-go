# @tailadmin/components-shared

共享 React UI 元件庫，供 monorepo 內各前端專案共用。

## 目前元件
- Pagination
- SearchInput
- PageMeta
- ThemeToggleButton

## 使用方式

```tsx
import { Pagination, SearchInput, PageMeta, ThemeToggleButton } from '@tailadmin/components-shared';
```

## 開發

- 請將可重用的 UI 元件搬移至本目錄，並於 `index.ts` 匯出。
- 執行 `npm run build` 產生型別與 dist 輸出。
