"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ArrowUpRight from "@/components/icons/ArrowUpRight";
import { asset } from "@/lib/asset";

export type OtherItem = { slug: string; title: string; thumbnail: string };

/** Figma Works 상세 Others (1807:14543~) — 352×222, 간격 0, 화면 전체 폭으로 흐른다 */
const TILE_W = 352;
const TILE_H = 222;
/** 썸네일 한 세트가 한 바퀴 도는 시간(초) */
const LOOP_SECONDS = 60;
/** 이만큼 넘게 끌면 드래그로 보고 링크 클릭을 막는다 */
const DRAG_THRESHOLD = 5;
/** 사용자가 직접 스크롤한 뒤 자동 흐름을 다시 시작하기까지 기다리는 시간 (트랙패드 관성 포함) */
const USER_SCROLL_IDLE = 150;

/**
 * 인터렉션 설명 (1837:11696)
 * - 좌측 첫 번째가 현재 작품의 다음 순서이고 그 뒤로 이어진다 (getOtherWorks)
 * - 호버 전에는 계속 흐르고, 호버하면 멈춘다
 * - 트랙패드 좌우 스와이프·마우스 드래그·터치로 직접 넘길 수 있다
 * - 영역을 벗어나면 멈췄던 위치에서 다시 흐른다
 * - 어느 방향으로 넘겨도 끊김 없이 무한 반복
 * - 호버한 썸네일에는 흰색 80% 레이어 + 제목 + 화살표가 올라온다
 *
 * 구현: 실제 가로 스크롤 영역(overflow-x)으로 만들어 트랙패드·터치는 브라우저가 그대로
 * 처리하게 하고(관성 포함), 자동 흐름과 마우스 드래그는 scrollLeft 를 직접 움직인다.
 * 세트를 여러 벌 이어 붙이고 scrollLeft 를 [세트폭, 2×세트폭) 안으로 되돌려 무한 루프를 만든다.
 * Lenis 가 가로 제스처를 세로 스크롤로 가로채지 않도록 data-lenis-prevent-horizontal.
 */
export default function OthersMarquee({ items }: { items: OtherItem[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const setWidth = items.length * TILE_W;
  // 앞쪽 한 세트 + 화면 폭 + 뒤쪽 여유가 늘 채워지도록 복제 개수를 정한다
  const [copies, setCopies] = useState(4);
  // 드래그 직후 발생하는 click 을 막기 위한 플래그
  const suppressClick = useRef(false);

  useEffect(() => {
    const element = scroller.current;
    if (!element || setWidth === 0) return;
    const update = () => setCopies(Math.ceil(element.clientWidth / setWidth) + 3);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [setWidth]);

  useEffect(() => {
    const element = scroller.current;
    if (!element || setWidth === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speed = setWidth / (LOOP_SECONDS * 1000); // px/ms
    // scrollLeft 는 기기 픽셀로 반올림되므로 실제 위치는 소수점까지 따로 들고 있는다
    let position = setWidth;
    let lastWritten = -1;
    let hovered = false;
    let touching = false;
    let userScrolledAt = 0;
    let drag: { id: number; startX: number; startPosition: number; moved: boolean } | null = null;
    let previous = performance.now();
    let raf = 0;

    const normalize = () => {
      if (position < setWidth) position += setWidth;
      else if (position >= setWidth * 2) position -= setWidth;
    };
    const write = () => {
      normalize();
      element.scrollLeft = position;
      lastWritten = element.scrollLeft;
    };
    write();

    const tick = (now: number) => {
      const dt = Math.min(now - previous, 64); // 탭 전환 뒤 한 번에 튀지 않게
      previous = now;
      const idle = !hovered && !touching && !drag && now - userScrolledAt > USER_SCROLL_IDLE;
      if (idle && !reduceMotion) {
        position += speed * dt;
        write();
      }
      raf = requestAnimationFrame(tick);
    };

    // 우리가 쓴 값과 다르면 사용자가 스크롤한 것 — 그 위치를 이어받는다
    const onScroll = () => {
      if (Math.abs(element.scrollLeft - lastWritten) < 1) return;
      userScrolledAt = performance.now();
      position = element.scrollLeft;
      // 끝에 닿기 전에 가운데 세트로 되돌린다 (보이는 화면은 똑같다)
      if (position < setWidth || position >= setWidth * 2) write();
      else lastWritten = element.scrollLeft;
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") hovered = true;
    };
    const onLeave = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && !drag) hovered = false;
    };
    // 마우스 드래그 — 터치는 브라우저 기본 가로 스크롤에 맡긴다
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      drag = { id: event.pointerId, startX: event.clientX, startPosition: position, moved: false };
      suppressClick.current = false;
    };
    const onMove = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.startX;
      if (!drag.moved && Math.abs(dx) > DRAG_THRESHOLD) {
        drag.moved = true;
        suppressClick.current = true;
        element.setPointerCapture(event.pointerId);
      }
      if (!drag.moved) return;
      position = drag.startPosition - dx;
      write();
      // 정규화로 세트폭만큼 점프했으면 드래그 기준점도 같이 옮긴다
      drag.startPosition = position + dx;
    };
    const onUp = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      drag = null;
      hovered = element.matches(":hover");
    };
    const onTouchStart = () => (touching = true);
    const onTouchEnd = () => {
      touching = false;
      userScrolledAt = performance.now();
    };

    element.addEventListener("scroll", onScroll, { passive: true });
    element.addEventListener("pointerenter", onEnter);
    element.addEventListener("pointerleave", onLeave);
    element.addEventListener("pointerdown", onDown);
    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerup", onUp);
    element.addEventListener("pointercancel", onUp);
    element.addEventListener("touchstart", onTouchStart, { passive: true });
    element.addEventListener("touchend", onTouchEnd);
    element.addEventListener("touchcancel", onTouchEnd);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      element.removeEventListener("scroll", onScroll);
      element.removeEventListener("pointerenter", onEnter);
      element.removeEventListener("pointerleave", onLeave);
      element.removeEventListener("pointerdown", onDown);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerup", onUp);
      element.removeEventListener("pointercancel", onUp);
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchend", onTouchEnd);
      element.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [setWidth]);

  if (items.length === 0) return null;

  return (
    <div
      ref={scroller}
      data-lenis-prevent-horizontal
      className="flex [scrollbar-width:none] overflow-x-auto overscroll-x-contain select-none [&::-webkit-scrollbar]:hidden"
      onClickCapture={(event) => {
        if (suppressClick.current) {
          event.preventDefault();
          event.stopPropagation();
          suppressClick.current = false;
        }
      }}
      onDragStart={(event) => event.preventDefault()}
    >
      {Array.from({ length: copies }, (_, copy) => (
        // 두 번째 세트(index 1)가 처음 보이는 세트 — 키보드·스크린리더는 이 세트만 본다
        <div key={copy} className="flex shrink-0" aria-hidden={copy !== 1 || undefined}>
          {items.map((w) => (
            <Link
              key={w.slug}
              href={`/works/${w.slug}/`}
              tabIndex={copy !== 1 ? -1 : undefined}
              draggable={false}
              className="group/tile relative block shrink-0"
              style={{ width: TILE_W, height: TILE_H }}
            >
              <Image
                src={asset(w.thumbnail)}
                alt={copy !== 1 ? "" : w.title}
                width={TILE_W}
                height={TILE_H}
                draggable={false}
                className="pointer-events-none size-full object-cover"
              />
              <span className="absolute inset-0 bg-bg/80 opacity-0 transition-opacity duration-200 group-hover/tile:opacity-100" />
              <span className="absolute inset-0 grid place-items-center px-6 text-center font-kr text-body text-fg-secondary opacity-0 transition-opacity duration-200 group-hover/tile:opacity-100">
                {w.title}
              </span>
              <ArrowUpRight
                aria-hidden
                className="absolute right-1.5 bottom-1.5 size-6 text-fg-secondary opacity-0 transition-opacity duration-200 group-hover/tile:opacity-100"
              />
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
