import { Fragment } from "react";
import Image from "next/image";
import Intro from "@/components/intro/Intro";
import PageShell from "@/components/layout/PageShell";
import HomeTitle from "@/components/home/HomeTitle";
import RevealLines from "@/components/home/RevealLines";
import FieldAccordion from "@/components/home/FieldAccordion";
import { FIELDS, type FieldKey, type Work } from "@/data/types";
import { getWorks } from "@/data/works";
import { HOME_HERO, HOME_INFO, HOME_INTRO, HOME_TITLE, HOME_VERSE } from "@/data/home";
import { asset } from "@/lib/asset";
import { INTRO_SEEN_SCRIPT, INTRO_SKIP_SCRIPT } from "@/lib/intro";

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
 * Figma 홈 (2698:15669 기본 / 2573:23209 · 23559 · 24156 분야 펼침) — 1920 기준, 배경 검정
 *
 * - 키비주얼 : 위·양옆 24, 1872×484 (화면 폭에 맞춰 비율 유지)
 * - 로고타입 : 키비주얼 아래 67, 폭 759 (= 콘텐츠 폭 1872 의 40.56%)
 * - 말씀     : 로고 아래 36, Pretendard Medium 20/1.5, 폭 461
 * - 아래 줄  : 말씀 아래 132. 왼쪽 전시 정보(Date·Time·Venue — 24/1.5, 이름 Medium·값 Light, 묶음 사이 20),
 *              오른쪽 끝에 전시 소개 폭 793 (제목 20/36, 8 띄우고 본문 20/1.6)
 *              시안은 오른쪽 묶음이 화면 밖(1997)까지 나가 있어 오른쪽 마진 24 에 맞춘다
 * - 분야 아코디언: 아래 줄에서 194 / 푸터까지 300
 * 한글 문구의 크기·행간은 Typography 스타일에 없는 값이라 직접 지정한다.
 * 데스크톱에서는 글자 크기·폭·간격을 1920 기준 비율(var(--u) = 1920 기준 1px)로 줄이고 늘린다
 * — 시안의 줄바꿈이 어느 화면 폭에서도 그대로 유지된다.
 * 헤더는 시안에 없다 — 본문 위에 숨어 있다가 커서를 화면 위쪽으로 올리면 내려온다 (overlayHeader).
 *
 * 인터랙션
 * - 인트로 → 홈: 홈 전체가 레이어로 아래에서 올라와 고정된 인트로를 덮는다. 다시 올리면 인트로가 보인다 (Intro 참고)
 * - 로고타입: 화면에 들어오면 줄마다 아래에서 올라오고, 커서를 올리면 글자가 순서대로 굴러 바뀐다 (HomeTitle)
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

            <h1 className="mt-[calc(67*var(--u))] w-[40.56%] pl-px max-md:mt-10 max-md:w-full max-md:max-w-[480px]">
              <HomeTitle />
            </h1>

            <p className="mt-[calc(36*var(--u))] pl-px font-kr text-[calc(20*var(--u))] leading-[1.5] font-medium max-md:mt-6 max-md:text-[16px]">
              <Lines lines={HOME_VERSE} />
            </p>

            <div className="mt-[calc(132*var(--u))] flex items-start justify-between gap-10 pl-px font-kr max-md:mt-16 max-md:flex-col max-md:gap-12">
              {/* 전시 정보 */}
              <dl className="flex flex-col gap-[calc(20*var(--u))] text-[calc(24*var(--u))] leading-[1.5] max-md:gap-4 max-md:text-[18px]">
                {HOME_INFO.map((info) => (
                  <div key={info.label}>
                    <dt className="font-medium">{info.label}</dt>
                    <dd className="font-light whitespace-nowrap">{info.value}</dd>
                  </div>
                ))}
              </dl>

              {/* 전시 소개 */}
              <section
                aria-label="전시 소개"
                className="w-[calc(793*var(--u))] text-[calc(20*var(--u))] max-md:w-full max-md:text-[16px]"
              >
                <RevealLines as="h2" lines={[HOME_TITLE]} className="leading-[1.8]" />
                <RevealLines
                  lines={HOME_INTRO}
                  delay={0.15}
                  className="mt-[calc(8*var(--u))] leading-[1.6] max-md:mt-2"
                />
              </section>
            </div>
          </section>

          <div className="mt-[calc(194*var(--u))] max-md:mt-20">
            <FieldAccordion worksByField={worksByField} />
          </div>
          {/* 아코디언과 푸터 사이 300px — 모든 페이지 공통 (본문 끝 → 푸터 300) */}
          <div className="h-75 max-md:h-40" />
        </PageShell>
      </div>
      <script dangerouslySetInnerHTML={{ __html: INTRO_SKIP_SCRIPT }} />
    </>
  );
}
