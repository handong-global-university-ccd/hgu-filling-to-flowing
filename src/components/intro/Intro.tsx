"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ResponsiveVideo from "@/components/media/ResponsiveVideo";
import { SITE } from "@/lib/site";

const KEY = "degree2026:intro-seen";
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Figma 01. 인트로 (1807:14129)
 * - 진입 시 FILLING / TO FLOWING 이 좌우에서 들어오고 키 비주얼 영상 재생
 * - 글자는 mix-blend-difference 로 배경에 따라 흑백 반전
 * - 클릭·스크롤·키 입력 → 홈으로 전환
 *
 * TODO(WebGL): 지금 전환은 clip-path 로 임시 구현.
 *   Liquid Distortion 전환은 components/intro/LiquidTransition.tsx 로 분리해서 교체.
 */
export default function Intro() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    // 세션당 한 번만 보여준다
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(!seen);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const opts = { once: true, passive: true } as const;
    window.addEventListener("wheel", close, opts);
    window.addEventListener("touchmove", close, opts);
    window.addEventListener("keydown", close, { once: true });
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("wheel", close);
      window.removeEventListener("touchmove", close);
      window.removeEventListener("keydown", close);
    };
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          key="intro"
          aria-label="인트로"
          onClick={close}
          className="fixed inset-0 z-[60] h-svh overflow-hidden bg-bg"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <ResponsiveVideo
            landscape={{ src: "/media/intro/bg-landscape.mp4", poster: "/media/intro/bg-landscape.webp" }}
            portrait={{ src: "/media/intro/bg-portrait.mp4", poster: "/media/intro/bg-portrait.webp" }}
            focus="65% 50%"
          />

          <div className="relative h-full text-white mix-blend-difference">
            <h1 className="sr-only">{SITE.title}</h1>
            <motion.p
              aria-hidden
              className="absolute top-[8%] left-margin text-[clamp(56px,10vw,190px)] leading-none font-semibold uppercase"
              initial={{ x: "-110%" }}
              animate={{ x: 0 }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
            >
              Filling
            </motion.p>
            <motion.p
              aria-hidden
              className="absolute top-[24%] right-margin text-[clamp(56px,10vw,190px)] leading-none font-semibold uppercase"
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

          <p className="sr-only">화면을 클릭하거나 스크롤하면 메인으로 이동합니다.</p>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
