"use client";

import { useRef } from "react";
import ResponsiveVideo from "@/components/media/ResponsiveVideo";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { INTRO_SEEN_KEY } from "@/lib/intro";
import { SITE } from "@/lib/site";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MOBILE_QUERY } from "@/lib/header";

/**
 * Figma 01. 인트로 (1807:14129)
 * - 데스크톱만 — 키 비주얼 영상(글자 포함)을 화면 가득 재생한다. 모바일에는 인트로가 없다
 * - 스크롤하면 홈이 아래에서 레이어처럼 올라와 인트로를 덮는다
 *   (GSAP Layered pinning 과 같은 효과 — 인트로를 CSS sticky 로 top 에 붙여 두고 홈이 그 위로 지나간다.
 *    GSAP pin 은 화면 px 로 높이를 고정해서 노트북 폭 zoom(lib/zoom.ts) 에서 인트로가 짧아진다)
 *   홈 쪽 레이어는 page.tsx 에서 relative z-10 + 배경색으로 감싼다
 * - 인트로를 다 덮고 지나가면 이번 세션에는 홈을 인트로 아래에서 시작한다. 위로 스크롤하면 인트로가 다시 보인다 (lib/intro.ts)
 */
export default function Intro() {
  const ref = useRef<HTMLElement>(null);
  // 영상은 데스크톱에서만 붙인다 — 숨긴 섹션 안에 두면 모바일에서도 영상을 받는다 (서버 HTML 에는 없다)
  const desktop = useMediaQuery("(min-width: 768px)");

  useGSAP(
    () => {
      if (document.documentElement.classList.contains("intro-seen")) return;
      // 모바일은 인트로가 없으니 "지나쳤다" 표시도 하지 않는다
      if (window.matchMedia(MOBILE_QUERY).matches) return;
      ScrollTrigger.create({
        trigger: ref.current,
        // 홈 레이어가 인트로 높이만큼 올라와 다 덮은 시점 (스크롤은 화면 px 라 화면 기준 높이로)
        start: "top top",
        end: () => `+=${ref.current?.getBoundingClientRect().height ?? window.innerHeight}`,
        onLeave: () => {
          try {
            sessionStorage.setItem(INTRO_SEEN_KEY, "1");
          } catch {}
          // 같은 세션에서 다른 페이지에 갔다가 홈으로 돌아와도 인트로 아래에서 시작하게
          document.documentElement.classList.add("intro-seen");
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
      // 모바일은 인트로 없이 홈부터 시작한다 — 숨기면 높이가 0 이라 홈 레이어·헤더·스크롤 위치 계산도 그대로 맞는다
      className="sticky top-0 h-(--svh) overflow-hidden bg-bg-inverse max-md:hidden"
    >
      {/* 인트로 영상 (2026-11-03 디자인팀 최종본, 1920×1080 · 4.8초 반복).
          제목·날짜·학교명 글자가 영상 안에 들어 있어서 HTML 글자는 올리지 않는다.
          글자가 화면 가장자리까지 차 있어 잘리지 않게 contain — 16:9 가 아닌 화면에서는 위아래(또는 양옆)가 검정 */}
      {desktop && (
        <ResponsiveVideo
          landscape={{ src: "/media/intro/bg-landscape.mp4", poster: "/media/intro/bg-landscape.webp" }}
          fit="contain"
        />
      )}
      <h1 className="sr-only">{SITE.title}</h1>
      <p className="sr-only">스크롤하면 메인 화면이 올라옵니다.</p>
    </section>
  );
}
