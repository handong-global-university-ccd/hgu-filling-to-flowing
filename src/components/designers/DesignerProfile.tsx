"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import ArrowUpRight from "@/components/icons/ArrowUpRight";
import { useWorksFilter } from "@/components/works/works-filter";
import type { FieldKey } from "@/data/types";
import { asset } from "@/lib/asset";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HEADER_H, MOBILE_QUERY } from "@/lib/header";

export type ProfileWork = { slug: string; title: string };
export type ProfileDesigner = {
  slug: string;
  nameKo: string;
  nameEn: string;
  fieldKeys: FieldKey[];
  disciplines: string;
  contacts: string[];
  profile: string;
  profileMono?: string;
  works: ProfileWork[];
};

/** Figma 디자이너 상세 (1807:15093 / 1807:15124 / 1807:15169) */
const DESKTOP = {
  header: HEADER_H.desktop.collapsed,
  itemW: 80,
  itemH: 120,
  pitch: 120 + 36, // 사진 높이 + 간격
  railX: 24,
};
/**
 * 모바일(< 768px): 같은 구성을 좁게 — 좌측 레일 56×84, 우측에 컬러 사진 → 정보 순으로 쌓는다.
 * 레일 폭 = 16 + (6 + 10) + 56 = 88, 우측 영역은 104 부터.
 */
const MOBILE = {
  header: HEADER_H.mobile.filters.collapsed,
  itemW: 56,
  itemH: 84,
  pitch: 84 + 20,
  railX: 16,
};
const MARKER = 6;

/**
 * 인터렉션 설명 (1841:11720)
 * - Click  : 좌측 흑백 이미지를 누르면 우측 프로필 정보·이미지가 그 디자이너로 바뀐다
 * - 사각형(■) : 설정된 위치에 고정 — 움직이는 건 리스트 쪽이다
 * - Scroll : 스크롤하면 리스트 순서대로 다음 디자이너로 전환된다
 * - Work   : 작품을 누르면 작품 상세로 간다
 *
 * 한 번의 스크롤 제스처마다 한 명씩 전환하고 사진 중앙을 마커에 맞춘다.
 * 첫/마지막 프로필에서 바깥 방향으로 다시 스크롤하면 페이지 스크롤을 허용한다.
 */
export default function DesignerProfile({
  designers,
  initialIndex,
}: {
  designers: ProfileDesigner[];
  initialIndex: number;
}) {
  const filter = useWorksFilter();
  const field = filter?.field ?? "all";
  const query = (filter?.q ?? "").trim().normalize("NFC").toLowerCase();
  const filtered = useMemo(
    () =>
      designers.filter((designer) => {
        if (field !== "all" && !designer.fieldKeys.includes(field)) return false;
        return [designer.nameKo, designer.nameEn, designer.disciplines].some((value) =>
          value.normalize("NFC").toLowerCase().includes(query),
        );
      }),
    [designers, field, query],
  );

  // 필터가 바뀌면 레일·스크롤 상태를 함께 초기화하고 첫 결과부터 보여준다.
  // 전체 목록으로 돌아오면 처음 진입했던 디자이너를 다시 보여준다.
  return (
    <ProfileStage
      key={JSON.stringify([field, query])}
      designers={filtered}
      initialIndex={field === "all" && !query ? initialIndex : 0}
    />
  );
}

function ProfileStage({ designers, initialIndex }: { designers: ProfileDesigner[]; initialIndex: number }) {
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(initialIndex);
  const reduceMotion = useReducedMotion();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const size = isMobile ? MOBILE : DESKTOP;
  const markerGap = isMobile ? 10 : 16;
  const header = size.header;
  const d = designers[active];
  const last = designers.length - 1;
  const selected = useRef(initialIndex);
  const alignStage = useCallback(() => {
    const element = stage.current;
    if (element) {
      window.scrollTo({
        top: window.scrollY + element.getBoundingClientRect().top - header,
        behavior: "instant",
      });
    }
  }, [header]);
  useLayoutEffect(alignStage, [alignStage]);
  const goTo = useCallback(
    (index: number) => {
      selected.current = index;
      setActive(index);
      alignStage();
    },
    [alignStage],
  );

  useEffect(() => {
    const element = stage.current;
    if (!element || last < 0) return;
    let lastWheel = 0;
    let lockedUntil = 0;
    let accumulated = 0;
    let gestureConsumed = false;
    let lastDirection = 0;
    // 최근 휠 세기 기록 — 관성(점점 약해짐)과 새 스와이프(다시 세짐)를 구분하는 데 쓴다
    let history: number[] = [];
    const average = (count: number) => {
      const recent = history.slice(-count);
      return recent.reduce((sum, value) => sum + value, 0) / recent.length;
    };
    let touchY: number | null = null;
    let touchDelta = 0;
    const canMove = (direction: number) => (direction > 0 ? selected.current < last : selected.current > 0);
    const move = (direction: number) => {
      goTo(Math.max(0, Math.min(last, selected.current + direction)));
      lockedUntil = performance.now() + 400;
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
      const now = performance.now();
      const direction = Math.sign(event.deltaY);
      // 관성이 끝나거나 방향이 바뀌면 새 제스처다. 애니메이션 종료만으로 다시 열지 않는다.
      if (now - lastWheel > 180 || direction !== lastDirection) {
        gestureConsumed = false;
        accumulated = 0;
        history = [];
      }
      lastWheel = now;
      lastDirection = direction;
      const delta =
        event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientHeight : 1);
      history.push(Math.abs(delta));
      if (history.length > 40) history.shift();
      // 트랙패드·매직마우스는 관성 이벤트가 끊기지 않고 계속 들어와서 시간 간격만으로는
      // 다음 스와이프를 못 알아챈다. 관성은 계속 약해지기만 하므로, 최근 세기가
      // 평균보다 다시 커지면 손가락으로 새로 민 것으로 보고 다음 전환을 연다.
      if (gestureConsumed && now >= lockedUntil && history.length > 5 && average(5) > average(40)) {
        gestureConsumed = false;
        accumulated = 0;
      }
      if (!gestureConsumed && now >= lockedUntil && !canMove(direction)) return;
      event.preventDefault();
      event.stopPropagation();
      if (gestureConsumed || now < lockedUntil) return;
      if (Math.sign(accumulated) !== direction) accumulated = 0;
      accumulated += delta;
      if (Math.abs(accumulated) >= 24) {
        accumulated = 0;
        gestureConsumed = true;
        move(direction);
      }
    };
    const touchStart = (event: TouchEvent) => {
      touchY = event.touches.length === 1 ? event.touches[0].clientY : null;
      touchDelta = 0;
    };
    const touchMove = (event: TouchEvent) => {
      if (touchY === null || event.touches.length !== 1) return;
      touchDelta = touchY - event.touches[0].clientY;
      if (canMove(Math.sign(touchDelta))) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    const touchEnd = () => {
      if (touchY !== null && Math.abs(touchDelta) >= 30 && canMove(Math.sign(touchDelta))) {
        move(Math.sign(touchDelta));
      }
      touchY = null;
      touchDelta = 0;
    };
    const touchCancel = () => {
      touchY = null;
      touchDelta = 0;
    };
    element.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("touchstart", touchStart, { passive: true });
    element.addEventListener("touchmove", touchMove, { passive: false });
    element.addEventListener("touchend", touchEnd);
    element.addEventListener("touchcancel", touchCancel);
    return () => {
      element.removeEventListener("wheel", wheel);
      element.removeEventListener("touchstart", touchStart);
      element.removeEventListener("touchmove", touchMove);
      element.removeEventListener("touchend", touchEnd);
      element.removeEventListener("touchcancel", touchCancel);
    };
  }, [goTo, last]);

  // 주소만 바꾼다 — 페이지를 다시 그리지 않고 공유·새로고침만 맞춰준다
  const activeSlug = d?.slug;
  useEffect(() => {
    if (activeSlug) history.replaceState(null, "", `/designers/${activeSlug}/`);
  }, [activeSlug]);

  if (!d) {
    return (
      <section className="px-margin" style={{ minHeight: `calc(100svh - ${header}px)` }}>
        <p role="status" className="py-20 text-center text-fg-tertiary">
          검색 결과가 없습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="relative">
      <div
        ref={stage}
        className="relative overflow-hidden"
        style={{ height: `calc(100svh - ${header}px)` }}
        tabIndex={0}
        aria-label="디자이너 프로필. 위아래 방향키로 이전 또는 다음 프로필 보기"
        onKeyDown={(event) => {
          if (event.target instanceof HTMLElement && event.target.closest("a, input, textarea, select"))
            return;
          const direction =
            event.key === "ArrowDown" || event.key === "PageDown"
              ? 1
              : event.key === "ArrowUp" || event.key === "PageUp"
                ? -1
                : 0;
          const next = active + direction;
          if (direction && next >= 0 && next <= last) {
            event.preventDefault();
            goTo(next);
          }
        }}
      >
        {/* 좌측 리스트 — 흑백. 움직이는 건 리스트, ■ 는 제자리 */}
        <div
          aria-hidden
          className="absolute bg-fg"
          style={{ left: size.railX, top: `calc(50% - ${MARKER / 2}px)`, width: MARKER, height: MARKER }}
        />
        <motion.ul
          className="absolute inset-y-0 left-0 w-[102px] list-none max-md:w-[88px]"
          initial={false}
          animate={{ y: -active * size.pitch }}
          transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {designers.map((o, i) => (
            <li
              key={o.slug}
              className="absolute transition-transform duration-300 ease-out"
              style={{
                left: size.railX,
                top: `calc(50% - ${size.itemH / 2}px + ${i * size.pitch}px)`,
                width: size.itemW,
                height: size.itemH,
                transform: i === active ? `translateX(${MARKER + markerGap}px)` : undefined,
              }}
            >
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === active ? "true" : undefined}
                aria-label={`${o.nameKo} 프로필 보기`}
                className="block size-full"
              >
                <Image
                  src={asset(o.profileMono ?? o.profile)}
                  alt=""
                  width={DESKTOP.itemW}
                  height={DESKTOP.itemH}
                  className="size-full object-cover grayscale"
                />
              </button>
            </li>
          ))}
        </motion.ul>

        {/* 우측 정보 — 좌측 리스트는 흑백, 이 프로필 사진만 컬러 (화면설명 1837:11750) */}
        {/* 데스크톱: 정보·사진을 각각 절대 배치 / 모바일: 레일 오른쪽에 사진 → 정보로 쌓는다 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="max-md:absolute max-md:inset-y-4 max-md:right-margin max-md:left-[104px] max-md:flex max-md:flex-col max-md:gap-5 max-md:overflow-hidden"
        >
          <div className="flex flex-col gap-10 max-md:gap-5 md:absolute md:top-12 md:left-[calc(56.25%+16px)] md:w-[calc(18.75%-22px)] md:py-8">
            <div className="flex flex-col gap-[2px]">
              <p className="font-kr text-kr-body-lg">{d.nameKo}</p>
              <p className="text-body-lg text-fg-secondary">{d.nameEn}</p>
            </div>

            <div className="flex flex-col gap-6 text-body">
              <div className="flex flex-col gap-[2px] md:w-[210px]">
                <p>Disciplines</p>
                <p className="text-fg-secondary">{d.disciplines}</p>
              </div>

              {d.contacts.length > 0 && (
                <div className="flex flex-col gap-[2px]">
                  <p>Contact</p>
                  <div className="flex flex-col text-fg-secondary">
                    {d.contacts.map((c) => (
                      <a
                        key={c}
                        href={c.includes("@") ? `mailto:${c}` : `https://${c.replace(/^https?:\/\//, "")}`}
                        className="w-fit hover:text-fg"
                      >
                        {c}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-[2px]">
                <p>Work</p>
                <ul className="md:w-[308px]">
                  {d.works.map((w) => (
                    <li key={w.slug}>
                      <Link
                        href={`/works/${w.slug}/`}
                        className="flex items-start font-kr text-kr-body text-fg-secondary hover:text-fg"
                      >
                        <span>{w.title}</span>
                        <ArrowUpRight className="size-6 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Figma: 1920px에서 338×452, 오른쪽 24px, 접힌 헤더 아래 48px. */}
          <div className="aspect-[338/452] overflow-hidden max-md:order-first max-md:h-[45%] max-md:max-w-full max-md:shrink-0 max-md:self-start md:absolute md:top-12 md:right-margin md:w-[calc(18.75%-22px)]">
            <Image
              src={asset(d.profile)}
              alt={`${d.nameKo} 프로필 사진`}
              width={338}
              height={452}
              className="size-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
