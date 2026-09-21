import Intro from "@/components/intro/Intro";
import PageShell from "@/components/layout/PageShell";
import FieldAccordion from "@/components/home/FieldAccordion";
import { FIELDS, type FieldKey, type Work } from "@/data/types";
import { getWorks } from "@/data/works";
import { SITE } from "@/lib/site";

export default function HomePage() {
  // TODO: Figma 설명대로 분야별 썸네일은 랜덤 순서 → 클라이언트에서 섞기(hydration 불일치 주의)
  const worksByField = Object.fromEntries(FIELDS.map((f) => [f.key, getWorks(f.key)])) as Record<
    FieldKey,
    Work[]
  >;

  return (
    <>
      <Intro />
      <PageShell inverse>
        {/* 전시 정보 — TODO: 스크롤에 따라 opacity 조절 (GSAP ScrollTrigger scrub) */}
        <section className="page-grid min-h-[calc(100svh-176px)] content-center gap-y-16 pb-24">
          <dl className="col-span-6 space-y-12 text-body">
            <div>
              <dt className="sr-only">전시명</dt>
              <dd>
                2026
                <br />
                Degree Show
              </dd>
            </div>
            <div>
              <dt className="sr-only">기간</dt>
              <dd>
                {SITE.periodShort.start}
                <br />- {SITE.periodShort.end}
              </dd>
            </div>
            <div>
              <dt className="sr-only">장소</dt>
              <dd>
                Handong
                <br />
                Global University
                <br />
                Genesis Hall
              </dd>
            </div>
          </dl>
          <div className="col-span-6 space-y-10 font-kr text-body-sm">
            <div>
              <h2 className="mb-2">주제 말씀</h2>
              <p>{SITE.verse.ref}</p>
              <p>{SITE.verse.text}</p>
            </div>
            <div>
              <h2 className="mb-2">전시 소개</h2>
              <p>전시 소개 문구 (TODO)</p>
            </div>
          </div>
        </section>

        <FieldAccordion worksByField={worksByField} />
      </PageShell>
    </>
  );
}
