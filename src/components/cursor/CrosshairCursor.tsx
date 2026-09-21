"use client";

import { useEffect, useRef } from "react";
import { useHasFinePointer } from "@/hooks/useMediaQuery";

/**
 * Figma: 마우스 포인트 — 마우스 위치 기준 가로·세로 십자 Grid Line + 중앙 Point.
 * mix-blend-difference 로 배경(흰/검)에 따라 자동 반전.
 * 마우스가 있는 기기에서만 렌더링.
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
      {/* 가로선 */}
      <div className="absolute inset-x-0 h-px translate-y-[var(--y)] bg-white" />
      {/* 세로선 */}
      <div className="absolute inset-y-0 w-px translate-x-[var(--x)] bg-white" />
      {/* 중앙 포인트 */}
      <div className="absolute top-0 left-0 size-2.5 translate-x-[calc(var(--x)-5px)] translate-y-[calc(var(--y)-5px)] rounded-full bg-white" />
    </div>
  );
}
