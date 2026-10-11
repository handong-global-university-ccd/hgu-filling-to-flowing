#!/usr/bin/env bash
# 에펙에서 받은 원본 영상 → 웹용 가로/세로 mp4 + 포스터(webp)
# 사용법: npm run encode:video -- <가로원본.mov> <세로원본.mov> <이름>
#   예)   npm run encode:video -- media-src/intro-16x9.mov media-src/intro-9x16.mov intro
# 결과:   public/media/<이름>/bg-landscape.mp4 · bg-portrait.mp4 · *.webp
# 필요:   ffmpeg (brew install ffmpeg)
#         ffmpeg 에 libwebp 가 없으면 cwebp 로 포스터를 만든다 (brew install webp)
set -euo pipefail

LAND=${1:?가로 원본 경로}
PORT=${2:?세로 원본 경로}
NAME=${3:?출력 이름}
OUT="public/media/$NAME"
mkdir -p "$OUT"

if ffmpeg -hide_banner -encoders 2>/dev/null | grep -q ' libwebp '; then
  WEBP=ffmpeg
elif command -v cwebp >/dev/null; then
  WEBP=cwebp
else
  echo "포스터(webp)를 만들 수 없습니다. → brew install webp" >&2
  exit 1
fi

encode() { # in out scale
  ffmpeg -y -i "$1" -an \
    -vf "scale=$3:force_original_aspect_ratio=increase,crop=$3,setsar=1,fps=30" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow -crf 26 \
    -maxrate 4M -bufsize 8M -movflags +faststart "$2"
}
poster() { # in out scale
  local vf="scale=$3:force_original_aspect_ratio=increase,crop=$3,setsar=1"
  if [ "$WEBP" = ffmpeg ]; then
    ffmpeg -y -i "$1" -frames:v 1 -vf "$vf" -c:v libwebp -quality 80 "$2"
  else
    local tmp
    tmp=$(mktemp -t poster).png
    ffmpeg -y -i "$1" -frames:v 1 -vf "$vf" "$tmp"
    cwebp -quiet -q 80 "$tmp" -o "$2"
    rm -f "$tmp"
  fi
}

encode "$LAND" "$OUT/bg-landscape.mp4" 1920:1080
encode "$PORT" "$OUT/bg-portrait.mp4" 1080:1920
poster "$LAND" "$OUT/bg-landscape.webp" 1920:1080
poster "$PORT" "$OUT/bg-portrait.webp" 1080:1920

ls -lh "$OUT"
