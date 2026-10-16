import type { Metadata } from "next";
import Image from "next/image";
import PageShell from "@/components/layout/PageShell";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/cn";
import { ABOUT_MESSAGE, COMMITTEE_LEADS, COMMITTEE_TEAMS, HOST, THANKS } from "@/data/about";

export const metadata: Metadata = { title: "About" };

/**
 * 모바일 후원사 로고 (Figma 2499:4719) — 3개씩 두 줄.
 * 원본은 public/brand/logo1.png 에서 로고별로 잘라 둔 public/brand/sponsors/*.png.
 * 위치·크기는 시안(390 폭)에서 잰 값 — left/top 은 마진 안쪽 기준, h 는 보이는 높이.
 */
const SPONSOR_LOGOS = [
  { src: "/brand/sponsors/moorim.png", alt: "무림페이퍼", w: 194, h: 75, left: 16, top: 1, height: 24 },
  { src: "/brand/sponsors/sandoll.png", alt: "산돌구름", w: 286, h: 49, left: 96, top: 13, height: 12 },
  { src: "/brand/sponsors/adsland.png", alt: "ADSLAND", w: 256, h: 63, left: 197, top: 5, height: 20 },
  { src: "/brand/sponsors/yesod.png", alt: "YESOD", w: 235, h: 44, left: 13, top: 58, height: 11 },
  {
    src: "/brand/sponsors/hddn.png",
    alt: "hddn hidden figures inc.",
    w: 131,
    h: 69,
    left: 105,
    top: 58,
    height: 18,
  },
  { src: "/brand/sponsors/rixfont.png", alt: "RixFont", w: 197, h: 47, left: 169, top: 58, height: 11.7 },
] as const;

/**
 * 라벨(회색) + 이름들 한 줄
 * - 데스크톱: 라벨 86, 이름은 칸마다 띄어 쓰거나(stacked) 세로로 쌓는다
 * - 모바일(2499:4632): 라벨 88 + 4, 이름은 쉼표로 이어 쓰고 넘치면 줄바꿈
 */
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
    <div className="flex gap-4 max-md:gap-1">
      <dt className="w-[86px] shrink-0 text-fg-tertiary max-md:w-[88px]">{role}</dt>
      <dd>
        <span className={cn("max-md:hidden", stacked ? "flex flex-col gap-1" : "flex flex-wrap gap-x-2")}>
          {names.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </span>
        <span className="md:hidden">{names.join(", ")}</span>
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
    <section className="flex flex-col gap-3 max-md:gap-2">
      <h2 className={cn("max-md:font-medium", className)}>{title}</h2>
      {children}
    </section>
  );
}

/**
 * Figma About 페이지 (1807:15663) / 모바일 (2499:4632)
 * 좌측 43.75% 에 전시 개요, 우측에 주제 말씀 + 크레딧.
 * 모바일은 한 열 — 제목 20, 일정 14, 본문·크레딧 12 (줄높이 18).
 */
export default function AboutPage() {
  const [titleHead, titleTail] = SITE.fullTitle.split("한동대학교 ");

  return (
    <PageShell hideOnScroll headerHeight={84}>
      <div className="grid gap-y-16 pt-[118px] pb-90 max-md:gap-y-10 max-md:pt-3 lg:grid-cols-[43.75%_1fr]">
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
            <div className="mt-4 font-kr text-kr-body-lg max-md:mt-3.5 max-md:text-kr-body-sm">
              <p>{SITE.period}</p>
              <p>{SITE.place}</p>
            </div>
          </div>
        </div>

        {/* ───── 우측: 주제 말씀 + 크레딧 ───── */}
        <div className="px-margin lg:pl-[10px]">
          <div className="flex max-w-[843px] flex-col gap-5 font-kr text-kr-body-lg max-md:gap-4 max-md:text-[12px] max-md:leading-[18px]">
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

          <dl className="mt-20 flex max-w-[942px] flex-col gap-10 text-body max-md:mt-6 max-md:text-[12px] max-md:leading-[18px]">
            <CreditGroup title="주최">
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

            <CreditGroup title="도움을 주신 분들" className="max-md:font-semibold">
              <div className="flex flex-col gap-8 font-kr max-md:gap-2 sm:flex-row sm:gap-[92px]">
                {THANKS.map((t) => (
                  <CreditRow key={t.role} role={t.role} names={t.names} stacked />
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
              {/* 모바일: 후원사 6곳만 3개씩 두 줄 (gap 8 + mt 32 = 이름 목록 아래 40) */}
              <ul className="relative mt-8 h-[76px] w-[292px] md:hidden" aria-label="후원사">
                {SPONSOR_LOGOS.map((l) => (
                  <li key={l.src} className="absolute" style={{ left: l.left - 16, top: l.top }}>
                    <Image
                      src={l.src}
                      alt={l.alt}
                      width={l.w}
                      height={l.h}
                      className="w-auto max-w-none"
                      style={{ height: l.height }}
                    />
                  </li>
                ))}
              </ul>
            </CreditGroup>
          </dl>
        </div>
      </div>
    </PageShell>
  );
}
