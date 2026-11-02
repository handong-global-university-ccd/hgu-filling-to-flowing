"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * 인트로 위로 올라오는 홈 레이어 (Figma 홈화면 2573:27766, 댓글 #229).
 * 인트로가 끝나고 올라오는 동안은 양옆에 마진(24)을 두고 올라오다가,
 * 화면을 다 덮으면(레이어 맨 위가 화면 맨 위에 닿으면) 마진 없이 꽉 찬 시안 화면이 된다.
 * 양옆을 clip-path 로 잘라서 만든다 — 레이아웃·글자 크기는 바뀌지 않는다.
 * 데스크톱에서만, 모션 줄이기 설정이면 처음부터 꽉 찬 상태.
 */
export default function HomeLayer({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 48rem) and (prefers-reduced-motion: no-preference)", () => {
        const el = ref.current!;
        const margin =
          getComputedStyle(document.documentElement).getPropertyValue("--spacing-margin").trim() || "24px";
        gsap.fromTo(
          el,
          { clipPath: `inset(0px ${margin} 0px ${margin})` },
          {
            clipPath: "inset(0px 0px 0px 0px)",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative z-10">
      {children}
    </div>
  );
}
