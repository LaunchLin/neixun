#!/usr/bin/env bash
# 将 public/videos/ 下的 mp4 上传到阿里云 OSS
# 前置：安装并配置 ossutil → https://help.aliyun.com/document_detail/120075.html
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VIDEOS_DIR="$ROOT/public/videos"

BUCKET="${OSS_BUCKET:-}"
REGION="${OSS_REGION:-cn-hangzhou}"
PREFIX="${OSS_PREFIX:-videos}"
ENDPOINT="${OSS_ENDPOINT:-oss-${REGION}.aliyuncs.com}"

if [[ -z "$BUCKET" ]]; then
  echo "用法: OSS_BUCKET=你的桶名 ./scripts/upload-videos-oss.sh"
  echo "可选: OSS_REGION=cn-hangzhou  OSS_PREFIX=videos"
  exit 1
fi

if ! command -v ossutil &>/dev/null; then
  echo "未找到 ossutil。请先安装并执行 ossutil config 配置 AccessKey。"
  echo "文档: https://help.aliyun.com/document_detail/120075.html"
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
  ossutil cp "$f" "oss://${BUCKET}/${PREFIX}/${name}" \
    -e "$ENDPOINT" \
    -f \
    --meta "Content-Type:video/mp4" \
    --meta "Content-Disposition:inline"
done

echo ""
echo "上传完成。请在部署平台设置环境变量："
echo "NEXT_PUBLIC_VIDEOS_BASE_URL=https://${BUCKET}.${ENDPOINT}/${PREFIX}"
