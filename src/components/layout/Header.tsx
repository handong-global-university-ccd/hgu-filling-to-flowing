"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { NAV } from "@/lib/site";
import { cn } from "@/lib/cn";
import { FIELDS } from "@/data/types";
import { useWorksFilter } from "@/components/works/works-filter";
import Logo from "./Logo";

export type ArchiveTab = "behind" | "exhibition";

const ARCHIVE_TABS = [
  { key: "behind", label: "Behind", href: "/archive/" },
  { key: "exhibition", label: "Exhibition View", href: "/archive/exhibition/" },
] as const;

/** Figma Search (1893:1245) — 334×30, 아래 1px 밑줄, placeholder Neutral/500 */
function SearchField({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <label className="h-[30px] w-[334px] shrink-0 border-b border-border">
      <span className="sr-only">검색</span>
      <input
        type="search"
        {...(onChange ? { value, onChange: (e) => onChange(e.target.value) } : {})}
        placeholder="Search"
        className="w-full bg-transparent text-body outline-none placeholder:text-fg-tertiary"
      />
    </label>
  );
}

/**
 * Figma 헤더 컴포넌트 (1893:2320 Default / 1893:2360 Scroll / 1696:14396 White·Black)
 *
 * - 둘째 줄 없음 : 110px 고정. 로고 + 우측 내비.  inverse 면 Black 변형
 * - 둘째 줄 있음 : Default 176px ↔ Scroll 74px. (padding 24, 두 줄 사이 44)
 *                  아래로 스크롤하면 로고·내비 행이 접히고 둘째 줄만 남는다.
 *                  최상단이거나 헤더에 호버하면 다시 펼쳐진다.
 *   · filters : Works 의 분야 탭 + 검색 (1807:14578)
 *   · archive : Behind / Exhibition View 탭 + 검색 (1807:15967, 1807:16563)
 *   · compact : 처음부터 접힌 상태 (디자이너 상세 1807:15093)
 */
export default function Header({
  inverse = false,
  filters = false,
  archive,
  compact = false,
}: {
  inverse?: boolean;
  filters?: boolean;
  archive?: ArchiveTab;
  /** 스크롤과 상관없이 Scroll(74px) 상태로 시작한다 — 호버하면 펼쳐진다 */
  compact?: boolean;
}) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [atTop, setAtTop] = useState(true);
  const [hovered, setHovered] = useState(false);
  const filter = useWorksFilter();

  useMotionValueEvent(scrollY, "change", (y) => setAtTop(y < 40));

  const expanded = compact ? hovered : atTop || hovered;
  const showFilterRow = filters && filter !== null;

  const brand = inverse ? "bg-bg-inverse text-fg-inverse" : "bg-bg text-fg";

  /* 로고 + 주요 내비 — Figma: 항목 폭 102px, 간격 16px, Body/Medium(16/26) */
  const topRow = (
    <div className="flex w-full items-start justify-between">
      <Link href="/" aria-label="홈으로">
        <Logo className="w-[187px]" />
      </Link>
      <nav aria-label="주요 메뉴">
        <ul className="flex items-center gap-4 text-body">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href} className="w-[102px]">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "transition-opacity hover:opacity-100",
                    active ? "opacity-100" : "opacity-70",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  /* 둘째 줄 — 탭 간격 12px, 비활성 Neutral/300, Body/Medium(16/26) */
  let secondRow: React.ReactNode = null;

  if (showFilterRow) {
    const tabs = [{ key: "all" as const, label: "All" }, ...FIELDS];
    secondRow = (
      <div className="mt-auto flex items-center justify-between gap-6 px-1">
        <div role="tablist" aria-label="분야" className="flex flex-wrap gap-3 text-body">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={filter.field === t.key}
              onClick={() => filter.setField(t.key)}
              className={cn(
                "whitespace-nowrap transition-colors",
                filter.field === t.key ? "text-fg" : "text-neutral-300 hover:text-fg-secondary",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <SearchField value={filter.q} onChange={filter.setQ} />
      </div>
    );
  } else if (archive) {
    secondRow = (
      <div className="mt-auto flex items-center justify-between gap-6 px-1">
        <nav aria-label="아카이브" className="flex gap-3 text-body">
          {ARCHIVE_TABS.map((t) => (
            <Link
              key={t.key}
              href={t.href}
              aria-current={archive === t.key ? "page" : undefined}
              className={cn(
                "whitespace-nowrap transition-colors",
                archive === t.key ? "" : "text-neutral-300 hover:text-fg-secondary",
              )}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        {/* TODO: 아카이브 검색은 사진 메타데이터가 생기면 연결한다 */}
        <SearchField />
      </div>
    );
  }

  if (!secondRow) {
    return (
      <header className={cn("fixed inset-x-0 top-0 z-50 h-[110px] px-margin pt-6", brand)}>
        {topRow}
      </header>
    );
  }

  return (
    <motion.header
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      initial={false}
      animate={{ height: expanded ? 176 : 74 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn("fixed inset-x-0 top-0 z-50 flex flex-col overflow-hidden px-margin py-6", brand)}
    >
      {/* Default 상태에서만 보이는 로고·내비 행.
          Scroll(74px) 에서는 높이까지 0 으로 접어야 둘째 줄이 화면에 남는다 */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!expanded}
        className="shrink-0 overflow-hidden"
      >
        {topRow}
      </motion.div>

      {secondRow}
    </motion.header>
  );
}
