PORT ?= 8011
URL := http://127.0.0.1:$(PORT)/

.PHONY: help check serve preview-check update git-ready

help:
	@echo "常用更新流程："
	@echo "  make update      檢查入口、素材、頁面結構、JS 語法與 Git 狀態"
	@echo "  make serve       啟動本機預覽：$(URL)"
	@echo "  make preview-check  確認本機預覽伺服器有回應"
	@echo "  make git-ready   上 Git 前檢查"
	@echo "  make check       基本檔案、頁面結構與 inline JS 檢查"

check:
	@node scripts/audit-page.mjs
	@awk '/<script>/{flag=1; next} /<\/script>/{flag=0} flag' index.html | node --check -
	@echo "OK: index.html entry, favicon, assets, and inline JavaScript look good."

serve:
	@echo "Serving $(URL)"
	@echo "Press Ctrl+C to stop."
	python3 -m http.server $(PORT) --bind 127.0.0.1

preview-check:
	@curl -fsI "$(URL)" >/dev/null
	@echo "OK: preview server responds at $(URL)"

update: check git-ready
	@echo "OK: update checks complete."
	@echo "Preview with: make serve"
	@echo "URL: $(URL)"

git-ready: check
	@if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then \
		git status --short --branch; \
		git diff --check; \
	else \
		echo "INFO: not a git repository yet. Run: git init -b main"; \
	fi
