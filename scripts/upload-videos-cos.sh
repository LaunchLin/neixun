#!/usr/bin/env bash
# 将 public/videos/ 下的 mp4 上传到腾讯云 COS
# 前置：安装并配置 coscli → https://cloud.tencent.com/document/product/436/63143
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VIDEOS_DIR="$ROOT/public/videos"

BUCKET="${COS_BUCKET:-}"
REGION="${COS_REGION:-ap-guangzhou}"
PREFIX="${COS_PREFIX:-videos}"

if [[ -z "$BUCKET" ]]; then
  echo "用法: COS_BUCKET=你的桶名 ./scripts/upload-videos-cos.sh"
  echo "可选: COS_REGION=ap-guangzhou  COS_PREFIX=videos"
  exit 1
fi

if ! command -v coscli &>/dev/null; then
  echo "未找到 coscli。请先安装并执行 coscli config init 配置密钥。"
  echo "文档: https://cloud.tencent.com/document/product/436/63143"
  exit 1
fi

shopt -s nullglob
files=("$VIDEOS_DIR"/*.mp4 "$VIDEOS_DIR"/*.MP4)
if [[ ${#files[@]} -eq 0 ]]; then
  echo "未找到 mp4 文件: $VIDEOS_DIR"
  exit 1
fi

for f in "${files[@]}"; do
  name="$(basename "$f")"
  echo "上传 $name ..."
  coscli cp "$f" "cos://${BUCKET}/${PREFIX}/${name}" --region "$REGION"
done

echo ""
echo "上传完成。请在部署平台设置环境变量："
echo "NEXT_PUBLIC_VIDEOS_BASE_URL=https://${BUCKET}.cos.${REGION}.myqcloud.com/${PREFIX}"
