"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useIsPortrait } from "@/hooks/useMediaQuery";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

type Source = { src: string; poster: string };

type Props = {
  landscape: Source; // 1920×1080
  portrait?: Source; // 1080×1920 (없으면 landscape를 cover로 크롭)
  /** 남길 초점. 예: "60% 50%" */
  focus?: string;
  className?: string;
  onEnded?: () => void;
  loop?: boolean;
};

/**
 * 배경 영상 — 화면을 꽉 채우고(object-cover) 넘치는 부분은 잘린다.
 * - 세로 화면이면 portrait 영상으로 교체
 * - 모션 줄이기 설정이면 영상 대신 포스터만
 * - 글자는 절대 영상에 넣지 말고 이 컴포넌트 위에 HTML로 올릴 것
 */
export default function ResponsiveVideo({
  landscape,
  portrait,
  focus = "50% 50%",
  className,
  onEnded,
  loop = true,
}: Props) {
  const isPortrait = useIsPortrait();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const source = isPortrait && portrait ? portrait : landscape;

  useEffect(() => {
    const video = ref.current;
    if (!video || reduceMotion) return;
    video.load();
    // iOS 저전력 모드 등에서 자동재생이 막히면 포스터가 그대로 보인다
    video.play().catch(() => {});
  }, [source.src, reduceMotion]);

  const style = { objectPosition: focus };
  const base = cn("absolute inset-0 h-full w-full object-cover", className);

  if (reduceMotion) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={asset(source.poster)} alt="" aria-hidden className={base} style={style} />;
  }

  return (
    <video
      ref={ref}
      key={source.src}
      className={base}
      style={style}
      src={asset(source.src)}
      poster={asset(source.poster)}
      autoPlay
      muted
      playsInline
      loop={loop}
      preload="auto"
      onEnded={onEnded}
      aria-hidden
    />
  );
}
