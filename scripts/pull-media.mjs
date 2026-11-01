#!/usr/bin/env node
// R2 버킷의 media/ 를 public/media/ 로 내려받는다.
// Cloudflare Pages 빌드에서 `npm run build:pages` 로 next build 직전에 실행된다.
//
// 필요한 환경변수 (Pages → Settings → Variables and Secrets, Production·Preview 둘 다)
//   R2_ACCOUNT_ID         Cloudflare 계정 ID
//   R2_ACCESS_KEY_ID      R2 API 토큰의 Access Key ID      (Secret 으로 등록)
//   R2_SECRET_ACCESS_KEY  R2 API 토큰의 Secret Access Key  (Secret 으로 등록)
//   R2_BUCKET             버킷 이름 (기본값 hgu-degree-2026)
//
// 로컬에서 환경변수 없이 실행하면 아무것도 하지 않고 넘어간다 (public/media 를 그대로 사용).
// Pages 빌드(CF_PAGES=1)에서 환경변수가 없으면 미디어 없는 사이트가 배포되지 않도록 실패시킨다.
//
// 의존성 없이 Node 내장 모듈만 사용 (R2 S3 API + SigV4 서명).

import { createHash, createHmac } from "node:crypto";
import { createWriteStream, realpathSync } from "node:fs";
import { mkdir, rename, rm, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { pathToFileURL } from "node:url";

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET = "hgu-degree-2026",
  R2_PREFIX = "media/",
  R2_ENDPOINT, // 테스트용 덮어쓰기. 평소엔 비워둔다
  MEDIA_OUT_DIR = "public",
  CF_PAGES,
} = process.env;

const MAX_BYTES = 25 * 1024 * 1024; // Cloudflare Pages 파일 1개 한도 (25 MiB)
const CONCURRENCY = 16;

// ── SigV4 ────────────────────────────────────────────────────────────────

const sha256 = (s) => createHash("sha256").update(s).digest("hex");
const hmac = (k, s) => createHmac("sha256", k).update(s).digest();
const EMPTY_SHA256 = sha256("");

// RFC 3986 — encodeURIComponent 가 남겨두는 !'()* 까지 인코딩
const enc = (s) =>
  encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

export function signRequest({ method, url, accessKeyId, secretAccessKey, now = new Date() }) {
  const u = new URL(url);
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ""); // 20260101T000000Z
  const day = amzDate.slice(0, 8);
  const region = "auto";
  const service = "s3";
  const payloadHash = EMPTY_SHA256; // GET 요청이라 본문이 비어 있다

  const query = [...u.searchParams.entries()]
    .map(([k, v]) => [enc(k), enc(v)])
    .sort(([a, x], [b, y]) => (a < b ? -1 : a > b ? 1 : x < y ? -1 : x > y ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const headers = { host: u.host, "x-amz-content-sha256": payloadHash, "x-amz-date": amzDate };
  const signedHeaders = Object.keys(headers).sort().join(";");
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map((k) => `${k}:${headers[k]}\n`)
    .join("");

  const canonicalRequest = [method, u.pathname, query, canonicalHeaders, signedHeaders, payloadHash].join(
    "\n",
  );
  const scope = `${day}/${region}/${service}/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256(canonicalRequest)].join("\n");

  const kDate = hmac(`AWS4${secretAccessKey}`, day);
  const kSigning = hmac(hmac(hmac(kDate, region), service), "aws4_request");
  const signature = createHmac("sha256", kSigning).update(stringToSign).digest("hex");

  return {
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
    authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}

// ── R2 ───────────────────────────────────────────────────────────────────

const endpoint = (R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`).replace(/\/$/, "");
const objectUrl = (key) => `${endpoint}/${enc(R2_BUCKET)}/${key.split("/").map(enc).join("/")}`;

async function r2(url, attempt = 1) {
  const headers = signRequest({
    method: "GET",
    url,
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  });
  try {
    const res = await fetch(url, { headers });
    if (res.ok) return res;
    const body = await res.text();
    // 4xx(권한·버킷 이름 오류)는 재시도해도 소용없다
    if (res.status < 500 || attempt >= 3) {
      throw new Error(`R2 ${res.status} ${res.statusText} — ${url}\n${body.slice(0, 500)}`);
    }
  } catch (err) {
    if (attempt >= 3 || /^R2 4\d\d/.test(err.message)) throw err;
  }
  await new Promise((r) => setTimeout(r, 500 * attempt));
  return r2(url, attempt + 1);
}

const xmlDecode = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, "&");
const tag = (xml, name) => xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1];

async function listObjects() {
  const objects = [];
  let token;
  do {
    const u = new URL(`${endpoint}/${enc(R2_BUCKET)}`);
    u.searchParams.set("list-type", "2");
    u.searchParams.set("prefix", R2_PREFIX);
    u.searchParams.set("max-keys", "1000");
    if (token) u.searchParams.set("continuation-token", token);
    const xml = await (await r2(u.toString())).text();
    for (const [, block] of xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)) {
      objects.push({ key: xmlDecode(tag(block, "Key")), size: Number(tag(block, "Size")) });
    }
    token =
      tag(xml, "IsTruncated") === "true" ? xmlDecode(tag(xml, "NextContinuationToken") ?? "") : undefined;
  } while (token);
  return objects;
}

async function download({ key, size }) {
  const dest = join(MEDIA_OUT_DIR, key);
  const existing = await stat(dest).catch(() => null);
  if (existing?.size === size) return "skip";

  await mkdir(dirname(dest), { recursive: true });
  const tmp = `${dest}.part`;
  const res = await r2(objectUrl(key));
  try {
    await pipeline(Readable.fromWeb(res.body), createWriteStream(tmp));
    await rename(tmp, dest);
  } catch (err) {
    await rm(tmp, { force: true });
    throw err;
  }
  return "get";
}

// ── main ─────────────────────────────────────────────────────────────────

async function main() {
  if ((!R2_ACCOUNT_ID && !R2_ENDPOINT) || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    if (CF_PAGES) {
      console.error(
        "✖ R2 환경변수가 없습니다 (R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY).\n" +
          "  Pages → Settings → Variables and Secrets 에 Production·Preview 둘 다 등록하세요.",
      );
      process.exit(1);
    }
    console.log("· R2 환경변수 없음 — 미디어 내려받기를 건너뜁니다 (public/media 그대로 사용)");
    return;
  }

  const started = Date.now();
  const objects = (await listObjects()).filter((o) => !o.key.endsWith("/") && !o.key.endsWith(".gitkeep"));

  const tooBig = objects.filter((o) => o.size > MAX_BYTES);
  if (tooBig.length) {
    console.error("✖ 25MB 를 넘는 파일이 있어 Pages 에 배포할 수 없습니다. 다시 인코딩하세요:");
    for (const o of tooBig) console.error(`  ${(o.size / 1024 / 1024).toFixed(1)}MB  ${o.key}`);
    process.exit(1);
  }

  const total = objects.reduce((s, o) => s + o.size, 0);
  console.log(`· R2 ${R2_BUCKET}/${R2_PREFIX} — ${objects.length}개, ${(total / 1024 / 1024).toFixed(1)}MB`);

  let got = 0;
  let skipped = 0;
  const queue = [...objects];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      for (let o; (o = queue.shift());) {
        if ((await download(o)) === "get") got++;
        else skipped++;
      }
    }),
  );

  const sec = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`✓ 받음 ${got}개 · 이미 있음 ${skipped}개 (${sec}s)`);
}

// 직접 실행했을 때만 main() — 테스트에서 signRequest 만 import 할 수 있게
if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  main().catch((err) => {
    console.error(`✖ ${err.message}`);
    process.exit(1);
  });
}
