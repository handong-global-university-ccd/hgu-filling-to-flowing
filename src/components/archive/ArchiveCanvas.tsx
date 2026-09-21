"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { asset } from "@/lib/asset";

type Photo = { src: string; alt: string; x: number; y: number; w: number; h: number };

/** Figma 설정값 */
const RADIUS = 200; // px
const MAX_SCALE = 1.7;
const DURATION = 0.35; // s

/**
 * Figma 아카이브_비하인드 (1807:15770)
 * - 화면보다 큰 레이아웃이 마우스 위치에 따라 상하좌우로 이동
 * - 커서 반경 200px 안의 사진이 거리에 비례해 최대 1.7배 확대
 * 사진 좌표(x, y, w, h)는 캔버스 기준 %.
 */
export default function ArchiveCanvas({ photos }: { photos: Photo[] }) {
  const viewport = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const vp = viewport.current!;
      const cv = canvas.current!;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const moveX = gsap.quickTo(cv, "x", { duration: 1.2, ease: "power3.out" });
      const moveY = gsap.quickTo(cv, "y", { duration: 1.2, ease: "power3.out" });
      const items = gsap.utils.toArray<HTMLElement>("[data-photo]", cv);
      const scalers = items.map((el) =>
        gsap.quickTo(el, "scale", { duration: DURATION, ease: "power2.out" }),
      );

      let raf = 0;
      let px = 0;
      let py = 0;

      const update = () => {
        raf = 0;
        items.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
          const t = Math.max(0, 1 - d / RADIUS);
          scalers[i](1 + (MAX_SCALE - 1) * t);
          el.style.zIndex = t > 0 ? String(Math.round(t * 100)) : "";
        });
      };

      const onMove = (e: PointerEvent) => {
        const { width, height } = vp.getBoundingClientRect();
        const nx = e.clientX / width - 0.5; // -0.5 ~ 0.5
        const ny = e.clientY / height - 0.5;
        moveX(-nx * (cv.offsetWidth - width));
        moveY(-ny * (cv.offsetHeight - height));
        px = e.clientX;
        py = e.clientY;
        if (!raf) raf = requestAnimationFrame(update);
      };

      // 캔버스를 중앙에 두고 시작
      gsap.set(cv, {
        x: -(cv.offsetWidth - vp.offsetWidth) / 2,
        y: -(cv.offsetHeight - vp.offsetHeight) / 2,
      });
      vp.addEventListener("pointermove", onMove);
      return () => {
        vp.removeEventListener("pointermove", onMove);
        cancelAnimationFrame(raf);
      };
    },
    { scope: viewport },
  );

  return (
    <div ref={viewport} className="relative h-[calc(100svh-176px)] overflow-hidden">
      <div ref={canvas} className="absolute top-0 left-0 h-[220%] w-[220%] will-change-transform">
        {photos.map((p) => (
          <div
            key={p.src}
            data-photo
            className="absolute"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: `${p.h}%` }}
          >
            <Image src={asset(p.src)} alt={p.alt} fill sizes="15vw" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
