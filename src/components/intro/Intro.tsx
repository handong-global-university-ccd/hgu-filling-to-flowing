"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import ResponsiveVideo from "@/components/media/ResponsiveVideo";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { INTRO_SEEN_KEY } from "@/lib/intro";
import { SITE } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Figma 01. 인트로 (1807:14129)
 * - 진입 시 FILLING / TO FLOWING 이 좌우에서 들어오고 키 비주얼 영상 재생
 * - 글자는 mix-blend-difference 로 배경에 따라 흑백 반전
 * - 스크롤하면 홈이 아래에서 레이어처럼 올라와 인트로를 덮는다
 *   (GSAP Layered pinning 과 같은 효과 — 인트로를 CSS sticky 로 top 에 붙여 두고 홈이 그 위로 지나간다.
 *    GSAP pin 은 화면 px 로 높이를 고정해서 노트북 폭 zoom(lib/zoom.ts) 에서 인트로가 짧아진다)
 *   홈 쪽 레이어는 page.tsx 에서 relative z-10 + 배경색으로 감싼다
 * - 인트로를 다 덮고 지나가면 이번 세션에는 다시 보여주지 않는다 (INTRO_SEEN_SCRIPT)
 */
export default function Intro() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (document.documentElement.classList.contains("intro-seen")) return;
      ScrollTrigger.create({
        trigger: ref.current,
        // 홈 레이어가 인트로 높이만큼 올라와 다 덮은 시점 (스크롤은 화면 px 라 화면 기준 높이로)
        start: "top top",
        end: () => `+=${ref.current?.getBoundingClientRect().height ?? window.innerHeight}`,
        onLeave: () => {
          try {
            sessionStorage.setItem(INTRO_SEEN_KEY, "1");
          } catch {}
        },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      data-intro
      aria-label="인트로"
      className="sticky top-0 h-(--svh) overflow-hidden bg-bg"
    >
      {/* TODO: 실제 영상이 R2 에 올라가면 /media/intro/bg-*.mp4 · bg-*.webp 로 교체 */}
      <ResponsiveVideo
        landscape={{
          src: "/placeholder/dummy/intro/bg-landscape.mp4",
          poster: "/placeholder/dummy/intro/bg-landscape.webp",
        }}
        portrait={{
          src: "/placeholder/dummy/intro/bg-portrait.mp4",
          poster: "/placeholder/dummy/intro/bg-portrait.webp",
        }}
        focus="65% 50%"
      />

      <div className="relative h-full text-white mix-blend-difference">
        <h1 className="sr-only">{SITE.title}</h1>
        <motion.p
          aria-hidden
          className="absolute top-[8%] left-margin text-[clamp(56px,calc(var(--vw)*0.1),190px)] leading-none font-semibold uppercase"
          initial={{ x: "-110%" }}
          animate={{ x: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
        >
          Filling
        </motion.p>
        <motion.p
          aria-hidden
          className="absolute top-[24%] right-margin text-[clamp(56px,calc(var(--vw)*0.1),190px)] leading-none font-semibold uppercase"
          initial={{ x: "110%" }}
          animate={{ x: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.35 }}
        >
          To Flowing
        </motion.p>

        <div className="absolute top-[57%] left-[38%] text-body">
          <p>2026</p>
          <p>{SITE.subtitle.replace("2026 ", "")}</p>
        </div>
        <div className="absolute top-[72%] left-[56%] text-body">
          <p>{SITE.periodShort.start}</p>
          <p>- {SITE.periodShort.end}</p>
        </div>
        <div className="absolute bottom-margin left-margin text-body">
          {SITE.org.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>

      <p className="sr-only">스크롤하면 메인 화면이 올라옵니다.</p>
    </section>
  );
}
