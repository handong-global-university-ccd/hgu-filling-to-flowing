"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { asset } from "@/lib/asset";

export type Photo = { src: string; alt: string; col: number; row: number };

/** Figma 레이아웃 값 (1807:15770 / 1807:15967) */
export const TILE_W = 103;
export const TILE_H = 137;
export const GAP = 16;

/** Figma 인터렉션 설명 (1801:15067) */
const RADIUS = 200; // px
const DURATION = 0.35; // s
/** 호버(거리 0)에서 222×296 이 되도록 — 222/103 ≈ 296/137 */
const MAX_SCALE = 222 / TILE_W;

/**
 * Figma 아카이브_비하인드
 * - 사진은 103×137, 간격 16px 의 그리드로 깔린다
 * - 마우스를 움직이면 화면보다 큰 전체 레이아웃이 반대 방향으로 밀려
 *   화면 밖 사진이 들어온다
 * - 커서 반경 200px 안의 사진이 거리에 비례해 확대되고,
 *   커서 바로 아래 사진은 222×296 이 된다 (0.35s)
 */
export default function ArchiveCanvas({
  photos,
  cols,
  rows,
}: {
  photos: Photo[];
  cols: number;
  rows: number;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);

  const canvasW = cols * TILE_W + (cols - 1) * GAP;
  const canvasH = rows * TILE_H + (rows - 1) * GAP;

  useGSAP(
    () => {
      const vp = viewport.current!;
      const cv = canvas.current!;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const moveX = gsap.quickTo(cv, "x", { duration: 1.2, ease: "power3.out" });
      const moveY = gsap.quickTo(cv, "y", { duration: 1.2, ease: "power3.out" });
      const items = gsap.utils.toArray<HTMLElement>("[data-photo]", cv);
      // useGSAP 의 자동 revert 가 단축 속성 scale 을 거부하므로 축별로 나눠 쓴다
      const tween = { duration: DURATION, ease: "power2.out" } as const;
      const scaleX = items.map((el) => gsap.quickTo(el, "scaleX", tween));
      const scaleY = items.map((el) => gsap.quickTo(el, "scaleY", tween));

      let raf = 0;
      let px = 0;
      let py = 0;

      const update = () => {
        raf = 0;
        items.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          const dx = px - (r.left + r.width / 2);
          const dy = py - (r.top + r.height / 2);
          // 커서가 그 사진 칸 위에 있으면 최대(222×296), 아니면 거리에 비례
          // 판정에는 확대 전 크기를 쓴다 — 확대된 크기를 쓰면 한 번 커진 사진이 계속 붙잡힌다
          const over = Math.abs(dx) <= TILE_W / 2 && Math.abs(dy) <= TILE_H / 2;
          const t = over ? 1 : Math.max(0, 1 - Math.hypot(dx, dy) / RADIUS);
          const s = 1 + (MAX_SCALE - 1) * t;
          scaleX[i](s);
          scaleY[i](s);
          el.style.zIndex = t > 0 ? String(Math.round(t * 100)) : "";
        });
      };

      const onMove = (e: PointerEvent) => {
        const { width, height } = vp.getBoundingClientRect();
        const nx = e.clientX / width - 0.5; // -0.5 ~ 0.5
        const ny = e.clientY / height - 0.5;
        // 화면 밖으로 넘치는 만큼만 반대 방향으로 민다
        moveX(-nx * Math.max(0, canvasW - width));
        moveY(-ny * Math.max(0, canvasH - height));
        px = e.clientX;
        py = e.clientY;
        if (!raf) raf = requestAnimationFrame(update);
      };

      // 전체 레이아웃을 가운데 두고 시작
      gsap.set(cv, {
        x: -Math.max(0, canvasW - vp.offsetWidth) / 2,
        y: -Math.max(0, canvasH - vp.offsetHeight) / 2,
      });
      vp.addEventListener("pointermove", onMove);
      return () => {
        vp.removeEventListener("pointermove", onMove);
        cancelAnimationFrame(raf);
      };
    },
    { scope: viewport, dependencies: [canvasW, canvasH] },
  );

  return (
    <div
      ref={viewport}
      className="relative h-[calc(100svh-152px)] overflow-hidden motion-reduce:h-auto motion-reduce:overflow-auto"
    >
      <div
        ref={canvas}
        className="absolute top-0 left-0 grid will-change-transform motion-reduce:relative"
        style={{
          width: canvasW,
          height: canvasH,
          gridTemplateColumns: `repeat(${cols}, ${TILE_W}px)`,
          gridAutoRows: `${TILE_H}px`,
          gap: GAP,
        }}
      >
        {photos.map((p) => (
          <div
            key={`${p.col}-${p.row}`}
            data-photo
            className="relative"
            style={{ gridColumn: p.col + 1, gridRow: p.row + 1 }}
          >
            <Image src={asset(p.src)} alt={p.alt} fill sizes={`${TILE_W}px`} className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
