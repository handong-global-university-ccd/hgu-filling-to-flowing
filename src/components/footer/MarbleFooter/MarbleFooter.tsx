"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { DEFAULT_MARBLE_PARAMS, MarbleFlowEngine, MarbleParams, isWebGLAvailable } from "./MarbleFlowEngine";

export type MarbleFooterProps = Partial<MarbleParams> & {
  /** 투명 PNG/WebP 경로 (권장). 흰 배경 이미지라면 maskSrc도 함께 넘긴다. */
  src: string;
  /** 선택: 흰색 = 물감, 검정 = 배경. 흰 배경이 포함된 이미지를 그대로 쓸 때 사용 */
  maskSrc?: string;
  alt?: string;
  /** 이미지 가로세로비. 생략하면 이미지 원본 비율을 자동으로 사용 */
  aspectRatio?: number;
  maxDpr?: number;
  /** 이미지 위쪽 여백(px). 물감이 위로 흘러넘쳐도 잘리지 않게 캔버스를 더 깔아 둔다. 부모가 overflow:hidden이면 잘리니 주의 */
  bleedTop?: number;
  touchAction?: CSSProperties["touchAction"];
  className?: string;
  style?: CSSProperties;
};

const PARAM_KEYS = Object.keys(DEFAULT_MARBLE_PARAMS) as (keyof MarbleParams)[];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * FILLING TO FLOWING — 푸터 마블 키 비주얼
 *
 * 기본 상태는 완전 정지. 물감 위에서 커서를 움직일 때만 주변 결이 아주 미세하게 밀리고,
 * 멈추면 약 1초에 걸쳐 원위치로 돌아온다. reduced-motion / WebGL 미지원 시 <img>만 렌더.
 */
export default function MarbleFooter(props: MarbleFooterProps) {
  const {
    src,
    maskSrc,
    alt = "",
    aspectRatio,
    maxDpr = 1.5,
    bleedTop = 120,
    touchAction = "pan-y",
    className,
    style,
  } = props;

  const hostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<MarbleFlowEngine | null>(null);
  const [ratio, setRatio] = useState<number | undefined>(aspectRatio);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduced = usePrefersReducedMotion();

  const params: Partial<MarbleParams> = {};
  for (const k of PARAM_KEYS) if (props[k] !== undefined) (params as Record<string, unknown>)[k] = props[k];
  const paramsKey = JSON.stringify(params);

  const interactive = !reduced && !failed;

  // 엔진 생성 / 해제 (이미지 경로가 바뀔 때만 재생성)
  useEffect(() => {
    const host = hostRef.current;
    if (!host || !interactive) return;
    if (!isWebGLAvailable()) {
      // WebGL 지원 여부는 브라우저에서만 알 수 있어서 마운트 직후 한 번 확인한다
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFailed(true);
      return;
    }
    let engine: MarbleFlowEngine;
    try {
      engine = new MarbleFlowEngine({
        container: host,
        src,
        maskSrc,
        params,
        maxDpr,
        bleedTop,
        touchAction: String(touchAction),
        onReady: () => setReady(true),
        onError: () => {
          setReady(false);
          setFailed(true);
        },
      });
    } catch {
      setFailed(true);
      return;
    }
    engineRef.current = engine;
    return () => {
      engine.dispose();
      engineRef.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, maskSrc, maxDpr, bleedTop, touchAction, interactive]);

  // 파라미터만 바뀌면 엔진을 다시 만들지 않고 uniform만 갱신
  useEffect(() => {
    engineRef.current?.setParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: ratio ? String(ratio) : undefined,
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
    >
      {/* 정적 이미지: SEO/접근성 + 로딩 전 · reduced-motion · WebGL 미지원 시 그대로 보임 */}
      {/* WebGL 텍스처와 같은 원본을 그대로 보여줘야 해서 next/image 대신 <img> */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        decoding="async"
        onLoad={(e) => {
          if (!aspectRatio) {
            const im = e.currentTarget;
            if (im.naturalWidth) setRatio(im.naturalWidth / im.naturalHeight);
          }
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "fill",
          pointerEvents: "none",
          // 캔버스가 준비되면 숨김(투명 가장자리가 두 번 겹치지 않도록)
          visibility: interactive && ready ? "hidden" : "visible",
        }}
      />
    </div>
  );
}
