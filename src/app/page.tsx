import Image from "next/image";
import Intro from "@/components/intro/Intro";
import PageShell from "@/components/layout/PageShell";
import HomeTitle from "@/components/home/HomeTitle";
import RevealLines from "@/components/home/RevealLines";
import FieldAccordion from "@/components/home/FieldAccordion";
import FieldListMobile from "@/components/home/FieldListMobile";
import { FIELDS, type FieldKey, type Work } from "@/data/types";
import { getWorks } from "@/data/works";
import {
  HOME_HERO,
  HOME_INFO,
  HOME_INTRO,
  HOME_MOBILE,
  HOME_TITLE,
  HOME_VERSE,
  VERSE_DELAY,
} from "@/data/home";
import { asset } from "@/lib/asset";
import { INTRO_SEEN_SCRIPT, INTRO_SKIP_SCRIPT } from "@/lib/intro";

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
 * - 로고타입 → 말씀: 전시 소개와 같은 모션으로 FILLING → TO FLOWING → 말씀 두 줄이 한 줄씩 올라온다 (HomeTitle)
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
          {/* ───── 모바일 (2624:5445) ─────
              시안 y 에서 상태 표시줄 54 를 뺀 값. 세로 키비주얼 430×686 이 위로 63 넘쳐 있고 아래 52 는 검정으로 흐려진다
              로고 327 (left 16, top 28) · 크레딧 16/22 (left 21, top 155) · 날짜 18/25.6 (232/454, 313/477)
              소개 12/20 가운데 정렬 폭 352 (top 667, 말씀과 본문 사이 44) · 분야 목록 top 1011 · 푸터까지 86 */}
          <section className="relative md:hidden">
            <div className="relative h-[624px] overflow-hidden">
              <div className="absolute top-[-63px] left-1/2 h-[686px] w-[430px] -translate-x-1/2">
                <Image
                  src={asset(HOME_MOBILE.hero)}
                  alt=""
                  fill
                  priority
                  sizes="430px"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-[53px] bg-linear-to-b from-transparent to-bg-inverse" />
            </div>

            <h1 className="absolute top-[28px] left-4 w-[327px]">
              <HomeTitle />
            </h1>
            <p className="absolute top-[155px] left-[21px] text-[16px] leading-[22px] font-medium">
              {HOME_MOBILE.credit.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <p className="absolute top-[454px] left-[232px] text-[18px] leading-[25.6px] font-medium">
              {HOME_MOBILE.date[0]}
            </p>
            <p className="absolute top-[477px] left-[calc(313/390*100%)] text-[18px] leading-[25.6px] font-medium">
              {HOME_MOBILE.date[1]}
            </p>

            <div className="mx-auto mt-[43px] flex w-[352px] max-w-[calc(100%-32px)] flex-col gap-11 text-center font-kr text-[12px] leading-[20px]">
              <RevealLines lines={HOME_MOBILE.verse} />
              <RevealLines lines={HOME_MOBILE.intro} delay={0.15} />
            </div>

            <div className="mt-[60px]">
              <FieldListMobile worksByField={worksByField} />
            </div>
            <div className="h-[86px]" />
          </section>

          {/* ───── 데스크톱 ───── */}
          <section className="px-margin pt-6 max-md:hidden">
            <div className="relative aspect-[1872/484] w-full overflow-hidden max-md:aspect-[3/2]">
              <Image src={asset(HOME_HERO)} alt="" fill priority sizes="100vw" className="object-cover" />
            </div>

            <h1 className="mt-[calc(67*var(--u))] w-[40.56%] pl-px max-md:mt-10 max-md:w-full max-md:max-w-[480px]">
              <HomeTitle />
            </h1>

            {/* 로고 두 줄 다음으로 이어서 한 줄씩 올라온다 */}
            <RevealLines
              lines={HOME_VERSE}
              delay={VERSE_DELAY}
              className="mt-[calc(36*var(--u))] pl-px font-kr text-[calc(20*var(--u))] leading-[1.5] font-medium max-md:mt-6 max-md:text-[16px]"
            />

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

          <div className="mt-[calc(194*var(--u))] max-md:hidden">
            <FieldAccordion worksByField={worksByField} />
          </div>
          {/* 아코디언과 푸터 사이 300px — 모든 페이지 공통 (본문 끝 → 푸터 300) */}
          <div className="h-75 max-md:hidden" />
        </PageShell>
      </div>
      <script dangerouslySetInnerHTML={{ __html: INTRO_SKIP_SCRIPT }} />
    </>
  );
}
