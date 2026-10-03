import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import { SITE } from "@/lib/site";
import { ABOUT_MESSAGE, COMMITTEE_LEADS, COMMITTEE_TEAMS, HOST, THANKS } from "@/data/about";

export const metadata: Metadata = { title: "About" };

/** 라벨(회색, 86px) + 이름들 한 줄 */
function CreditRow({
  role,
  names,
  stacked = false,
}: {
  role: string;
  names: readonly string[];
  stacked?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <dt className="w-[86px] shrink-0 text-fg-tertiary">{role}</dt>
      <dd className={stacked ? "flex flex-col gap-1" : "flex flex-wrap gap-x-2"}>
        {names.map((n) => (
          <span key={n}>{n}</span>
        ))}
      </dd>
    </div>
  );
}

function CreditGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

/**
 * Figma About 페이지 (1807:15663)
 * 좌측 43.75% 에 전시 개요, 우측에 주제 말씀 + 크레딧.
 */
export default function AboutPage() {
  return (
    <PageShell hideOnScroll headerHeight={84}>
      <div className="grid gap-y-16 pt-[118px] pb-90 lg:grid-cols-[43.75%_1fr]">
        {/* ───── 좌측: 전시 개요 ───── */}
        <div className="px-margin lg:pr-0">
          <div className="max-w-[529px]">
            <h1 className="flex flex-col gap-1">
              <span className="font-kr text-kr-h3 font-semibold">{SITE.fullTitle}</span>
              <span className="text-h3 uppercase">{SITE.title}</span>
            </h1>
            <div className="mt-4 font-kr text-kr-body-lg">
              <p>{SITE.period}</p>
              <p>{SITE.place}</p>
            </div>
          </div>
        </div>

        {/* ───── 우측: 주제 말씀 + 크레딧 ───── */}
        <div className="px-margin lg:pl-[10px]">
          <div className="flex max-w-[843px] flex-col gap-5 font-kr text-kr-body-lg">
            <div>
              <p>{SITE.verse.ref}</p>
              <p>{SITE.verse.text}</p>
            </div>
            <div>
              {ABOUT_MESSAGE.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <dl className="mt-20 flex max-w-[942px] flex-col gap-10 text-body">
            <CreditGroup title="주최">
              <p className="font-kr">{HOST}</p>
            </CreditGroup>

            <CreditGroup title="졸업준비위원회">
              <div className="flex flex-col gap-4 font-kr sm:flex-row sm:gap-4">
                <div className="flex w-[220px] shrink-0 flex-col gap-3">
                  {COMMITTEE_LEADS.map((c) => (
                    <CreditRow key={c.role} role={c.role} names={c.names} />
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {COMMITTEE_TEAMS.map((c) => (
                    <CreditRow key={c.role} role={c.role} names={c.names} />
                  ))}
                </div>
              </div>
            </CreditGroup>

            <CreditGroup title="도움을 주신 분들">
              <div className="flex flex-col gap-8 font-kr sm:flex-row sm:gap-[92px]">
                {THANKS.map((t) => (
                  <CreditRow key={t.role} role={t.role} names={t.names} stacked />
                ))}
              </div>
            </CreditGroup>
          </dl>
        </div>
      </div>
    </PageShell>
  );
}
