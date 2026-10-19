import type { Metadata } from "next";
import Image from "next/image";
import PageShell from "@/components/layout/PageShell";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/cn";
import { ABOUT_MESSAGE, COMMITTEE_LEADS, COMMITTEE_TEAMS, HOST, THANKS } from "@/data/about";
import { HOME_INTRO } from "@/data/home";

export const metadata: Metadata = { title: "About" };

/**
 * 모바일 후원사 로고 (Figma 2499:4632) — "후원사" 라벨 오른쪽 이름 칸에 3개씩 두 줄 (줄 높이 22).
 * 원본은 public/brand/logo1.png 에서 로고별로 잘라 둔 public/brand/sponsors/*.png.
 * left 는 이름 칸 기준, width 는 시안에서 보이는 너비 (높이는 비율대로)
 */
const SPONSOR_ROWS = [
  [
    { src: "/brand/sponsors/moorim.png", alt: "무림페이퍼", w: 194, h: 75, left: 0, width: 37 },
    { src: "/brand/sponsors/sandoll.png", alt: "산돌구름", w: 286, h: 49, left: 57, width: 45 },
    { src: "/brand/sponsors/adsland.png", alt: "ADSLAND", w: 256, h: 63, left: 122, width: 51 },
  ],
  [
    { src: "/brand/sponsors/yesod.png", alt: "YESOD", w: 235, h: 44, left: 0, width: 40 },
    { src: "/brand/sponsors/hddn.png", alt: "hddn hidden figures inc.", w: 131, h: 69, left: 59, width: 23 },
    { src: "/brand/sponsors/rixfont.png", alt: "RixFont", w: 197, h: 47, left: 101, width: 32 },
  ],
] as const;

function SponsorLogos() {
  return (
    <div aria-label="후원사 로고" className="flex flex-col">
      {SPONSOR_ROWS.map((row, i) => (
        <div key={i} className="relative h-[22px] w-[175px]">
          {row.map((l) => (
            <Image
              key={l.src}
              src={l.src}
              alt={l.alt}
              width={l.w}
              height={l.h}
              className="absolute top-1/2 h-auto max-w-none -translate-y-1/2"
              style={{ left: l.left, width: l.width }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * 라벨(회색) + 이름들 한 줄
 * - 데스크톱: 라벨 86, 이름은 칸마다 띄어 쓰거나(stacked) 세로로 쌓는다
 * - 모바일(2499:4632): 라벨 88, 이름은 왼쪽에서 123 — 쉼표로 이어 쓰고 넘치면 줄바꿈(줄높이 20).
 *   mobile 을 주면 모바일에서는 이름 대신 그것을 보여준다 (후원사 로고)
 */
function CreditRow({
  role,
  names,
  stacked = false,
  mobile,
}: {
  role: string;
  names: readonly string[];
  stacked?: boolean;
  mobile?: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 max-md:gap-[35px]">
      <dt className="w-[86px] shrink-0 text-fg-tertiary max-md:w-[88px]">{role}</dt>
      <dd>
        <span className={cn("max-md:hidden", stacked ? "flex flex-col gap-1" : "flex flex-wrap gap-x-2")}>
          {names.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </span>
        <span className="md:hidden">{mobile ?? names.join(", ")}</span>
      </dd>
    </div>
  );
}

function CreditGroup({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("flex flex-col gap-3 max-md:gap-2", className)}>
      <h2 className="max-md:font-semibold max-md:text-fg-secondary">{title}</h2>
      {children}
    </section>
  );
}

/**
 * Figma About 페이지 (1807:15663) / 모바일 (2499:4632)
 * 좌측 43.75% 에 전시 개요, 우측에 주제 말씀 + 크레딧.
 * 모바일은 한 열 — 헤더 아래 28 에 제목 20 → 12 → 일정 14 → 36 → 말씀·소개 12/1.5 (사이 16)
 * → 44 → 크레딧 12 (묶음 사이 28, 줄 사이 8). 소개 글은 시안대로 홈 소개(HOME_INTRO)를 한 문단으로 쓴다.
 */
export default function AboutPage() {
  const [titleHead, titleTail] = SITE.fullTitle.split("한동대학교 ");

  return (
    <PageShell hideOnScroll headerHeight={84}>
      <div className="grid gap-y-16 pt-[118px] pb-75 max-md:gap-y-9 max-md:pt-7 max-md:pb-[86px] lg:grid-cols-[43.75%_1fr]">
        {/* ───── 좌측: 전시 개요 ───── */}
        <div className="px-margin lg:pr-0">
          <div className="max-w-[529px]">
            <h1 className="flex flex-col gap-1 max-md:gap-0">
              <span className="font-kr text-kr-h3 font-semibold max-md:text-kr-h4">
                {titleTail !== undefined ? (
                  <>
                    {titleHead}한동대학교
                    {/* 시안: 모바일은 '한동대학교' 뒤에서 줄을 바꾼다 */}
                    <br className="md:hidden" /> {titleTail}
                  </>
                ) : (
                  SITE.fullTitle
                )}
              </span>
              <span className="text-h3 uppercase max-md:text-h4">{SITE.title}</span>
            </h1>
            <div className="mt-4 font-kr text-kr-body-lg max-md:mt-3 max-md:text-kr-body-sm max-md:text-fg-secondary">
              <p>{SITE.period}</p>
              <p>{SITE.place}</p>
            </div>
          </div>
        </div>

        {/* ───── 우측: 주제 말씀 + 크레딧 ───── */}
        <div className="px-margin lg:pl-[10px]">
          <div className="flex max-w-[843px] flex-col gap-5 font-kr text-kr-body-lg max-md:gap-4 max-md:text-[12px] max-md:leading-[1.5] max-md:text-fg-secondary">
            <div>
              <p>{SITE.verse.ref}</p>
              {/* 모바일은 '채워주어,' 뒤에서 줄을 바꾼다 */}
              <p>
                {SITE.verse.text.split(", ").map((part, i, all) => (
                  <span key={part}>
                    {part}
                    {i < all.length - 1 && (
                      <>
                        ,<br className="md:hidden" />{" "}
                      </>
                    )}
                  </span>
                ))}
              </p>
            </div>
            <div className="max-md:hidden">
              {ABOUT_MESSAGE.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <p className="break-normal md:hidden">{HOME_INTRO.join(" ")}</p>
          </div>

          <dl className="mt-20 flex max-w-[942px] flex-col gap-10 text-body max-md:mt-11 max-md:gap-7 max-md:text-[12px] max-md:leading-[18px]">
            <CreditGroup title="주최" className="max-md:gap-1">
              <p className="font-kr">{HOST}</p>
            </CreditGroup>

            <CreditGroup title="졸업준비위원회">
              <div className="flex flex-col gap-4 font-kr max-md:gap-2 sm:flex-row sm:gap-4">
                <div className="flex w-[220px] shrink-0 flex-col gap-3 max-md:gap-2">
                  {COMMITTEE_LEADS.map((c) => (
                    <CreditRow key={c.role} role={c.role} names={c.names} />
                  ))}
                </div>
                <div className="flex flex-col gap-3 max-md:gap-2">
                  {COMMITTEE_TEAMS.map((c) => (
                    <CreditRow key={c.role} role={c.role} names={c.names} />
                  ))}
                </div>
              </div>
            </CreditGroup>

            <CreditGroup title="도움을 주신 분들">
              <div className="flex flex-col gap-8 font-kr max-md:gap-3 sm:flex-row sm:gap-[92px] max-md:[&_dd]:leading-5">
                {THANKS.map((t) => (
                  <CreditRow
                    key={t.role}
                    role={t.role}
                    names={t.names}
                    stacked
                    mobile={t.role === "후원사" ? <SponsorLogos /> : undefined}
                  />
                ))}
              </div>
              {/* 협력·후원 로고 — 원본 1367×173(@2x). 그룹 gap 12px + mt 20px = 이름 목록 아래 32px */}
              <Image
                src="/brand/logo1.png"
                alt="RixFont, 산돌구름, Yoondesign, YESOD, ADSLAND, hddn, 무림페이퍼, 콘텐츠융합디자인학부, 한동대학교"
                width={1367}
                height={173}
                className="mt-10 h-auto w-full max-w-[684px] max-md:hidden"
              />
            </CreditGroup>
          </dl>
        </div>
      </div>
    </PageShell>
  );
}
