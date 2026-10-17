#!/usr/bin/env node
/**
 * 구글 드라이브 "프로필 to 개발자" 폴더의 사진을 받아 웹용으로 줄이고,
 * 디자이너·작품 slug 에 맞춰 public/media 에 넣은 뒤 src/data/media-manifest.json 을 다시 쓴다.
 *
 * 사용법: npm run pull:drive            (받기 + 변환 + manifest)
 *         npm run pull:drive -- --skip-download   (이미 받은 원본으로 변환만 다시)
 * 그다음: npm run upload:media           (R2 업로드)
 *
 * 준비: rclone 에 구글 드라이브 리모트 `gdrive` 가 있어야 한다 (README "구글 드라이브 사진" 참고).
 *
 * 드라이브 규칙 ('2026 졸업전시 웹사이트 정보 취합' 시트의 이름·팀명 기준)
 *   개인사진/<한국어 이름>.jpg              → public/media/designers/<slug>/profile.webp
 *   개인사진/<이름>_<팀명>.jpg              동명이인은 팀명으로 구분 (김시은_쩜오, 김지민_섭이스 …)
 *   팀사진/<팀명>.jpg                       → public/media/works/<slug>/photo.webp (같은 팀의 모든 작품)
 *   확장자가 없거나 HEIC 여도 된다 — 내용으로 형식을 판단하고, sharp 가 못 읽으면 macOS sips 로 변환한다.
 *
 * 원본은 media-src/drive/ 에 받아 둔다 (git 제외). 드라이브 원본은 건드리지 않는다.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { DESIGNERS } from "../src/data/designers.ts";
import { WORKS } from "../src/data/works.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const REMOTE = process.env.DRIVE_REMOTE ?? "gdrive";
const DRIVE_DIR = process.env.DRIVE_DIR ?? "프로필 to 개발자";
const SRC = path.join(ROOT, "media-src/drive");
const OUT = path.join(ROOT, "public/media");
const MANIFEST = path.join(ROOT, "src/data/media-manifest.json");

/** 화면 표시 크기의 2배 남짓 — 프로필 338×452, 팀 사진 338×225 (모바일 358) */
const SIZE = { profile: 800, photo: 900 };
const QUALITY = 82;

/** 드라이브 파일명에 쓰인 다른 표기 → 데이터의 팀명 */
const TEAM_ALIAS = { 파이브가이즈: "FiveGuys" };

// macOS 로컬 파일명에서 rclone 이 바꿔 둔 전각 기호(：／)도 원래대로
const nfc = (s) => s.normalize("NFC").replace(/：/g, ":").replace(/／/g, "/").trim();
const baseName = (file) => nfc(path.basename(file, path.extname(file)));
const teamKey = (s) => nfc(TEAM_ALIAS[nfc(s)] ?? s).toLowerCase();

// ───────── 1. 드라이브에서 받기 ─────────
if (!process.argv.includes("--skip-download")) {
  console.log(`${REMOTE}:${DRIVE_DIR}  →  media-src/drive`);
  execFileSync("rclone", ["copy", `${REMOTE}:${DRIVE_DIR}`, SRC, "--drive-shared-with-me", "--progress"], {
    stdio: "inherit",
  });
}

// ───────── 2. 변환 ─────────
async function toWebp(input, output, width) {
  mkdirSync(path.dirname(output), { recursive: true });
  const write = (src) =>
    sharp(src)
      .rotate() // EXIF 회전값 반영
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(output);
  try {
    await write(input);
  } catch {
    // HEIC 등 sharp 기본 빌드가 못 읽는 형식 → macOS sips 로 jpg 변환 후 다시
    const tmp = path.join(tmpdir(), `pull-drive-${Date.now()}.jpg`);
    execFileSync("sips", ["-s", "format", "jpeg", input, "--out", tmp], { stdio: "ignore" });
    await write(tmp);
    rmSync(tmp, { force: true });
  }
}

const files = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).filter((f) => !f.startsWith(".") && statSync(path.join(dir, f)).isFile())
    : [];

const report = { ok: [], skipped: [] };

// 팀 사진 — 같은 팀명의 작품 전부 (Communication·Service 처럼 한 팀이 두 분야에 있는 경우)
for (const file of files(path.join(SRC, "팀사진"))) {
  const team = teamKey(baseName(file));
  const works = WORKS.filter((w) => w.teamName && teamKey(w.teamName) === team);
  if (works.length === 0) {
    report.skipped.push(`팀사진/${file} — 데이터에 이 팀명이 없음`);
    continue;
  }
  for (const w of works) {
    await toWebp(path.join(SRC, "팀사진", file), path.join(OUT, "works", w.slug, "photo.webp"), SIZE.photo);
    report.ok.push(`팀사진/${file} → works/${w.slug}`);
  }
}

// 개인 사진 — 이름이 하나면 바로, 동명이인은 파일명의 팀명으로 구분
for (const file of files(path.join(SRC, "개인사진"))) {
  const [name, team] = baseName(file).split("_").map(nfc);
  let matches = DESIGNERS.filter((d) => nfc(d.nameKo) === name);
  if (matches.length > 1 && team) {
    const teamSlugs = new Set(
      WORKS.filter((w) => w.teamName && teamKey(w.teamName) === teamKey(team)).flatMap(
        (w) => w.designerSlugs,
      ),
    );
    matches = matches.filter((d) => teamSlugs.has(d.slug));
  }
  if (matches.length !== 1) {
    report.skipped.push(
      `개인사진/${file} — ${matches.length === 0 ? "데이터에 이 이름이 없음" : "동명이인 — 파일명을 '이름_팀명' 으로"}`,
    );
    continue;
  }
  const d = matches[0];
  await toWebp(
    path.join(SRC, "개인사진", file),
    path.join(OUT, "designers", d.slug, "profile.webp"),
    SIZE.profile,
  );
  report.ok.push(`개인사진/${file} → designers/${d.slug}`);
}

// ───────── 3. manifest — 실제로 있는 파일 기준으로 다시 쓴다 ─────────
// 주소 끝에 내용 해시(?v=)를 붙인다 — R2 는 1년 캐시라, 사진을 바꿔도 같은 주소면 옛 사진이 보인다
const version = (file) => createHash("md5").update(readFileSync(file)).digest("hex").slice(0, 8);
const scan = (kind, file) =>
  Object.fromEntries(
    (existsSync(path.join(OUT, kind)) ? readdirSync(path.join(OUT, kind)) : [])
      .filter((slug) => existsSync(path.join(OUT, kind, slug, file)))
      .sort()
      .map((slug) => [slug, `/media/${kind}/${slug}/${file}?v=${version(path.join(OUT, kind, slug, file))}`]),
  );
const manifest = { designers: scan("designers", "profile.webp"), works: scan("works", "photo.webp") };
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");

// ───────── 4. 결과 ─────────
const missingDesigners = DESIGNERS.filter((d) => !manifest.designers[d.slug]).map((d) => d.nameKo);
const missingTeams = [
  ...new Set(WORKS.filter((w) => w.teamName && !manifest.works[w.slug]).map((w) => w.teamName)),
];
console.log(`\n✓ 변환 ${report.ok.length}개`);
if (report.skipped.length)
  console.log(`\n⚠ 건너뜀 ${report.skipped.length}개\n  ${report.skipped.join("\n  ")}`);
if (missingDesigners.length)
  console.log(`\n· 프로필 사진 없음 (${missingDesigners.length}명): ${missingDesigners.join(", ")}`);
if (missingTeams.length)
  console.log(`\n· 팀 사진 없음 (${missingTeams.length}팀): ${missingTeams.join(", ")}`);
console.log(`\nmanifest 갱신 → src/data/media-manifest.json\n다음: npm run upload:media`);
