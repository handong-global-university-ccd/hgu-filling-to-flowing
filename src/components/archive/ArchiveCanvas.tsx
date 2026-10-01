"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { asset } from "@/lib/asset";
import { GAP, GRID_X, GRID_Y, PLATE_H, PLATE_W, TILE_H, TILE_W } from "@/data/archive-layout";

export type Photo = { src: string; alt: string; col: number; row: number };

/** Figma 인터렉션 설명 (1801:15067) */
const RADIUS = 200; // px
const DURATION = 0.35; // s
const PAN_DURATION = 1.2; // s
/** 호버(거리 0)에서 222×296 이 되도록 — 222/103 ≈ 296/137 */
const MAX_SCALE = 222 / TILE_W;

/**
 * Figma 아카이브_비하인드 (1807:15967 / 1807:15770)
 *
 * 화면설명: "정해진 전체 레이아웃에 맞춰 이미지가 배치됩니다.
 *            마우스 움직임에 따라 전체 레이아웃이 [좌/우/상/하] 움직입니다."
 *
 * - 전체 레이아웃(판)은 3840×2160 — 1920×1080 화면의 정확히 2배다.
 *   화면은 그 판의 일부만 보여주고, 마우스를 움직이면 판이 반대 방향으로 밀려
 *   화면 밖에 있던 사진이 들어온다. 페이지 자체는 스크롤되지 않는다.
 * - 커서 반경 200px 안의 사진이 거리에 비례해 커지고,
 *   커서가 올라간 사진은 222×296 이 된다 (0.35s)
 */
export default function ArchiveCanvas({ photos }: { photos: Photo[] }) {
  const viewport = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const vp = viewport.current!;
      const pl = plate.current!;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const items = gsap.utils.toArray<HTMLElement>("[data-photo]", pl);
      // useGSAP 의 자동 revert 가 단축 속성 scale 을 거부하므로 축별로 나눠 쓴다
      const tween = { duration: DURATION, ease: "power2.out" } as const;
      const scaleX = items.map((el) => gsap.quickTo(el, "scaleX", tween));
      const scaleY = items.map((el) => gsap.quickTo(el, "scaleY", tween));
      const moveX = gsap.quickTo(pl, "x", { duration: PAN_DURATION, ease: "power3.out" });
      const moveY = gsap.quickTo(pl, "y", { duration: PAN_DURATION, ease: "power3.out" });

      // 사진 중심 좌표는 판 기준으로 고정이다 — 매 프레임 getBoundingClientRect 를
      // 193번 부르는 대신 한 번 계산해 두고 판의 현재 위치만 더한다
      const centers = photos.map((p) => [
        GRID_X + p.col * (TILE_W + GAP) + TILE_W / 2,
        GRID_Y + p.row * (TILE_H + GAP) + TILE_H / 2,
      ]);

      // 화면 밖으로 넘치는 만큼만 움직인다 — 1920×1080 에서는 좌우 ±960, 상하 ±540
      let left = 0;
      let top = 0;
      let width = 1;
      let height = 1;
      let slackX = 0;
      let slackY = 0;
      const measure = () => {
        const r = vp.getBoundingClientRect();
        left = r.left;
        top = r.top;
        width = r.width || 1;
        height = r.height || 1;
        slackX = Math.max(0, PLATE_W - width);
        slackY = Math.max(0, PLATE_H - height);
        gsap.set(pl, { x: -slackX / 2, y: -slackY / 2 });
      };

      let px = -1e4;
      let py = -1e4;

      const onMove = (e: PointerEvent) => {
        px = e.clientX;
        py = e.clientY;
        // 커서가 헤더 위로 올라가도 판은 계속 따라온다 (양 끝까지 밀 수 있게)
        const nx = Math.min(0.5, Math.max(-0.5, (px - left) / width - 0.5));
        const ny = Math.min(0.5, Math.max(-0.5, (py - top) / height - 0.5));
        moveX(-slackX / 2 - nx * slackX);
        moveY(-slackY / 2 - ny * slackY);
      };

      // 확대는 매 프레임 다시 계산한다 — 판이 1.2초 동안 계속 미끄러지므로
      // pointermove 때 한 번만 재면 커서 밑 사진이 엉뚱한 크기로 멈춘다
      const update = () => {
        const plx = gsap.getProperty(pl, "x") as number;
        const ply = gsap.getProperty(pl, "y") as number;
        for (let i = 0; i < items.length; i++) {
          const dx = px - (left + plx + centers[i][0]);
          const dy = py - (top + ply + centers[i][1]);
          // 커서가 그 사진 칸 위에 있으면 최대(222×296), 아니면 거리에 비례
          // 판정에는 확대 전 크기를 쓴다 — 확대된 크기를 쓰면 한 번 커진 사진이 계속 붙잡힌다
          const over = Math.abs(dx) <= TILE_W / 2 && Math.abs(dy) <= TILE_H / 2;
          const t = over ? 1 : Math.max(0, 1 - Math.hypot(dx, dy) / RADIUS);
          scaleX[i](1 + (MAX_SCALE - 1) * t);
          scaleY[i](1 + (MAX_SCALE - 1) * t);
          items[i].style.zIndex = t > 0 ? String(Math.round(t * 100)) : "";
        }
      };

      measure();
      window.addEventListener("resize", measure);
      window.addEventListener("pointermove", onMove, { passive: true });
      gsap.ticker.add(update);
      return () => {
        window.removeEventListener("resize", measure);
        window.removeEventListener("pointermove", onMove);
        gsap.ticker.remove(update);
      };
    },
    { scope: viewport, dependencies: [photos] },
  );

  return (
    <div
      ref={viewport}
      className="relative min-h-0 flex-1 overflow-hidden motion-reduce:overflow-auto"
    >
      <div
        ref={plate}
        className="absolute top-0 left-0 will-change-transform"
        style={{ width: PLATE_W, height: PLATE_H }}
      >
        <div
          className="absolute grid"
          style={{
            left: GRID_X,
            top: GRID_Y,
            gridTemplateColumns: `repeat(27, ${TILE_W}px)`,
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
              <Image
                src={asset(p.src)}
                alt={p.alt}
                fill
                sizes={`${TILE_W}px`}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
