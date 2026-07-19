PORT ?= 8011
URL := http://127.0.0.1:$(PORT)/
LIVE_URL ?= https://dinopeng.com/small-parties/
SPORTTECH_URL ?= https://dinopeng.com/sporttech/

.PHONY: help check assets-check mobile-check qa serve preview-check live-check update local-status commit-ready ship-check git-ready

help:
	@echo "常用更新流程："
	@echo "  make update      本機更新檢查：內容稽核、JS 語法與 Git 狀態（不推送）"
	@echo "  make qa          本機品質檢查：內容、資產、JS 語法與 diff whitespace"
	@echo "  make assets-check 檢查 favicon、社群縮圖尺寸與中間檔"
	@echo "  make mobile-check 檢查手機版關鍵 RWD 保護"
	@echo "  make local-status 顯示本機與遠端差異狀態"
	@echo "  make commit-ready 上 commit 前檢查 staged/unstaged 狀態"
	@echo "  make serve       啟動本機預覽：$(URL)"
	@echo "  make preview-check  確認本機預覽伺服器有回應"
	@echo "  make ship-check  上 Git 前完整檢查（不推送）"
	@echo "  make live-check  確認線上網址有回應：$(LIVE_URL) 與 $(SPORTTECH_URL)"
	@echo "  make git-ready   上 Git 前提醒"
	@echo "  make check       基本檔案、頁面結構與 inline JS 檢查"

check:
	@node scripts/audit-page.mjs
	@node scripts/check-inline-js.mjs
	@echo "OK: index.html entry, favicon, assets, and inline JavaScript look good."

assets-check:
	@node scripts/audit-assets.mjs

mobile-check:
	@node scripts/audit-mobile.mjs

qa: check assets-check mobile-check
	@git diff --check
	@git diff --cached --check
	@echo "OK: local QA checks complete."

serve:
	@echo "Serving $(URL)"
	@echo "Press Ctrl+C to stop."
	python3 -m http.server $(PORT) --bind 127.0.0.1

preview-check:
	@curl -fsI "$(URL)" >/dev/null
	@echo "OK: preview server responds at $(URL)"

live-check:
	@curl -L -fsI "$(LIVE_URL)" >/dev/null
	@echo "OK: live site responds at $(LIVE_URL)"
	@curl -L -fsI "$(SPORTTECH_URL)" >/dev/null
	@echo "OK: live site responds at $(SPORTTECH_URL)"

update: qa local-status
	@echo "OK: local update checks complete. No git push was run."
	@echo "Preview with: make serve"
	@echo "URL: $(URL)"

local-status:
	@if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then \
		git status --short --branch; \
		if git rev-parse --abbrev-ref --symbolic-full-name @{u} >/dev/null 2>&1; then \
			echo "Remote tracking: $$(git rev-parse --abbrev-ref --symbolic-full-name @{u})"; \
		else \
			echo "Remote tracking: none"; \
		fi; \
	else \
		echo "INFO: not a git repository yet. Run: git init -b main"; \
	fi

commit-ready: qa
	@if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then \
		git status --short --branch; \
		echo "OK: commit readiness checks complete. Review changes before committing."; \
	else \
		echo "INFO: not a git repository yet. Run: git init -b main"; \
	fi

ship-check: commit-ready preview-check
	@echo "OK: ship checks complete. This target did not push to GitHub."

git-ready: ship-check
	@echo "Reminder: pushing to GitHub requires an explicit user command."
