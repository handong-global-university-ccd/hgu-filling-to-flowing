#!/usr/bin/env node
/**
 * 아카이브 비하인드 사진 — 구글 드라이브 "아카이브" 공유 폴더에서 받아 웹용으로 줄이고
 * public/media/archive/behind/ 에 넣은 뒤 src/data/archive-photos.json 을 다시 쓴다.
 *
 * 사용법: npm run pull:archive                    (받기 + 변환 + 목록)
 *         npm run pull:archive -- --skip-download (이미 받은 원본으로 변환만 다시)
 * 그다음: npm run upload:media                    (R2 업로드)
 *
 * 드라이브 구조: <전공>/<팀명>_최대N장/<사진>  →  호버 제목은 팀명 ("_최대N장" 은 뗀다)
 * 폴더는 "링크가 있는 모든 사용자" 공유라 rclone 없이 공개 목록(embeddedfolderview)으로 받는다.
 * 원본은 media-src/archive/ 에 받아 둔다 (git 제외).
 *
 * HEIC: 확장자가 .jpg 여도 내용이 HEIC 인 사진이 있다. sharp 가 못 읽으면 macOS sips 로 jpg 변환하고,
 *       그것도 없으면 옆에 둔 "<원본>.conv.jpg" 를 쓴다.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const FOLDER_ID = process.env.ARCHIVE_DRIVE_FOLDER ?? "1Q6EodxJIp1dpcfgCZlsfSrz-I4IYj6mD";
const SRC = path.join(ROOT, "media-src/archive");
const OUT_DIR = "archive/behind";
const OUT = path.join(ROOT, "public/media", OUT_DIR);
const LIST = path.join(ROOT, "src/data/archive-photos.json");

/** 호버 시 222×296 으로 커진다 — 2배 크기로 잘라 둔다 (Figma 1807:15967) */
const SIZE = { width: 444, height: 592 };
const QUALITY = 80;

/** 팀 폴더 이름 → 파일 이름에 쓸 영문 slug (없으면 순번) */
const TEAM_SLUG = {
  ALLDP: "alldp",
  디와와: "diwawa",
  유니콘: "unicorn",
  "케샤!": "kesha",
  F4: "f4",
  "J House": "jhouse",
};

const nfc = (s) => s.normalize("NFC").trim();
const teamName = (folder) => nfc(folder).replace(/_최대\s*\d+장$/, "");
const IMAGE = /\.(jpe?g|png|heic|heif|webp)$/i;

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

async function download(id, dir) {
  for (const { href, name } of await list(id)) {
    const folder = href.match(/\/folders\/([\w-]+)/);
    if (folder) {
      await download(folder[1], path.join(dir, name));
      continue;
    }
    const file = href.match(/\/file\/d\/([\w-]+)/);
    if (!file) continue;
    const out = path.join(dir, name);
    if (existsSync(out) && statSync(out).size > 0) continue;
    mkdirSync(dir, { recursive: true });
    const res = await fetch(`https://drive.google.com/uc?export=download&id=${file[1]}`);
    if (!res.ok) throw new Error(`${res.status} ${name}`);
    writeFileSync(out, Buffer.from(await res.arrayBuffer()));
    console.log("  받음", path.relative(SRC, out));
  }
}

if (!process.argv.includes("--skip-download")) {
  console.log(`드라이브 ${FOLDER_ID}  →  media-src/archive`);
  await download(FOLDER_ID, SRC);
}

// ───────── 2. 변환 ─────────
async function toWebp(input, output) {
  const write = (src) =>
    sharp(src)
      .rotate() // EXIF 회전값 반영
      .resize({ ...SIZE, fit: "cover", position: "attention" })
      .webp({ quality: QUALITY })
      .toFile(output);
  try {
    await write(input);
    return;
  } catch {}
  try {
    const tmp = path.join(tmpdir(), `pull-archive-${Date.now()}.jpg`);
    execFileSync("sips", ["-s", "format", "jpeg", input, "--out", tmp], { stdio: "ignore" });
    await write(tmp);
    rmSync(tmp, { force: true });
    return;
  } catch {}
  if (existsSync(`${input}.conv.jpg`)) return write(`${input}.conv.jpg`);
  throw new Error(`읽을 수 없는 사진: ${path.relative(SRC, input)}`);
}

const entries = (dir) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => !f.startsWith("."))
        .sort()
    : [];

// 폴더를 통째로 지우지 않고 덮어쓴다 — 사진이 줄어 남는 예전 파일만 마지막에 지운다
mkdirSync(OUT, { recursive: true });

const photos = [];
for (const major of entries(SRC)) {
  if (!statSync(path.join(SRC, major)).isDirectory()) continue;
  for (const folder of entries(path.join(SRC, major))) {
    const dir = path.join(SRC, major, folder);
    if (!statSync(dir).isDirectory()) continue;
    const title = teamName(folder);
    const slug = TEAM_SLUG[title] ?? `team-${photos.length}`;
    const files = entries(dir).filter((f) => IMAGE.test(f) && !f.endsWith(".conv.jpg"));
    for (const [i, f] of files.entries()) {
      const name = `${slug}-${String(i + 1).padStart(2, "0")}.webp`;
      await toWebp(path.join(dir, f), path.join(OUT, name));
      photos.push({ src: `/media/${OUT_DIR}/${name}`, title });
    }
    console.log(`  ${title}: ${files.length}장`);
  }
}

const keep = new Set(photos.map((p) => path.basename(p.src)));
for (const f of entries(OUT)) {
  if (keep.has(f)) continue;
  try {
    rmSync(path.join(OUT, f));
  } catch {
    console.warn(`  지우지 못한 예전 파일: ${f}`);
  }
}

// ───────── 3. 목록 ─────────
writeFileSync(LIST, JSON.stringify(photos, null, 2) + "\n");
console.log(`\n${photos.length}장 → src/data/archive-photos.json\n다음: npm run upload:media`);
