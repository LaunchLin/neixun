/**
 * 演示视频与扫码图：
 * - 视频文件名固定为下面这些（需要保持与 public/videos/ 同名）。
 * - 本地开发：直接从 `/videos/*.mp4` 加载。
 * - 正式分享：上传 mp4 到阿里云 OSS 等对象存储，并设置 `NEXT_PUBLIC_VIDEOS_BASE_URL`
 *   为“视频目录”前缀（例如 `https://your-bucket.oss-cn-hangzhou.aliyuncs.com/videos`）。
 */
const VIDEOS_BASE_URL = process.env.NEXT_PUBLIC_VIDEOS_BASE_URL?.replace(/\/$/, "")

function videoUrl(file: string) {
  if (VIDEOS_BASE_URL) return `${VIDEOS_BASE_URL}/${file}`
  return `/videos/${file}`
}

export const presentationVideos = {
  demoGemini: videoUrl("demo-gemini.mp4"),
  demoV0: videoUrl("demo-v0.mp4"),
  demoSupabase: videoUrl("demo-supabase.mp4"),
  demoCursor: videoUrl("demo-cursor.mp4"),
  demoGithubVercel: videoUrl("demo-github-vercel.mp4"),
  showcaseLeft: videoUrl("showcase-left.mp4"),
  showcaseRight: videoUrl("showcase-right.mp4"),
  vercelQrApp: "/videos/qr-app.png",
} as const
