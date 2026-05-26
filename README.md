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

演示视频位于 `public/videos/`，因 GitHub 文件大小限制未纳入版本库。克隆后请将 `.mp4` 文件放入该目录，或通过 Git LFS / 外部 CDN 托管。

## 技术栈

- Next.js 16 · React 19
- Tailwind CSS 4
- Framer Motion
