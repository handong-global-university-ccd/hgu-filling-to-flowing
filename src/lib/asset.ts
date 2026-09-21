/**
 * 이미지·영상 경로를 CDN 주소로 바꿔준다.
 * .env.local 에 NEXT_PUBLIC_ASSET_URL 이 없으면 public/ 폴더를 그대로 사용.
 *   asset("/works/abc/thumb-a.webp")
 */
const BASE = (process.env.NEXT_PUBLIC_ASSET_URL ?? "").replace(/\/$/, "");

export function asset(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
