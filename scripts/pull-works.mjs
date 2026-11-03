#!/usr/bin/env node
/**
 * 구글 드라이브 "디그리어 작품취합" 폴더(링크 공개)의 작품 자료를 받아 웹용으로 변환하고,
 * 작품 slug 에 맞춰 public/media/works/<slug>/ 에 넣은 뒤 src/data/work-media.json 을 다시 쓴다.
 *
 * 사용법: npm run pull:works                 (받기 + 변환 + json)
 *         npm run pull:works -- --force      (이미 변환한 것도 다시)
 * 그다음: npm run upload:media               (R2 업로드)
 *
 * 필요: ffmpeg (영상 변환·포스터) — brew install ffmpeg
 *       pdftoppm (PDF 썸네일·전체보기) — brew install poppler
 *
 * 드라이브 규칙 (폴더 안 '!!!!!!!!! 예시 확인 필수' 참고)
 *   <분야>/<개인|팀>/<이름 (학번) | 팀명>/
 *     thumbnail1_*.jpg, thumbnail2_*.jpg     → thumb-a.webp, thumb-b.webp (Works 카드, 호버 시 교차)
 *     작품파일_…/01_….jpg, 02_….mp4 …        → 상세 오른쪽에 번호 순서대로
 *       .jpg .png        → 이미지 (아주 긴 이미지는 여러 장으로 나눈다 — webp 최대 16383px)
 *       .mp4 .mov        → 1080p 이하 mp4 (24MB 이하) + 첫 장면 포스터
 *       .youtube / .docx / 구글 문서 → 안의 주소: YouTube 면 임베드, 그 밖은 링크
 *     전체보기_*.jpg/.pdf → 작품파일이 비어 있을 때만 대신 쓴다 (작품파일과 같은 내용을 한 장으로 이은 것)
 *                          PDF 는 페이지마다 이미지로 (pdftoppm). 썸네일이 PDF 면 첫 페이지를 쓴다
 *
 * 화질 설정(SIZE·QUALITY·영상 설정)을 바꾸면 다음 실행에서 모든 결과를 다시 만든다 (_settings.json).
 * 중간에 끊겨도 다시 돌리면 이미 새 설정으로 만든 것은 건너뛴다.
 *
 * 원본은 media-src/drive-works/ 에 파일 ID 이름으로 받아 둔다 (git 제외, 다시 받지 않는다).
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import sharp from "sharp";
import { WORKS } from "../src/data/works.ts";
import { DESIGNERS } from "../src/data/designers.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const FOLDER = process.env.WORKS_FOLDER ?? "1EwC_TMej9m5uBkC-JDUgaxMoTQOr2xb_";
const CACHE = path.join(ROOT, "media-src/drive-works");
const OUT = path.join(ROOT, "public/media/works");
const JSON_OUT = path.join(ROOT, "src/data/work-media.json");
const FORCE = process.argv.includes("--force");

/** 썸네일은 카드(456×270)의 2배보다 넉넉히, 상세 이미지는 오른쪽 칸(1518)보다 크게, 영상은 1080p */
const SIZE = { thumb: 1200, page: 2000, video: 1920 };
const MAX_WEBP = 16000;
const QUALITY = 88;
/** 영상: 화질(CRF)·최대 비트레이트·오디오 */
const VIDEO = { crf: 22, maxrate: "10M", bufsize: "20M", audio: "192k" };
/** Cloudflare Pages 파일 1개 한도(25MB)보다 조금 작게 — 넘으면 비트레이트를 맞춰 다시 인코딩 */
const MAX_VIDEO_BYTES = 24 * 1024 * 1024;

const FIELD_DIR = {
  "AX Product": "ax-product",
  Communication: "communication",
  Service: "service",
  "UX Product": "ux-product",
  "UX Space": "ux-space",
};
/** 드라이브 폴더 이름 → 데이터 팀명 (대소문자·띄어쓰기·기호는 무시하고 비교) */
const TEAM_ALIAS = {
  빵구떵구: "빵꾸떵꾸",
  framer: "FiveGuys_2",
  공3즈: "03Z",
  헤일로: "공드리",
  halo: "공드리",
};
/** 동명이인 — 폴더 이름의 학번으로 구분 */
const DUP_SID = {
  22100133: "sieun-kim",
  22100134: "sieun-kim-2",
  22200184: "jimin-kim",
  22100191: "jimin-kim-2",
  22200205: "hagyeong-kim",
  22200206: "hagyeong-kim-2",
};

const nfc = (s) => s.normalize("NFC").trim();
const key = (s) =>
  nfc(s)
    .toLowerCase()
    .replace(/[\s!:._\-'’]/g, "");
const teamKey = (s) => key(TEAM_ALIAS[key(s)] ?? TEAM_ALIAS[nfc(s)] ?? s);

// ───────── 1. 드라이브 폴더 목록 (링크 공개 폴더의 embeddedfolderview) ─────────
async function list(id) {
  for (let i = 0; i < 4; i++) {
    try {
      // 응답이 멈추면 끝없이 기다리지 않게 20초 제한
      const res = await fetch(`https://drive.google.com/embeddedfolderview?id=${id}`, {
        signal: AbortSignal.timeout(20_000),
      });
      if (!res.ok) throw new Error(String(res.status));
      const html = await res.text();
      const items = [];
      const re = /<a href="([^"]+)"[^>]*>[\s\S]*?<div class="flip-entry-title">([\s\S]*?)<\/div>/g;
      for (const m of html.matchAll(re)) {
        const name = nfc(
          m[2]
            .replace(/&amp;/g, "&")
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">"),
        );
        const folder = m[1].match(/\/folders\/([^?/]+)/);
        const file = m[1].match(/\/d\/([^/?]+)/);
        if (folder) items.push({ dir: true, name, id: folder[1] });
        else if (file) items.push({ dir: false, name, id: file[1] });
      }
      return items;
    } catch {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  throw new Error(`폴더를 읽지 못했습니다: ${id}`);
}

// 하위 폴더는 동시에 몇 개씩 읽는다 (한 폴더씩이면 수백 개 폴더에 몇 분씩 걸린다)
let listed = 0;
async function walk(id, parts = []) {
  const items = await list(id);
  if (++listed % 25 === 0) console.log(`  폴더 ${listed}개 읽음`);
  const node = { parts, files: items.filter((x) => !x.dir), dirs: [] };
  const dirs = items.filter((x) => x.dir);
  for (let i = 0; i < dirs.length; i += 6) {
    const batch = await Promise.all(
      dirs.slice(i, i + 6).map(async (d) => ({ name: d.name, ...(await walk(d.id, [...parts, d.name])) })),
    );
    node.dirs.push(...batch);
  }
  return node;
}

// ───────── 2. 작품 폴더 → slug ─────────
const THUMB = /^thu?mb?n?a?il[\s_-]*0?([12])/i;
const PAGES_DIR = /(작품|작업)\s*파일/;
const OVERVIEW = /^전체\s*보기/;

function soloSlug(field, folder) {
  const m = folder.match(/^(.+?)\s*\(?\s*(\d{8})?\s*\)?$/);
  const name = nfc(m[1]);
  const sid = m[2];
  const solos = WORKS.filter((w) => w.field === field && !w.teamName);
  if (sid && DUP_SID[sid]) return solos.find((w) => w.designerSlugs[0] === DUP_SID[sid])?.slug;
  const hits = solos.filter((w) => DESIGNERS.find((d) => d.slug === w.designerSlugs[0])?.nameKo === name);
  return hits.length === 1 ? hits[0].slug : undefined;
}

function teamSlug(field, folder) {
  const k = teamKey(folder);
  return WORKS.find((w) => w.field === field && w.teamName && teamKey(w.teamName) === k)?.slug;
}

/** 썸네일이나 작품파일 폴더가 있는 폴더 = 작품 폴더 */
function collect(node, out = []) {
  const isWork = node.files.some((f) => THUMB.test(f.name)) || node.dirs.some((d) => PAGES_DIR.test(d.name));
  if (isWork && node.parts.length >= 2) out.push(node);
  else for (const d of node.dirs) collect(d, out);
  return out;
}

// ───────── 3. 받기 ─────────
async function download(file) {
  mkdirSync(CACHE, { recursive: true });
  const dest = path.join(CACHE, file.id);
  if (existsSync(dest) && statSync(dest).size > 0) return dest;
  console.log(`      받는 중: ${file.name}`);
  // 구글 문서(ID 가 긴 것)는 글자로, 나머지는 원본 그대로
  const urls = [
    ...(file.id.length > 40 ? [`https://docs.google.com/document/d/${file.id}/export?format=txt`] : []),
    `https://drive.usercontent.google.com/download?id=${file.id}&export=download&confirm=t`,
  ];
  for (const url of urls) {
    for (let i = 0; i < 3; i++) {
      try {
        // 큰 영상(1GB 가까운 4K 원본도 있다)은 메모리에 다 올리지 않고 바로 파일로 쓴다
        const res = await fetch(url, { signal: AbortSignal.timeout(30 * 60_000) });
        if (!res.ok || (res.headers.get("content-type") ?? "").includes("text/html")) throw new Error();
        await pipeline(Readable.fromWeb(res.body), createWriteStream(`${dest}.part`));
        renameSync(`${dest}.part`, dest);
        return dest;
      } catch {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  }
  throw new Error(`받지 못했습니다: ${file.name}`);
}

// ───────── 4. 변환 ─────────
const ext = (name) => path.extname(name).toLowerCase();
const isVideo = (name) => [".mp4", ".mov", ".m4v"].includes(ext(name)) || /영상/.test(name);

/** 파일 안의 주소 — .youtube(글자), .docx(zip 안 xml), 구글 문서(txt) */
function urlsIn(file, name) {
  let text = readFileSync(file).toString("utf8");
  if (ext(name) === ".docx" || text.startsWith("PK")) {
    text = execFileSync("unzip", ["-p", file, "word/document.xml", "word/_rels/document.xml.rels"]).toString(
      "utf8",
    );
  }
  return [...new Set(text.match(/https?:\/\/[^\s"'<>)]+/g) ?? [])].filter(
    (u) =>
      !/schemas\.(openxmlformats|microsoft)|w3\.org|purl\.org/.test(u) &&
      !/^https?:\/\/(www\.)?(youtu\.be|youtube\.com)\/?$/.test(u), // 주소가 잘려 도메인만 남은 것
  );
}

const youtubeId = (u) =>
  u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/))([\w-]{11})/)?.[1];

/**
 * 변환 결과가 원본보다 새것이면 다시 만들지 않는다.
 * 드라이브에서 파일을 바꾸면 ID 가 달라져 새로 받으므로(원본이 더 새것) 그 결과만 다시 만든다
 */
// 화질 설정이 바뀐 시각 — 그 전에 만든 결과는 옛 설정이라 다시 만든다
const SETTINGS_FILE = path.join(OUT, "_settings.json");
const SETTINGS = JSON.stringify({ SIZE, QUALITY, VIDEO, MAX_VIDEO_BYTES });
const settingsSince = (() => {
  try {
    const saved = JSON.parse(readFileSync(SETTINGS_FILE, "utf8"));
    if (saved.settings === SETTINGS) return saved.since;
  } catch {}
  const since = Date.now();
  mkdirSync(OUT, { recursive: true });
  writeFileSync(SETTINGS_FILE, JSON.stringify({ settings: SETTINGS, since }, null, 2));
  return since;
})();

const fresh = (src, out) => {
  if (FORCE || !existsSync(out)) return false;
  const t = statSync(out).mtimeMs;
  return t >= statSync(src).mtimeMs && t >= settingsSince;
};

/** PDF 를 페이지마다 PNG 로 (pdftoppm). first 면 첫 페이지만 */
function pdfPages(input, dir, width, first = false) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  try {
    execFileSync("pdftoppm", [
      "-png",
      ...(first ? ["-f", "1", "-l", "1"] : []),
      "-scale-to-x",
      String(width),
      "-scale-to-y",
      "-1",
      input,
      path.join(dir, "page"),
    ]);
  } catch (err) {
    rmSync(dir, { recursive: true, force: true });
    if (err.code === "ENOENT") throw new Error("PDF 변환에 pdftoppm 이 필요합니다 → brew install poppler");
    throw err;
  }
  return readdirSync(dir)
    .filter((f) => f.endsWith(".png"))
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]))
    .map((f) => path.join(dir, f));
}

const isPdf = (file) => readFileSync(file).subarray(0, 5).toString() === "%PDF-";

async function toWebp(input, output, width) {
  if (fresh(input, output)) return;
  mkdirSync(path.dirname(output), { recursive: true });
  // 썸네일을 PDF 로 올린 경우 첫 페이지를 쓴다
  if (isPdf(input)) {
    const tmp = `${output}.pdf-page`;
    const [png] = pdfPages(input, tmp, width * 2, true);
    await sharp(png).resize({ width, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(output);
    rmSync(tmp, { recursive: true, force: true });
    return;
  }
  await sharp(input, { limitInputPixels: false })
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(output);
}

/** 상세 이미지 — 너비를 줄이고, 너무 길면 세로로 나눈다 */
async function pageImages(input, base) {
  const meta = await sharp(input, { limitInputPixels: false }).rotate().metadata();
  const srcW = meta.autoOrient?.width ?? meta.width;
  const srcH = meta.autoOrient?.height ?? meta.height;
  const w = Math.min(SIZE.page, srcW);
  const h = Math.round((srcH * w) / srcW);
  const n = Math.ceil(h / MAX_WEBP);
  const outs = [];
  const parts = Array.from({ length: n }, (_, i) => `${base}-${i + 1}.webp`);
  if (n > 1 && parts.every((out) => fresh(input, out))) {
    const step = Math.ceil(h / n);
    return parts.map((file, i) => ({ file, width: w, height: Math.min(step, h - i * step) }));
  }
  if (n === 1) {
    const out = `${base}.webp`;
    await toWebp(input, out, w);
    outs.push({ file: out, width: w, height: h });
    return outs;
  }
  const resized = await sharp(input, { limitInputPixels: false })
    .rotate()
    .resize({ width: w })
    .png()
    .toBuffer();
  const step = Math.ceil(h / n);
  for (let i = 0; i < n; i++) {
    const out = `${base}-${i + 1}.webp`;
    const top = i * step;
    const height = Math.min(step, h - top);
    if (!fresh(input, out)) {
      await sharp(resized, { limitInputPixels: false })
        .extract({ left: 0, top, width: w, height })
        .webp({ quality: QUALITY })
        .toFile(out);
    }
    outs.push({ file: out, width: w, height });
  }
  return outs;
}

function videoSize(file) {
  // -show_streams 는 ffprobe 버전과 상관없이 동작한다 (stream_side_data 지정은 5.x 이상에서만 된다)
  const out = execFileSync("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_streams",
    "-of",
    "json",
    file,
  ]).toString();
  const s = JSON.parse(out).streams[0];
  const rotation =
    s.side_data_list?.find((d) => d.rotation !== undefined)?.rotation ?? Number(s.tags?.rotate ?? 0);
  const rot = Math.abs(rotation);
  return rot === 90 || rot === 270
    ? { width: s.height, height: s.width }
    : { width: s.width, height: s.height };
}

function encodeMp4(input, output, rate) {
  execFileSync("ffmpeg", [
    "-y",
    "-v",
    "error",
    "-i",
    input,
    "-vf",
    `scale='min(${SIZE.video},iw)':-2,fps=30`,
    "-c:v",
    "libx264",
    "-profile:v",
    "high",
    "-pix_fmt",
    "yuv420p",
    "-preset",
    "slow",
    ...rate,
    "-c:a",
    "aac",
    "-b:a",
    VIDEO.audio,
    "-movflags",
    "+faststart",
    output,
  ]);
}

function duration(file) {
  const out = execFileSync("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "csv=p=0",
    file,
  ]);
  return Number(out.toString().trim());
}

/** PDF → 페이지마다 이미지 (p01-1.webp, p01-2.webp …). 긴 페이지는 pageImages 처럼 나눈다 */
async function pdfImages(input, base) {
  const tmp = `${base}.pdf-pages`;
  const outs = [];
  for (const [i, png] of pdfPages(input, tmp, SIZE.page).entries()) {
    outs.push(...(await pageImages(png, `${base}-${i + 1}`)));
  }
  rmSync(tmp, { recursive: true, force: true });
  return outs;
}

async function toMp4(input, base) {
  const mp4 = `${base}.mp4`;
  const poster = `${base}.webp`;
  if (!fresh(input, mp4)) {
    // 너비 1920 이하, 짝수 크기. 소리는 남긴다 (작품 영상) — 화면에서는 음소거 자동재생, 컨트롤로 켤 수 있다
    encodeMp4(input, `${mp4}.tmp.mp4`, [
      "-crf",
      String(VIDEO.crf),
      "-maxrate",
      VIDEO.maxrate,
      "-bufsize",
      VIDEO.bufsize,
    ]);
    if (statSync(`${mp4}.tmp.mp4`).size > MAX_VIDEO_BYTES) {
      // 길이에 맞춰 평균 비트레이트를 정해 다시 — 24MB 안에 들어오게
      const sec = duration(input);
      const kbps = Math.floor(((MAX_VIDEO_BYTES * 8) / sec / 1000) * 0.92) - 192;
      if (kbps < 300)
        throw new Error(`영상이 너무 길어 24MB 안에 넣을 수 없음 (${Math.round(sec)}초) — YouTube 로`);
      encodeMp4(input, `${mp4}.tmp.mp4`, [
        "-b:v",
        `${kbps}k`,
        "-maxrate",
        `${kbps}k`,
        "-bufsize",
        `${kbps * 2}k`,
      ]);
    }
    renameSync(`${mp4}.tmp.mp4`, mp4);
  }
  if (!fresh(mp4, poster)) {
    const png = `${base}.poster.png`;
    execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", "0.5", "-i", mp4, "-frames:v", "1", png]);
    await sharp(png).webp({ quality: QUALITY }).toFile(poster);
    rmSync(png, { force: true });
  }
  return { mp4, poster, ...videoSize(mp4) };
}

// ───────── 실행 ─────────
console.log("드라이브 폴더 읽는 중…");
// 폴더 목록은 30분 동안 저장해 두고 다시 쓴다 — 중간에 끊겨 이어서 돌릴 때 225개 폴더를 또 읽지 않게
const TREE_CACHE = path.join(CACHE, "_tree.json");
mkdirSync(CACHE, { recursive: true });
const tree =
  !FORCE && existsSync(TREE_CACHE) && Date.now() - statSync(TREE_CACHE).mtimeMs < 30 * 60_000
    ? JSON.parse(readFileSync(TREE_CACHE, "utf8"))
    : await walk(FOLDER);
writeFileSync(TREE_CACHE, JSON.stringify(tree));
const folders = collect(tree).filter((n) => !n.parts[0].startsWith("!"));

const version = (file) => createHash("md5").update(readFileSync(file)).digest("hex").slice(0, 8);
const url = (file) => `/media/works/${path.relative(OUT, file).split(path.sep).join("/")}?v=${version(file)}`;

const media = {};
const report = { ok: [], skipped: [], warn: [], note: [] };

let done = 0;
for (const node of folders) {
  // 진행 표시 — 받기·변환 중에는 한동안 아무 출력이 없어서 멈춘 것처럼 보인다
  console.log(`  [${++done}/${folders.length}] ${node.parts.join("/")}`);
  const field = FIELD_DIR[node.parts[0]];
  const folder = node.parts.at(-1);
  const solo = node.parts.some((p) => /^개인/.test(p));
  const slug = field && (solo ? soloSlug(field, folder) : teamSlug(field, folder));
  const label = node.parts.join("/");
  if (!slug) {
    report.skipped.push(`${label} — 데이터에서 이 ${solo ? "디자이너" : "팀"}의 작품을 찾지 못함`);
    continue;
  }
  const dir = path.join(OUT, slug);
  mkdirSync(dir, { recursive: true });
  const entry = { thumbnails: [], pages: [] };

  // 썸네일 — 작품 폴더 바로 안 (없으면 작품파일 폴더 안)
  const pagesDir = node.dirs.find((d) => PAGES_DIR.test(d.name));
  const thumbFiles = [...node.files, ...(pagesDir?.files ?? [])].filter((f) => THUMB.test(f.name));
  for (const n of ["1", "2"]) {
    const f = thumbFiles.find((x) => x.name.match(THUMB)[1] === n);
    if (!f) continue;
    const out = path.join(dir, `thumb-${n === "1" ? "a" : "b"}.webp`);
    try {
      await toWebp(await download(f), out, SIZE.thumb);
      entry.thumbnails.push(url(out));
    } catch (e) {
      report.warn.push(`${label}/${f.name} — ${e.message}`);
    }
  }
  if (entry.thumbnails.length === 1) entry.thumbnails.push(entry.thumbnails[0]);

  // 상세 — 번호 순서
  let pageFiles = (pagesDir?.files ?? [])
    .filter((f) => /^\d+/.test(f.name) && !THUMB.test(f.name))
    .sort(
      (a, b) =>
        Number(a.name.match(/^\d+/)[0]) - Number(b.name.match(/^\d+/)[0]) || a.name.localeCompare(b.name),
    );
  // 같은 번호에 YouTube 링크(.youtube / .docx)가 있으면 그 번호의 영상 파일은 건너뛴다 — 같은 영상이 두 번 나온다
  const linked = new Set(
    pageFiles.filter((f) => [".youtube", ".docx"].includes(ext(f.name))).map((f) => f.name.match(/^\d+/)[0]),
  );
  pageFiles = pageFiles.filter((f) => !(isVideo(f.name) && linked.has(f.name.match(/^\d+/)[0])));
  // 작품파일이 비어 있으면 전체보기로 대신한다
  if (!pageFiles.length) {
    pageFiles = [...node.files, ...(pagesDir?.files ?? [])].filter((f) => OVERVIEW.test(f.name));
    if (pageFiles.length) report.note.push(`${label} — 작품파일이 없어 전체보기로 대신함`);
  }
  let i = 0;
  for (const f of pageFiles) {
    i += 1;
    const base = path.join(dir, `p${String(i).padStart(2, "0")}`);
    try {
      const src = await download(f);
      const e = ext(f.name);
      if (e === ".youtube" || e === ".docx" || e === ".txt" || f.id.length > 40) {
        for (const u of urlsIn(src, f.name)) {
          const id = youtubeId(u);
          entry.pages.push(id ? { type: "youtube", id } : { type: "link", href: u });
        }
        continue;
      }
      if (isPdf(src)) {
        for (const img of await pdfImages(src, base)) {
          entry.pages.push({ type: "image", src: url(img.file), width: img.width, height: img.height });
        }
        continue;
      }
      if (isVideo(f.name)) {
        const v = await toMp4(src, base);
        entry.pages.push({
          type: "video",
          src: url(v.mp4),
          poster: url(v.poster),
          width: v.width,
          height: v.height,
        });
        continue;
      }
      for (const img of await pageImages(src, base)) {
        entry.pages.push({ type: "image", src: url(img.file), width: img.width, height: img.height });
      }
    } catch (err) {
      report.warn.push(`${label}/${f.name} — ${err.message.split("\n")[0]}`);
    }
  }

  if (!entry.thumbnails.length && !entry.pages.length) {
    report.skipped.push(`${label} — 아직 파일 없음`);
    continue;
  }
  media[slug] = entry;
  report.ok.push(`${label} → ${slug} (썸네일 ${entry.thumbnails.length}, 상세 ${entry.pages.length})`);
}

// 이번에 쓰지 않은 옛 파일 정리 (photo.webp 는 pull:drive 가 만든 팀 사진이라 남긴다)
for (const [slug, entry] of Object.entries(media)) {
  const used = new Set(
    [...entry.thumbnails, ...entry.pages.flatMap((p) => [p.src, p.poster])]
      .filter(Boolean)
      .map((u) => u.split("?")[0].split("/").pop()),
  );
  for (const f of readdirSync(path.join(OUT, slug))) {
    if (f !== "photo.webp" && !used.has(f)) rmSync(path.join(OUT, slug, f), { force: true });
  }
}

const sorted = Object.fromEntries(
  Object.keys(media)
    .sort()
    .map((k) => [k, media[k]]),
);
writeFileSync(JSON_OUT, JSON.stringify(sorted, null, 2) + "\n");

const missing = WORKS.filter((w) => !media[w.slug]).map((w) => w.teamName ?? w.title);
console.log(`\n반영 ${report.ok.length}개`);
for (const l of report.ok) console.log("  ✓", l);
if (report.note.length) {
  console.log(`\n전체보기로 대신 ${report.note.length}개`);
  for (const l of report.note) console.log("  ", l);
}
if (report.warn.length) {
  console.log(`\n⚠️  변환 실패 ${report.warn.length}개`);
  for (const l of report.warn) console.log("  ", l);
}
if (report.skipped.length) {
  console.log(`\n건너뜀 ${report.skipped.length}개`);
  for (const l of report.skipped) console.log("  ", l);
}
console.log(`\n자료 없는 작품 ${missing.length}개: ${missing.join(", ")}`);
console.log("\n다음: npm run upload:media");
