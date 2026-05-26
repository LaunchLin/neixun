#!/usr/bin/env bash
# 一键启动内训演示：构建（如需）→ 防睡眠 → 生产模式运行在 3003 端口
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

PORT=3003
URL="http://localhost:${PORT}"

info() { echo "▶ $*"; }
warn() { echo "⚠ $*"; }

free_port() {
  local pids
  pids="$(lsof -ti :"${PORT}" 2>/dev/null || true)"
  if [[ -n "$pids" ]]; then
    warn "端口 ${PORT} 已被占用，正在结束旧进程…"
    # shellcheck disable=SC2086
    kill -9 $pids 2>/dev/null || true
    sleep 1
  fi
}

build_if_needed() {
  if [[ "${1:-}" == "--rebuild" ]] || [[ ! -d .next ]]; then
    info "正在构建演示（首次或 --rebuild 会稍慢，请稍候）…"
    npm run build
  else
    info "使用已有构建（.next），跳过构建。若要重新构建请加 --rebuild"
  fi
}

open_browser_when_ready() {
  (
    for _ in $(seq 1 60); do
      if curl -sf -o /dev/null "${URL}" 2>/dev/null; then
        open "${URL}"
        exit 0
      fi
      sleep 1
    done
    warn "服务启动较慢，请手动在浏览器打开：${URL}"
  ) &
}

main() {
  echo ""
  info "内训演示 · 项目目录：${PROJECT_DIR}"
  info "访问地址：${URL}"
  echo ""
  info "已启用防睡眠（caffeinate），合盖前请插着电源。"
  info "关闭本终端窗口会停止演示。"
  echo ""

  if ! command -v node >/dev/null 2>&1; then
    echo "❌ 未找到 Node.js，请先安装 Node 后再运行。" >&2
    exit 1
  fi

  free_port
  build_if_needed "${1:-}"
  open_browser_when_ready

  info "正在启动演示服务（生产模式）…"
  echo ""
  exec caffeinate -dims npx next start --port "${PORT}"
}

main "$@"
