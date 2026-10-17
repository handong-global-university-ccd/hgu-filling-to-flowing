import { Fragment } from "react";
import Image from "next/image";
import Intro from "@/components/intro/Intro";
import PageShell from "@/components/layout/PageShell";
import Logo from "@/components/layout/Logo";
import FieldAccordion from "@/components/home/FieldAccordion";
import { FIELDS, type FieldKey, type Work } from "@/data/types";
import { getWorks } from "@/data/works";
import { HOME_HERO, HOME_INTRO, HOME_TAGLINE, HOME_TITLE, HOME_VERSE } from "@/data/home";
import { asset } from "@/lib/asset";

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
 * 헤더는 시안에 없다 — 본문 위에 숨어 있다가 커서를 화면 위쪽으로 올리면 내려온다 (overlayHeader).
 */
export default function HomePage() {
  // TODO: Figma 설명대로 분야별 썸네일은 랜덤 순서 → 클라이언트에서 섞기(hydration 불일치 주의)
  const worksByField = Object.fromEntries(FIELDS.map((f) => [f.key, getWorks(f.key)])) as Record<
    FieldKey,
    Work[]
  >;

  return (
    <>
      <Intro />
      <PageShell inverse overlayHeader>
        <section className="px-margin pt-6">
          <div className="relative aspect-[1872/484] w-full overflow-hidden max-md:aspect-[3/2]">
            <Image src={asset(HOME_HERO)} alt="" fill priority sizes="100vw" className="object-cover" />
          </div>

          <h1 className="mt-[55px] w-[40.56%] pl-px max-md:mt-10 max-md:w-full max-md:max-w-[480px]">
            <Logo className="!w-full" />
          </h1>

          <div className="mt-[50px] flex items-center gap-9 pl-[3px] font-kr max-md:mt-8 max-md:flex-col max-md:items-start max-md:gap-3">
            <p className="text-[40px] leading-[42px] font-semibold whitespace-nowrap max-md:text-[28px] max-md:leading-[36px]">
              {HOME_TAGLINE}
            </p>
            <p className="text-[20px] leading-[28px] font-medium max-md:text-[16px] max-md:leading-[24px]">
              <Lines lines={HOME_VERSE} />
            </p>
          </div>
        </section>

        <section
          aria-label="전시 소개"
          className="mt-[120px] font-kr text-[24px] leading-[42px] max-md:mt-16 max-md:px-margin max-md:text-[18px] max-md:leading-[30px] md:pr-margin md:pl-[calc(56.25%+6px)]"
        >
          <div className="max-w-[793px]">
            <h2>{HOME_TITLE}</h2>
            <p className="mt-[11px]">
              <Lines lines={HOME_INTRO} />
            </p>
          </div>
        </section>

        <div className="mt-40 max-md:mt-20">
          <FieldAccordion worksByField={worksByField} />
        </div>
        {/* 아코디언과 푸터 사이 421px */}
        <div className="h-[421px] max-md:h-40" />
      </PageShell>
    </>
  );
}
