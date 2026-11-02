#!/usr/bin/env node
/**
 * '2026 졸업전시 웹사이트 정보 취합' 시트의 '디자이너 정보' 탭에서 Contact(EMAIL · 링크) 를 읽어
 * src/data/designer-contacts.json 을 다시 쓴다. 디자이너 상세의 Contact 는 이 파일을 그대로 보여준다.
 *
 * 사용법: npm run pull:contacts
 *
 * - 시트는 "링크가 있는 모든 사용자" 공개라 htmlview 로 읽는다 — 셀에 걸린 하이퍼링크까지 같이 온다
 * - 화면 글자는 시트에 적힌 그대로, 줄바꿈마다 한 항목
 * - 하이퍼링크가 걸린 글자 → 그 주소로 링크
 *   하이퍼링크 없이 주소만 적힌 줄(https://… · www.… · something.com) → 그 주소로 링크
 *   링크 없이 적힌 @아이디 → 인스타그램 (instagram.com/아이디)
 *   그 밖(링크가 없는 글자) → 링크 없이 글자만
 * - 디자이너는 EMAIL 로 찾고(동명이인 구분), 없으면 이름으로 찾는다 — slug 는 src/data/designers.ts 기준
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SHEET = process.env.CONTACT_SHEET ?? "1rdBN7v82KRGErbnNDwrddq_t5FEYDVFtW9Hph3WEP8Y";
const GID = process.env.CONTACT_GID ?? "824414780"; // '디자이너 정보' 탭
const OUT = path.join(ROOT, "src/data/designer-contacts.json");

/** 시트 열 (행 번호 칸 포함) — 전공·학번·(빈칸)·한국어 이름·영문·분야1·분야2·EMAIL·링크 */
const COL = { id: 2, name: 4, email: 8, links: 9 };

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
const text = (html) => decode(html.replace(/<[^>]+>/g, "")).trim();

/** 구글이 감싼 주소(google.com/url?q=…)를 원래 주소로 */
function unwrap(href) {
  const h = decode(href);
  const m = h.match(/[?&]q=([^&]+)/);
  return h.includes("google.com/url") && m ? decodeURIComponent(m[1]) : h;
}

/** 링크 없이 적힌 주소 → 링크 주소 (아니면 null) */
function bareUrl(s) {
  if (/\s/.test(s) || s.startsWith("@") || s.includes("@")) return null;
  if (/^https?:\/\//i.test(s)) return s;
  if (/^www\./i.test(s) || /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(s)) return `https://${s}`;
  return null;
}

/**
 * 시트 내용을 고쳐 쓰는 곳 — 시트가 틀렸지만 당사자 확인을 받은 것만. pull:contacts 를 다시 돌려도 유지된다.
 *   email : 메일 주소를 바꾼다
 *   links : 화면 글자(label)가 같은 항목의 링크(href)를 바꾼다
 */
const FIXES = {
  // 시트에서 "Instagram" 과 "@uni_eo" 가 링크 하나(birdyndsn)로 묶여 있다 — @uni_eo 는 따로
  "seyun-park": { links: { "@uni_eo": "https://www.instagram.com/uni_eo/" } },
  // 시트 오타 gmal.com
  "daeun-park": { email: "nueadnook@gmail.com" },
};

/** "@아이디" → 인스타그램 주소 */
const instagram = (handle) => `https://www.instagram.com/${handle.replace(/^@/, "")}/`;
const HANDLE = /^@[\w.]+$/;

/**
 * 셀 하나 → [{ label, href? }] (줄마다).
 * 링크 글자 안에 줄바꿈(<br>)이 들어 있는 셀이 있어서, 링크(<a>)를 먼저 떼어 낸 다음 줄을 나눈다
 */
function parseCell(html) {
  const anchors = [];
  const marked = html.replace(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, label) => {
    // 링크 하나에 줄바꿈이 들어 있으면 줄마다 따로 (같은 주소)
    const labels = label
      .split(/<br\s*\/?>/i)
      .map(text)
      .filter(Boolean);
    anchors.push(labels.map((l) => ({ label: l, href: unwrap(href) })));
    return `\u0000${anchors.length - 1}\u0000`;
  });
  const items = [];
  for (const line of marked.split(/<br\s*\/?>/i)) {
    for (const [, n] of line.matchAll(/\u0000(\d+)\u0000/g)) items.push(...anchors[n]);
    const rest = text(line.replace(/\u0000\d+\u0000/g, ""));
    if (!rest) continue;
    // 링크 없이 적힌 @아이디는 인스타그램으로 — 한 줄에 여러 개면(쉼표로 구분) 하나씩
    const handles = rest.split(/[,\s]+/).filter(Boolean);
    if (handles.every((h) => HANDLE.test(h))) {
      for (const h of handles) items.push({ label: h, href: instagram(h) });
      continue;
    }
    const href = bareUrl(rest);
    items.push(href ? { label: rest, href } : { label: rest });
  }
  return items;
}

const res = await fetch(
  `https://docs.google.com/spreadsheets/d/${SHEET}/htmlview/sheet?headers=false&gid=${GID}`,
);
if (!res.ok) throw new Error(`시트를 읽지 못했다: ${res.status}`);
const html = await res.text();

// designers.ts 의 slug · 이름 · 이메일
const source = readFileSync(path.join(ROOT, "src/data/designers.ts"), "utf8");
const designers = [
  ...source.matchAll(/slug: "([^"]+)",\s*nameKo: "([^"]+)",[\s\S]*?(?:email: "([^"]*)",[\s\S]*?)?workSlugs/g),
].map(([, slug, nameKo, email]) => ({ slug, nameKo, email: email?.toLowerCase() }));

const out = {};
const missing = [];
for (const [, row] of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
  const cells = [...row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((m) => m[1]);
  if (cells.length <= COL.links || !/^\d{8}$/.test(text(cells[COL.id]))) continue;
  const name = text(cells[COL.name]);
  if (!name || name === "김예시") continue;
  const email = text(cells[COL.email]);
  const d =
    designers.find((x) => email && x.email === email.toLowerCase()) ??
    (designers.filter((x) => x.nameKo === name).length === 1
      ? designers.find((x) => x.nameKo === name)
      : undefined);
  if (!d) {
    missing.push(`${name} (${email || "메일 없음"})`);
    continue;
  }
  const fix = FIXES[d.slug] ?? {};
  out[d.slug] = {
    email: fix.email ?? (email || undefined),
    links: parseCell(cells[COL.links]).map((l) =>
      fix.links?.[l.label] ? { label: l.label, href: fix.links[l.label] } : l,
    ),
  };
}

writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`${Object.keys(out).length}명 → src/data/designer-contacts.json`);
if (missing.length) console.log(`designers.ts 에서 못 찾음: ${missing.join(", ")}`);
