/**
 * 이미지·영상 경로를 CDN(Cloudflare R2) 주소로 바꿔준다.
 * .env.local 의 NEXT_PUBLIC_ASSET_URL 이 비어 있으면 public/ 폴더를 그대로 사용한다.
 *   asset("/media/works/abc/thumb-a.webp")
 */
const BASE = (process.env.NEXT_PUBLIC_ASSET_URL ?? "").replace(/\/$/, "");

/**
 * R2로 올라가는 경로 접두사.
 * public/media/ 아래만 R2로 가고, 나머지(placeholder 등)는 레포의 public/ 에 그대로 둔다.
 * 이 규칙은 .gitignore 와 scripts/upload-media.sh 와 한 세트다 — 바꾸려면 셋 다 고칠 것.
 */
const REMOTE_PREFIX = "/media/";

export function asset(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  const p = path.startsWith("/") ? path : `/${path}`; 
  if (!BASE || !p.startsWith(REMOTE_PREFIX)) return p;
  return `${BASE}${p}`;
}
