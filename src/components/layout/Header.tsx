"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { NAV } from "@/lib/site";
import { cn } from "@/lib/cn";
import { FIELDS } from "@/data/types";
import { useWorksFilter } from "@/components/works/works-filter";
import { useHasFinePointer, useMediaQuery } from "@/hooks/useMediaQuery";
import { HEADER_H, MOBILE_QUERY } from "@/lib/header";
import Logo from "./Logo";

export type ArchiveTab = "behind" | "exhibition";

/** 숨은 헤더를 다시 불러내는 화면 상단 영역(px) */
const REVEAL_ZONE = 120;

const ARCHIVE_TABS = [
  { key: "behind", label: "Behind", href: "/archive/" },
  { key: "exhibition", label: "Exhibition View", href: "/archive/exhibition/" },
] as const;

/** Figma Search (1893:1245) — 334×30, 아래 1px 밑줄, placeholder Neutral/500 */
function SearchField({ value, onChange }: { value?: string; onChange?: (v: string) => void }) {
  return (
    <label className="h-[30px] w-full shrink-0 border-b border-border md:w-[334px]">
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
 * 모바일 전체 화면 메뉴 (< 768px). 데스크톱 내비 4개를 화면 가득 크게 보여준다.
 * 헤더는 transform·overflow 가 걸려 있어 그 안에 두면 잘리므로 body 로 포털한다.
 */
function MobileMenu({
  open,
  onClose,
  inverse,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  inverse: boolean;
  pathname: string;
}) {
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="메뉴"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "fixed inset-0 z-[70] flex flex-col px-margin pt-4 pb-8 md:hidden",
            inverse ? "bg-bg-inverse text-fg-inverse" : "bg-bg text-fg",
          )}
        >
          <div className="flex items-start justify-between">
            <Link href="/" aria-label="홈으로" onClick={onClose}>
              <Logo width={120} />
            </Link>
            <button type="button" onClick={onClose} className="text-body" autoFocus>
              Close
            </button>
          </div>
          <nav aria-label="주요 메뉴" className="mt-auto">
            <ul className="flex flex-col gap-2 text-h2">
              <li>
                <Link href="/" onClick={onClose} className={pathname === "/" ? "" : "opacity-50"}>
                  Home
                </Link>
              </li>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                    className={pathname.startsWith(item.href) ? "" : "opacity-50"}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
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
 *   hideOnScroll 이어도 둘째 줄은 숨지 않는다 — 숨는 대신 Scroll(74px) 로 접힌다
 */
export default function Header({
  inverse = false,
  filters = false,
  archive,
  compact = false,
  hideOnScroll = false,
  height = 110,
}: {
  inverse?: boolean;
  filters?: boolean;
  archive?: ArchiveTab;
  /** 스크롤과 상관없이 Scroll(74px) 상태로 시작한다 — 호버하면 펼쳐진다 */
  compact?: boolean;
  /**
   * 아래로 스크롤하면 헤더를 숨기고, 마우스가 화면 위쪽으로 가면 다시 내려온다.
   * 스크롤이 없는 화면에서는 커서가 위쪽을 벗어나기만 해도 숨는다.
   */
  hideOnScroll?: boolean;
  /** 둘째 줄이 없는 단순 헤더의 전체 높이(px). 위 여백 24px 을 포함한 값이다 */
  height?: number;
}) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [atTop, setAtTop] = useState(true);
  const [hovered, setHovered] = useState(false);
  // 처음에는 보인 상태로 둔다 — 커서를 한 번이라도 아래로 내려야 숨는다
  const [nearTop, setNearTop] = useState(true);
  const [scrollable, setScrollable] = useState(true);
  const filter = useWorksFilter();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const finePointer = useHasFinePointer();
  const [menuOpen, setMenuOpen] = useState(false);
  // 터치 기기는 커서로 헤더를 불러낼 수 없으니 위로 스크롤하면 다시 보여준다
  const [scrollingDown, setScrollingDown] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setAtTop(y < 40);
    const previous = scrollY.getPrevious() ?? 0;
    if (Math.abs(y - previous) > 4) setScrollingDown(y > previous);
  });

  // 페이지를 옮기면 메뉴를 닫는다
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMenuOpen(false), [pathname]);

  // 숨어 있는 동안에는 헤더가 포인터 이벤트를 못 받으니 화면 전체에서 커서 높이를 본다
  useEffect(() => {
    if (!hideOnScroll) return;
    const onMove = (e: PointerEvent) => setNearTop(e.clientY <= REVEAL_ZONE);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [hideOnScroll]);

  // 아카이브 비하인드처럼 스크롤이 아예 없는 화면에서는 커서 위치만으로 판단한다
  useEffect(() => {
    if (!hideOnScroll) return;
    const check = () => setScrollable(document.documentElement.scrollHeight > window.innerHeight + 4);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [hideOnScroll]);

  const hidden = finePointer
    ? hideOnScroll && !nearTop && !hovered && (!scrollable || !atTop)
    : hideOnScroll && scrollable && !atTop && scrollingDown && !menuOpen;
  // 둘째 줄이 있는 헤더는 통째로 숨지 않고 Scroll(74px) 로 접혀 둘째 줄(탭)만 남긴다
  const expanded = compact ? hovered : (atTop || hovered) && !hidden;
  const showFilterRow = filters && filter !== null;

  const brand = inverse ? "bg-bg-inverse text-fg-inverse" : "bg-bg text-fg";

  /* 로고 + 주요 내비 — Figma: 항목 폭 102px, 간격 16px, Body/Medium(16/26) */
  const topRow = (
    <div className="flex w-full items-start justify-between">
      <Link href="/" aria-label="홈으로">
        <Logo width={187} className="max-md:!w-[120px]" />
      </Link>
      {/* 모바일: 내비 대신 메뉴 버튼 → 전체 화면 메뉴 */}
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        className="text-body md:hidden"
      >
        Menu
      </button>
      <nav aria-label="주요 메뉴" className="max-md:hidden">
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
      <div className="mt-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6 md:px-1">
        {/* 모바일은 탭이 한 줄을 넘치면 가로로 밀어서 본다 */}
        <div
          role="tablist"
          aria-label="분야"
          className="-mx-margin flex [scrollbar-width:none] gap-3 overflow-x-auto px-margin text-body md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
        >
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
      <div className="mt-auto flex items-center justify-between gap-6 md:px-1">
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
      </div>
    );
  }

  const menu = (
    <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} inverse={inverse} pathname={pathname} />
  );

  if (!secondRow) {
    return (
      <>
        <motion.header
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          initial={false}
          animate={{ y: hidden ? "-100%" : "0%" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={cn("fixed inset-x-0 top-0 z-50 px-margin pt-6 max-md:pt-4", brand)}
          style={{ height: isMobile ? HEADER_H.mobile.simple : height }}
        >
          {topRow}
        </motion.header>
        {menu}
      </>
    );
  }

  const rowH = isMobile ? HEADER_H.mobile[showFilterRow ? "filters" : "archive"] : HEADER_H.desktop;

  return (
    <>
      <motion.header
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        initial={false}
        animate={{ height: expanded ? rowH.expanded : rowH.collapsed }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex flex-col overflow-hidden px-margin py-6 max-md:pt-4 max-md:pb-5",
          brand,
        )}
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
      {menu}
    </>
  );
}
