# 小黨如何攪動社群言論

這是一個單頁靜態網頁，可直接用 GitHub Pages 或任何靜態主機發布。

## 檔案結構

- `index.html`：主要網頁內容、樣式與互動試算器。
- `fav.ico` / `favicon.ico` / `favicon.svg`：瀏覽器分頁圖示與舊瀏覽器相容檔名。
- `assets/hero-social-discourse.png`：首頁主視覺背景。
- `assets/social-thumbnail.png`：社群轉發縮圖，Open Graph / Twitter card 使用，尺寸為 1200 × 630。
- `assets/social-thumbnail.svg`：社群轉發縮圖原稿。
- `Makefile`：本機預覽與檢查流程。
- `scripts/audit-page.mjs`：零依賴頁面稽核，檢查必要章節、錨點、preload、favicon、社群縮圖、互動元件與手機版防溢出結構。

預設頁面入口為 `index.html`。頁面載入時會顯示整頁 preloader，完成載入後淡出；主視覺圖片另以 `<link rel="preload">` 預先載入。
社群轉發會使用 `https://dinopeng.com/small-parties/assets/social-thumbnail.png` 作為預覽圖。
頁面 UI 圖示統一使用 [Heroicons](https://heroicons.com/) 24px outline SVG，集中在 `index.html` 的 inline symbol sprite。

## 建議更新流程

1. 修改 `index.html` 或相關文件。
2. 執行 `make update`，完成本機 QA 與 Git 狀態檢查。此指令不會推送 Git。
3. 執行 `make serve`，用本機網址檢查畫面。
4. 另開終端執行 `make preview-check`，確認本機預覽伺服器有回應。
5. 手動確認重點區塊：Header/Menu、主視覺、公式圖像、放大流程、演算法對立線、政治收益、成本報價表、民眾黨案例、辨識清單。
6. 特別確認手機版：Header/Menu 可橫向滑動、流程圖不裁切、成本表格只在表格內水平滑動、文字不溢出。
7. 上 Git 前執行 `make ship-check`。它會檢查本機 QA 與預覽伺服器，但不會推送。
8. 若要建立本機 commit，執行 `make commit-ready` 後再 commit。
9. 推送 GitHub 必須由使用者明確下達「推 git / push」指令後才執行。
10. 推送後可執行 `make live-check`，確認線上網址有回應。

## 常用指令

```sh
make help
make update
make qa
make check
make local-status
make commit-ready
make serve
make preview-check
make ship-check
make live-check
make git-ready
```

## Git 操作原則

- 日常改動只針對本機版。
- `make update`、`make check`、`make qa`、`make commit-ready`、`make ship-check` 都不會執行 `git push`。
- 推送遠端必須由使用者明確確認後才執行。

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
