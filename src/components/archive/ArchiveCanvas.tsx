"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { asset } from "@/lib/asset";
import { GAP, GRID_X, GRID_Y, PLATE_H, PLATE_W, TILE_H, TILE_W } from "@/data/archive-layout";
import { pageZoom } from "@/lib/zoom";
import { HEADER_H, MOBILE_QUERY } from "@/lib/header";

export type Photo = {
  src: string;
  alt: string;
  /** 호버하면 사진 위쪽 띠에 뜨는 제목 (팀 이름) */
  title: string;
  col: number;
  row: number;
};

/** Figma 인터렉션 설명 (1801:15067) */
const RADIUS = 200; // px
const DURATION = 0.35; // s
const PAN_DURATION = 1.2; // s
/** 호버(거리 0)에서 222×296 이 되도록 — 222/103 ≈ 296/137 */
const MAX_SCALE = 222 / TILE_W;
const HOVER_W = 222;
const HOVER_H = 296;
/** 오버뷰(왼쪽 아래 미니맵) — 판 3840×2160 을 220 폭으로 줄인 것. Figma 2670:13884 (220×123.75, 왼쪽 24·아래 40) */
const MAP_W = 220;
const MAP_SCALE = MAP_W / PLATE_W;
const MAP_H = PLATE_H * MAP_SCALE;

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
 * - 커서가 올라간 사진 위쪽에 제목 띠 (Figma 2574:5519·5520·5521):
 *   222×32 검정 60%, 제목 Pretendard Medium 14/18 흰색 (왼쪽 5·위 7).
 *   사진은 scale 로 커지므로 띠는 사진 안에 넣지 않고 판 위에 따로 띄운다 — 글자가 같이 늘어나 흐려지지 않게
 * - 오버뷰 (댓글 #205·#227): 왼쪽 아래 미니맵에 지금 보이는 영역을 사각형으로 표시한다.
 *   미니맵을 누르거나 끌면 그 자리로 판이 이동하고, 미니맵 위에서는 마우스 따라 움직이기를 멈춘다
 */
export default function ArchiveCanvas({ photos }: { photos: Photo[] }) {
  const viewport = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const map = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const vp = viewport.current!;
      const pl = plate.current!;
      const mp = map.current!;
      const fr = frame.current!;
      const lb = label.current!;
      const lbText = lb.firstElementChild as HTMLElement;
      let shown = -1;
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
      // 판 맨 위가 펼친 헤더 아래에서 끝나게 — 커서를 위로 올리면 헤더가 내려오므로,
      // 그때 맨 윗줄 사진이 헤더에 가려지지 않도록 헤더 높이만큼 더 내려올 수 있게 한다
      let inset = 0;
      const measure = () => {
        // 화면 좌표 → 페이지 px (노트북 폭 zoom, lib/zoom.ts)
        const z = pageZoom();
        const r = vp.getBoundingClientRect();
        left = r.left / z;
        top = r.top / z;
        width = r.width / z || 1;
        height = r.height / z || 1;
        slackX = Math.max(0, PLATE_W - width);
        inset = window.matchMedia(MOBILE_QUERY).matches
          ? HEADER_H.mobile.archive.expanded
          : HEADER_H.desktop.expanded;
        slackY = Math.max(0, PLATE_H - height) + inset;
        gsap.set(pl, { x: -slackX / 2, y: inset - slackY / 2 });
      };

      let px = -1e4;
      let py = -1e4;
      let overMap = false;
      let dragging = false;

      // 미니맵 좌표 → 그 점이 화면 가운데 오도록 판을 옮긴다 (판 끝을 넘지 않게)
      const goTo = (e: PointerEvent) => {
        const z = pageZoom();
        const r = mp.getBoundingClientRect();
        const cx = (e.clientX - r.left) / z / MAP_SCALE;
        const cy = (e.clientY - r.top) / z / MAP_SCALE;
        moveX(Math.min(0, Math.max(-slackX, width / 2 - cx)));
        moveY(Math.min(inset, Math.max(inset - slackY, height / 2 - cy)));
      };
      const onMapDown = (e: PointerEvent) => {
        dragging = true;
        mp.setPointerCapture(e.pointerId);
        goTo(e);
      };
      const onMapMove = (e: PointerEvent) => dragging && goTo(e);
      const onMapUp = () => (dragging = false);
      const onMapEnter = () => {
        overMap = true;
        // 미니맵 밑에 깔린 사진이 커지지 않게 커서를 판 밖으로 뺀다
        px = -1e4;
        py = -1e4;
      };
      const onMapLeave = () => (overMap = false);

      const onMove = (e: PointerEvent) => {
        if (overMap || dragging) return;
        const z = pageZoom();
        px = e.clientX / z;
        py = e.clientY / z;
        // 커서가 헤더 위로 올라가도 판은 계속 따라온다 (양 끝까지 밀 수 있게)
        const nx = Math.min(0.5, Math.max(-0.5, (px - left) / width - 0.5));
        const ny = Math.min(0.5, Math.max(-0.5, (py - top) / height - 0.5));
        moveX(-slackX / 2 - nx * slackX);
        moveY(inset - slackY / 2 - ny * slackY);
      };

      // 확대는 매 프레임 다시 계산한다 — 판이 1.2초 동안 계속 미끄러지므로
      // pointermove 때 한 번만 재면 커서 밑 사진이 엉뚱한 크기로 멈춘다
      const update = () => {
        const plx = gsap.getProperty(pl, "x") as number;
        const ply = gsap.getProperty(pl, "y") as number;
        // 오버뷰의 현재 영역 — 화면에 보이는 판 범위를 미니맵 비율로
        fr.style.transform = `translate(${-plx * MAP_SCALE}px, ${-ply * MAP_SCALE}px)`;
        fr.style.width = `${width * MAP_SCALE}px`;
        fr.style.height = `${height * MAP_SCALE}px`;
        let hovered = -1;
        for (let i = 0; i < items.length; i++) {
          const dx = px - (left + plx + centers[i][0]);
          const dy = py - (top + ply + centers[i][1]);
          // 커서가 그 사진 칸 위에 있으면 최대(222×296), 아니면 거리에 비례
          // 판정에는 확대 전 크기를 쓴다 — 확대된 크기를 쓰면 한 번 커진 사진이 계속 붙잡힌다
          const over = Math.abs(dx) <= TILE_W / 2 && Math.abs(dy) <= TILE_H / 2;
          if (over) hovered = i;
          const t = over ? 1 : Math.max(0, 1 - Math.hypot(dx, dy) / RADIUS);
          scaleX[i](1 + (MAX_SCALE - 1) * t);
          scaleY[i](1 + (MAX_SCALE - 1) * t);
          items[i].style.zIndex = t > 0 ? String(Math.round(t * 100)) : "";
        }

        // 제목 띠 — 커진 사진(222×296)의 위쪽에 맞춘다. 사진 중심은 판 기준으로 고정이다
        if (hovered !== shown) {
          shown = hovered;
          if (hovered >= 0) {
            lb.style.left = `${centers[hovered][0] - HOVER_W / 2}px`;
            lb.style.top = `${centers[hovered][1] - HOVER_H / 2}px`;
            lbText.textContent = photos[hovered].title;
          }
          lb.style.opacity = hovered >= 0 ? "1" : "0";
        }
      };

      measure();
      window.addEventListener("resize", measure);
      window.addEventListener("pointermove", onMove, { passive: true });
      mp.addEventListener("pointerdown", onMapDown);
      mp.addEventListener("pointermove", onMapMove);
      mp.addEventListener("pointerup", onMapUp);
      mp.addEventListener("pointercancel", onMapUp);
      mp.addEventListener("pointerenter", onMapEnter);
      mp.addEventListener("pointerleave", onMapLeave);
      gsap.ticker.add(update);
      return () => {
        window.removeEventListener("resize", measure);
        window.removeEventListener("pointermove", onMove);
        mp.removeEventListener("pointerdown", onMapDown);
        mp.removeEventListener("pointermove", onMapMove);
        mp.removeEventListener("pointerup", onMapUp);
        mp.removeEventListener("pointercancel", onMapUp);
        mp.removeEventListener("pointerenter", onMapEnter);
        mp.removeEventListener("pointerleave", onMapLeave);
        gsap.ticker.remove(update);
      };
    },
    { scope: viewport, dependencies: [photos] },
  );

  return (
    <div
      ref={viewport}
      // 터치: 손가락 위치가 커서 역할 — 브라우저 기본 스크롤·줌을 꺼야 pointermove 가 계속 온다
      className="relative min-h-0 flex-1 touch-none overflow-hidden motion-reduce:overflow-auto"
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
              <Image src={asset(p.src)} alt={p.alt} fill sizes={`${HOVER_W}px`} className="object-cover" />
            </div>
          ))}
        </div>

        <div
          ref={label}
          aria-hidden
          className="pointer-events-none absolute z-[101] h-8 bg-bg-inverse/60 px-[5px] pt-[7px] opacity-0 transition-opacity duration-300"
          style={{ width: HOVER_W }}
        >
          {/* Pretendard Medium 14/18 — Typography 스타일에 없는 값이라 직접 지정 */}
          <p className="truncate font-kr text-[14px] leading-[18px] font-medium text-fg-inverse" />
        </div>
      </div>

      {/* 오버뷰 — 마우스로만 쓰는 보조 내비게이션이라 보조기기에는 숨긴다. 모바일·모션 줄이기에서는 판이 움직이지 않아 없앤다 */}
      <div
        ref={map}
        aria-hidden
        className="absolute bottom-10 left-margin z-20 cursor-pointer touch-none overflow-hidden bg-neutral-200 opacity-60 motion-reduce:hidden max-md:hidden"
        style={{ width: MAP_W, height: MAP_H }}
      >
        <div ref={frame} className="pointer-events-none absolute top-0 left-0 bg-neutral-300" />
      </div>
    </div>
  );
}
