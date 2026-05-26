# VibeCoding 内训演示

基于 Next.js 的全屏幻灯片演示，用于 VibeCoding 内训分享。

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:3003](http://localhost:3003)。

生产模式一键启动（macOS）：

```bash
./scripts/start-presentation.sh
```

或双击 `开始演示.command`。

## 操作说明

- **点击 / 方向键 / Enter**：下一步
- **Backspace / 方向键左**：上一步
- **空格**：播放/暂停视频（演示页）
- **Home / End**：跳转到首页 / 末页

## 视频资源

演示视频位于 `public/videos/`，因 GitHub 单文件 100MB 限制未纳入版本库。

| 场景 | 做法 |
|------|------|
| 本地演示 | 将 `.mp4` 放入 `public/videos/` 后直接运行 |
| 线上分享（国内） | 上传到阿里云 OSS，设置 `NEXT_PUBLIC_VIDEOS_BASE_URL` |

### 阿里云 OSS 上线步骤

**1. 创建 Bucket**

1. 登录 [阿里云 OSS 控制台](https://oss.console.aliyun.com/)
2. 创建 Bucket，地域选离同事最近的（如 `华东1（杭州）` → `cn-hangzhou`）
3. 读写权限选 **公共读**（演示视频需公开访问）
4. 记录 Bucket 名称与地域对应的 Endpoint（如 `oss-cn-hangzhou.aliyuncs.com`）

**2. 上传视频**

在控制台「文件管理」中进入 `videos/` 目录（可手动新建），上传以下 7 个文件，**文件名保持不变**：

- `demo-gemini.mp4`
- `demo-v0.mp4`
- `demo-supabase.mp4`
- `demo-cursor.mp4`
- `demo-github-vercel.mp4`
- `showcase-left.mp4`
- `showcase-right.mp4`

或使用命令行（需先 [安装 ossutil](https://help.aliyun.com/document_detail/120075.html) 并 `ossutil config` 配置 AccessKey）：

```bash
OSS_BUCKET=你的桶名 ./scripts/upload-videos-oss.sh
# 非杭州地域示例：
# OSS_BUCKET=你的桶名 OSS_REGION=cn-shanghai ./scripts/upload-videos-oss.sh
```

> **浏览器打开视频链接却自动下载？** 说明文件的 HTTP 头不对。在控制台选中 mp4 → **设置 HTTP 头** → `Content-Type` 设为 `video/mp4`，`Content-Disposition` 设为 `inline`（或留空）。已上传的文件可用 ossutil 批量修正：
>
> ```bash
> ossutil set-meta oss://neixunshipin/videos/demo-gemini.mp4 \
>   "Content-Type:video/mp4" "Content-Disposition:inline" \
>   -e oss-cn-hangzhou.aliyuncs.com -u
> ```

**3. 配置环境变量**

复制 `.env.example` 为 `.env.local`（本地测试线上视频时），或在 Vercel → Settings → Environment Variables 添加：

```bash
NEXT_PUBLIC_VIDEOS_BASE_URL=https://你的桶名.oss-cn-hangzhou.aliyuncs.com/videos
```

> 若已绑定 CDN 自定义域名，改用 CDN 地址，例如 `https://cdn.example.com/videos`

**4. 验证**

在浏览器直接打开一个视频 URL，应能播放，例如：

`https://你的桶名.oss-cn-hangzhou.aliyuncs.com/videos/demo-gemini.mp4`

**5. 重新部署**

修改环境变量后需在 Vercel 重新 Deploy 一次，前端才会指向 OSS 视频。

## 技术栈

- Next.js 16 · React 19
- Tailwind CSS 4
- Framer Motion
