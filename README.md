# 小黨如何攪動社群言論

這是一個單頁靜態網頁，可直接用 GitHub Pages 或任何靜態主機發布。

## 檔案結構

- `index.html`：主要網頁內容、樣式與互動試算器。
- `favicon.ico` / `favicon.svg`：瀏覽器分頁圖示。
- `assets/hero-social-discourse.png`：首頁主視覺背景。
- `Makefile`：本機預覽與檢查流程。
- `scripts/audit-page.mjs`：零依賴頁面稽核，檢查必要章節、錨點、preload、favicon 與互動元件。

預設頁面入口為 `index.html`。頁面載入時會顯示整頁 preloader，完成載入後淡出；主視覺圖片另以 `<link rel="preload">` 預先載入。
頁面 UI 圖示統一使用 [Heroicons](https://heroicons.com/) 24px outline SVG，集中在 `index.html` 的 inline symbol sprite。

## 建議更新流程

1. 修改 `index.html`。
2. 執行 `make update`，一次確認 `index.html` 入口、favicon、JavaScript 語法、必要素材、必要章節、錨點與 Git 狀態。
3. 執行 `make serve`，用本機網址檢查畫面。
4. 另開終端執行 `make preview-check`，確認本機預覽伺服器有回應。
5. 確認重點區塊：Header/Menu、主視覺、公式圖像、放大流程、演算法對立線、政治收益、成本報價表、民眾黨案例、辨識清單。
6. 若要上 Git，執行 `make git-ready` 後再 commit。

## 常用指令

```sh
make help
make update
make check
make serve
make preview-check
make git-ready
```

本機預覽預設網址：

```text
http://127.0.0.1:8011/
```

## GitHub Pages 發布建議

此頁不需要 npm、build step 或 GitHub Actions。建議使用 GitHub Pages 的 branch source：

- branch：`main`
- folder：`/root`
- entry file：`index.html`

首次建立 git repo 時：

```sh
git init -b main
git add index.html assets README.md Makefile .gitignore
git commit -m "Add static analysis page"
```
