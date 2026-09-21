import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

/** Figma About (1807:15663) — 좌측 타이틀·일시 고정, 우측 세부 정보만 스크롤 */
export default function AboutPage() {
  const sections = [
    { title: "주제 말씀", body: `${SITE.verse.ref}\n${SITE.verse.text}` },
    { title: "전시 소개", body: "전시 소개 문구 (TODO)" },
    { title: "졸업준비위원회", body: "(TODO)" },
    { title: "교수진", body: "(TODO)" },
    { title: "후원사", body: "(TODO)" },
  ];

  return (
    <PageShell>
      <div className="page-grid">
        <div className="col-span-12 lg:sticky lg:top-[100px] lg:col-span-6 lg:self-start">
          <h1 className="text-h1 uppercase">{SITE.title}</h1>
          <p className="mt-4 font-kr text-body-sm">{SITE.period}</p>
        </div>
        <div className="col-span-12 space-y-20 lg:col-span-6">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="mb-4 text-label">{s.title}</h2>
              <p className="font-kr text-body whitespace-pre-line">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
