"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/**
 * 줄마다 아래에서 위로 천천히 올라오는 글 (레퍼런스: rbp-agency-template 의 헤드라인 등장).
 * 줄은 overflow-hidden 마스크 안에 있고, 안쪽 글줄이 110% 아래에서 제자리로 올라온다.
 * 화면에 들어올 때 한 번만 재생한다. 모션 줄이기 설정이면 처음부터 보인다.
 *
 * lines 의 줄바꿈은 Figma 시안 그대로다.
 */
export default function RevealLines({
  lines,
  as: Tag = "p",
  className,
  delay = 0,
}: {
  lines: readonly string[];
  as?: "p" | "h2";
  className?: string;
  /** 앞 블록보다 늦게 시작할 때 (초) */
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const inner = gsap.utils.toArray<HTMLElement>("[data-line]", ref.current);
      gsap.fromTo(
        inner,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.4,
          ease: "power3.out",
          stagger: 0.12,
          delay,
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    // 스크린리더는 한 문장으로 읽게 마스크 줄은 aria-hidden, 원문은 sr-only 로 둔다
    <Tag ref={ref as React.Ref<HTMLParagraphElement & HTMLHeadingElement>} className={cn(className)}>
      <span className="sr-only">{lines.join(" ")}</span>
      {lines.map((line) => (
        <span key={line} aria-hidden className="block overflow-hidden">
          <span data-line className="block will-change-transform">
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
