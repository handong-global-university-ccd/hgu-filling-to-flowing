#!/usr/bin/env bash
# public/media/ 안의 영상·사진을 Cloudflare R2 로 올린다.
# 사용법: npm run upload:media          (전체 동기화)
#         npm run upload:media -- --dry-run   (무엇이 올라갈지만 확인)
#
# 준비:
#   1) brew install rclone
#   2) rclone config
#        n (new remote) → name: r2 → storage: s3 → provider: Cloudflare
#        access_key_id / secret_access_key : R2 API 토큰 (Cloudflare 대시보드에서 발급)
#        endpoint : https://<account_id>.r2.cloudflarestorage.com
#
# 버킷 이름이 다르면 R2_BUCKET 환경변수로 덮어쓸 것.
set -euo pipefail

BUCKET=${R2_BUCKET:-hgu-degree-2026}
REMOTE=${R2_REMOTE:-r2}

command -v rclone >/dev/null || {
  echo "rclone 이 설치되어 있지 않습니다. → brew install rclone" >&2
  exit 1
}

rclone listremotes | grep -qx "${REMOTE}:" || {
  echo "rclone 리모트 '${REMOTE}' 가 없습니다. 'rclone config' 로 먼저 설정하세요." >&2
  exit 1
}

echo "public/media  →  ${REMOTE}:${BUCKET}/media"
rclone sync public/media "${REMOTE}:${BUCKET}/media" \
  --header-upload "Cache-Control: public, max-age=31536000, immutable" \
  --checksum \
  --progress \
  "$@"
