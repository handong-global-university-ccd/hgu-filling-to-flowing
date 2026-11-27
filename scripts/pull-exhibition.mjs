#!/usr/bin/env node
/**
 * 아카이브 Exhibition View 사진 — 구글 드라이브 "Archive 페이지" 공유 폴더에서 받아 웹용으로 줄이고
 * public/media/archive/exhibition/ 에 넣은 뒤 src/data/exhibition-photos.json 을 다시 쓴다.
 *
 * 사용법: npm run pull:exhibition                    (받기 + 변환 + 목록)
 *         npm run pull:exhibition -- --skip-download (이미 받은 원본으로 변환만 다시)
 * 그다음: npm run upload:media                       (R2 업로드)
 *
 * 순서는 드라이브 파일 이름순. 화면은 810×540(3:2) 이라 2배 크기 3:2 로 잘라 둔다 (Figma 1807:16563).
 * 폴더는 "링크가 있는 모든 사용자" 공유라 rclone 없이 공개 목록(embeddedfolderview)으로 받는다.
 * 원본은 media-src/exhibition/ 에 받아 둔다 (git 제외).
 */
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const FOLDER_ID = process.env.EXHIBITION_DRIVE_FOLDER ?? "1F_gcb5AFRKXFJfwIOVf_OFCZ0Xtxfkt4";
const SRC = path.join(ROOT, "media-src/exhibition");
const OUT_DIR = "archive/exhibition";
const OUT = path.join(ROOT, "public/media", OUT_DIR);
const LIST = path.join(ROOT, "src/data/exhibition-photos.json");

const SIZE = { width: 1620, height: 1080 };
const QUALITY = 82;
const IMAGE = /\.(jpe?g|png|webp)$/i;

// ───────── 1. 드라이브에서 받기 ─────────
async function list(id) {
  const html = await (await fetch(`https://drive.google.com/embeddedfolderview?id=${id}`)).text();
  const re = /<a href="([^"]+)"[^>]*>[\s\S]*?<div class="flip-entry-title">([\s\S]*?)<\/div>/g;
  const unescape = (s) =>
    s
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  return [...html.matchAll(re)].map(([, href, name]) => ({ href, name: unescape(name) }));
}

if (!process.argv.includes("--skip-download")) {
  console.log(`드라이브 ${FOLDER_ID}  →  media-src/exhibition`);
  mkdirSync(SRC, { recursive: true });
  for (const { href, name } of await list(FOLDER_ID)) {
    const file = href.match(/\/file\/d\/([\w-]+)/);
    if (!file || !IMAGE.test(name)) continue;
    const out = path.join(SRC, name);
    if (existsSync(out) && statSync(out).size > 0) continue;
    const res = await fetch(`https://drive.google.com/uc?export=download&id=${file[1]}`);
    if (!res.ok) throw new Error(`${res.status} ${name}`);
    writeFileSync(out, Buffer.from(await res.arrayBuffer()));
    console.log("  받음", name);
  }
}

// ───────── 2. 변환 ─────────
mkdirSync(OUT, { recursive: true });
const files = readdirSync(SRC)
  .filter((f) => IMAGE.test(f))
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

const photos = [];
for (const [i, f] of files.entries()) {
  const name = `view-${String(i + 1).padStart(2, "0")}.webp`;
  await sharp(path.join(SRC, f))
    .rotate() // EXIF 회전값 반영
    .resize({ ...SIZE, fit: "cover", position: "attention" })
    .webp({ quality: QUALITY })
    .toFile(path.join(OUT, name));
  photos.push(`/media/${OUT_DIR}/${name}`);
}

const keep = new Set(photos.map((p) => path.basename(p)));
for (const f of readdirSync(OUT)) if (!keep.has(f)) rmSync(path.join(OUT, f), { force: true });

// ───────── 3. 목록 ─────────
writeFileSync(LIST, JSON.stringify(photos, null, 2) + "\n");
console.log(`\n${photos.length}장 → src/data/exhibition-photos.json\n다음: npm run upload:media`);
