import { Fragment } from "react";
import Image from "next/image";
import Intro from "@/components/intro/Intro";
import PageShell from "@/components/layout/PageShell";
import HomeTitle from "@/components/home/HomeTitle";
import RevealLines from "@/components/home/RevealLines";
import FieldAccordion from "@/components/home/FieldAccordion";
import { FIELDS, type FieldKey, type Work } from "@/data/types";
import { getWorks } from "@/data/works";
import { HOME_HERO, HOME_INTRO, HOME_TAGLINE, HOME_TITLE, HOME_VERSE } from "@/data/home";
import { asset } from "@/lib/asset";
import { INTRO_SEEN_SCRIPT } from "@/lib/intro";

/** 시안 줄바꿈 — 데스크톱에서만 지킨다. 모바일은 폭이 좁아 자연스럽게 흐르게 둔다 */
function Lines({ lines }: { lines: readonly string[] }) {
  return lines.map((line, i) => (
    <Fragment key={line}>
      {i > 0 && (
        <>
          {" "}
          <br className="max-md:hidden" />
        </>
      )}
      {line}
    </Fragment>
  ));
}

/**
 * Figma 홈 (2564:5091 기본 / 2573:23209 · 23559 · 24156 분야 펼침) — 1920 기준, 배경 검정
 *
 * - 키비주얼 : 위·양옆 24, 1872×484 (화면 폭에 맞춰 비율 유지)
 * - 로고타입 : 키비주얼 아래 55, 폭 759 (= 콘텐츠 폭 1872 의 40.56%)
 * - 태그라인 : 로고 아래 50 (말씀 블록 기준. 제목 글줄은 57) — ": 채우심으로 말미암아"(40/42 SemiBold) + 36 + 말씀(20/28 Medium), 세로 가운데 정렬
 * - 전시 소개: 태그라인 아래 120, 56.25%+6 지점, 폭 793 — 제목·본문 모두 24/42 Regular, 사이 11
 * - 분야 아코디언: 소개 아래 160 / 푸터까지 421
 * 한글 문구의 크기·행간은 Typography 스타일에 없는 값이라 직접 지정한다.
 * 데스크톱에서는 글자 크기·폭·간격을 1920 기준 비율(var(--u) = 100vw/1920)로 줄이고 늘린다
 * — 시안의 줄바꿈이 어느 화면 폭에서도 그대로 유지된다.
 * 헤더는 시안에 없다 — 본문 위에 숨어 있다가 커서를 화면 위쪽으로 올리면 내려온다 (overlayHeader).
 *
 * 인터랙션
 * - 인트로 → 홈: 홈 전체가 레이어로 아래에서 올라와 고정된 인트로를 덮는다 (Intro 참고)
 * - 로고타입: 커서를 올리면 글자가 순서대로 굴러 바뀐다 (HomeTitle)
 * - 전시 소개: 줄마다 아래에서 천천히 올라온다 (RevealLines)
 */
export default function HomePage() {
  // TODO: Figma 설명대로 분야별 썸네일은 랜덤 순서 → 클라이언트에서 섞기(hydration 불일치 주의)
  const worksByField = Object.fromEntries(FIELDS.map((f) => [f.key, getWorks(f.key)])) as Record<
    FieldKey,
    Work[]
  >;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: INTRO_SEEN_SCRIPT }} />
      <Intro />
      {/* 인트로 위로 올라오는 레이어 */}
      <div className="relative z-10">
        <PageShell inverse overlayHeader>
          <section className="px-margin pt-6">
            <div className="relative aspect-[1872/484] w-full overflow-hidden max-md:aspect-[3/2]">
              <Image src={asset(HOME_HERO)} alt="" fill priority sizes="100vw" className="object-cover" />
            </div>

            <h1 className="mt-[calc(55*var(--u))] w-[40.56%] pl-px max-md:mt-10 max-md:w-full max-md:max-w-[480px]">
              <HomeTitle />
            </h1>

            <div className="mt-[calc(50*var(--u))] flex items-center gap-[calc(36*var(--u))] pl-[3px] font-kr max-md:mt-8 max-md:flex-col max-md:items-start max-md:gap-3">
              <p className="text-[calc(40*var(--u))] leading-[calc(42*var(--u))] font-semibold whitespace-nowrap max-md:text-[28px] max-md:leading-[36px]">
                {HOME_TAGLINE}
              </p>
              <p className="text-[calc(20*var(--u))] leading-[calc(28*var(--u))] font-medium max-md:text-[16px] max-md:leading-[24px]">
                <Lines lines={HOME_VERSE} />
              </p>
            </div>
          </section>

          <section
            aria-label="전시 소개"
            className="mt-[calc(120*var(--u))] font-kr text-[calc(24*var(--u))] leading-[calc(42*var(--u))] max-md:mt-16 max-md:px-margin max-md:text-[18px] max-md:leading-[30px] md:pl-[calc(56.25%+6px)]"
          >
            <div className="md:w-[calc(793*var(--u))]">
              <RevealLines as="h2" lines={[HOME_TITLE]} />
              <RevealLines lines={HOME_INTRO} delay={0.15} className="mt-[calc(11*var(--u))] max-md:mt-3" />
            </div>
          </section>

          <div className="mt-[calc(160*var(--u))] max-md:mt-20">
            <FieldAccordion worksByField={worksByField} />
          </div>
          {/* 아코디언과 푸터 사이 421px */}
          <div className="h-[calc(421*var(--u))] max-md:h-40" />
        </PageShell>
      </div>
    </>
  );
}
