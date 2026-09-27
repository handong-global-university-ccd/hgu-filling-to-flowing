"use client";

import { useEffect, useRef } from "react";
import { useHasFinePointer } from "@/hooks/useMediaQuery";

/**
 * Figma 마우스 포인트 (1860:11931 화이트배경 / 1901:1376 블랙배경)
 *
 * - 마우스 위치 기준 가로·세로 1px 십자선
 * - 중앙은 6×6px 정사각형
 * - 선은 중앙을 관통하지 않고 사방 11px 씩 비어 있다
 * - mix-blend-difference 로 흰 배경에서는 검정, 검은 배경에서는 흰색으로 자동 반전
 * - 마우스가 있는 기기에서만 렌더링
 */
export default function CrosshairCursor() {
  const enabled = useHasFinePointer();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    document.documentElement.classList.add("has-custom-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = reduce ? 1 : 0.35;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      root.style.opacity = "1";
    };
    const onLeave = () => (root.style.opacity = "0");

    const loop = () => {
      pos.x += (target.x - pos.x) * ease;
      pos.y += (target.y - pos.y) * ease;
      root.style.setProperty("--x", `${pos.x}px`);
      root.style.setProperty("--y", `${pos.y}px`);
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] opacity-0 mix-blend-difference transition-opacity duration-300"
    >
      {/* 가로선 — 중앙 좌우 11px 비움 */}
      <div className="absolute left-0 h-px w-[calc(var(--x)-11px)] translate-y-[var(--y)] bg-white" />
      <div className="absolute right-0 h-px w-[calc(100%-var(--x)-11px)] translate-y-[var(--y)] bg-white" />
      {/* 세로선 — 중앙 위아래 11px 비움 */}
      <div className="absolute top-0 h-[calc(var(--y)-11px)] w-px translate-x-[var(--x)] bg-white" />
      <div className="absolute bottom-0 h-[calc(100%-var(--y)-11px)] w-px translate-x-[var(--x)] bg-white" />
      {/* 중앙 포인트 — 6×6 정사각형 */}
      <div className="absolute top-0 left-0 size-1.5 translate-x-[calc(var(--x)-3px)] translate-y-[calc(var(--y)-3px)] bg-white" />
    </div>
  );
}
