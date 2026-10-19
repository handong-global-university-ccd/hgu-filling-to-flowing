"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { homeStartY } from "@/lib/intro";

/**
 * Lenis 부드러운 스크롤 + GSAP ScrollTrigger 동기화.
 * 모션 줄이기 설정이면 Lenis를 켜지 않는다.
 *
 * 페이지가 열릴 때마다(새로고침·링크 이동·뒤로가기 모두) 맨 위에서 시작한다.
 * 단, 이번 세션에 인트로를 지나친 뒤 홈을 다시 열면 인트로 바로 아래(홈 맨 위)에서 시작한다 (lib/intro.ts).
 * 브라우저의 스크롤 위치 복원을 끄고, 경로가 바뀌면 Lenis 와 창을 함께 0 으로 보낸다.
 * 같은 페이지 안에서 분야만 바꾸는 경우(?field=…)는 경로가 그대로라 여기서 건드리지 않는다.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const y = homeStartY();
    lenisRef.current?.scrollTo(y, { immediate: true, force: true });
    window.scrollTo(0, y);
  }, [pathname]);

  return <>{children}</>;
}
