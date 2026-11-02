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
 * 데스크톱 후원사 로고 줄 (Figma 2670:13877) — 1920 기준 748×40.
 * 로고마다 시안의 상자(x·y·w·h, 줄 기준 px)에 원본 이미지를 crop(%) 그대로 얹는다.
 * 줄 전체를 % 로 잡아 두어서, 우측 칸이 748 보다 좁아지면 비율 그대로 줄어든다.
 */
const SPONSOR_ROW = { w: 748.13, h: 39.862 } as const;
const SPONSOR_LINE = [
  {
    src: "moorim",
    alt: "무림페이퍼",
    w: 4096,
    h: 2172,
    box: [0, 0.07, 85.546, 31.908],
    crop: [0, -21.08, 100, 142.17],
  },
  {
    src: "sandoll",
    alt: "산돌구름",
    w: 4096,
    h: 1185,
    box: [104.79, 0.14, 94.699, 31.908],
    crop: [0, 27.12, 100, 85.86],
  },
  {
    src: "adsland",
    alt: "ADSLAND",
    w: 2283,
    h: 1398,
    box: [226.34, 0.07, 97.815, 31.908],
    crop: [-6.84, -51.3, 113.67, 213.38],
  },
  {
    src: "yesod",
    alt: "YESOD",
    w: 3944,
    h: 2978,
    box: [357.01, 0.07, 72.466, 31.908],
    crop: [0, -15.75, 100, 171.48],
  },
  {
    src: "yoondesign",
    alt: "Yoondesign",
    w: 1334,
    h: 550,
    box: [464.88, 13.02, 99.262, 21.381],
    crop: [0, -45.71, 100, 191.41],
  },
  {
    src: "rixfont",
    alt: "RixFont",
    w: 3508,
    h: 2482,
    box: [596.87, 11.75, 62.083, 22.667],
    crop: [-68.67, -183.32, 237.33, 459.92],
  },
  {
    src: "hddn",
    alt: "hddn hidden figures inc.",
    w: 3544,
    h: 2363,
    box: [675.76, 16.15, 72.372, 20.27],
    crop: [0, -69.32, 100, 238.06],
  },
] as const;

const pctX = (px: number) => `${(px / SPONSOR_ROW.w) * 100}%`;
const pctY = (px: number) => `${(px / SPONSOR_ROW.h) * 100}%`;

function SponsorLine({ className }: { className?: string }) {
  return (
    <ul
      aria-label="후원사 로고"
      className={cn("relative w-full", className)}
      style={{ maxWidth: SPONSOR_ROW.w, aspectRatio: `${SPONSOR_ROW.w} / ${SPONSOR_ROW.h}` }}
    >
      {SPONSOR_LINE.map(({ src, alt, w, h, box: [x, y, bw, bh], crop: [cl, ct, cw, ch] }) => (
        <li
          key={src}
          className="absolute overflow-hidden"
          style={{ left: pctX(x), top: pctY(y), width: pctX(bw), height: pctY(bh) }}
        >
          <Image
            src={`/brand/sponsors/about/${src}.png`}
            alt={alt}
            width={w}
            height={h}
            className="absolute max-w-none"
            style={{ left: `${cl}%`, top: `${ct}%`, width: `${cw}%`, height: `${ch}%` }}
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * 라벨(회색, 88) + 이름들(쉼표로 이어 쓰기) 한 줄.
 * 데스크톱은 라벨과 이름 사이 4, 모바일(2499:4632)은 이름이 왼쪽에서 123 (사이 35, 줄높이 20).
 * mobile 을 주면 모바일에서는 이름 대신 그것을 보여준다 (후원사 로고)
 */
function CreditRow({
  role,
  names,
  mobile,
}: {
  role: string;
  names: readonly string[];
  mobile?: React.ReactNode;
}) {
  const text = names.join(", ");
  return (
    <div className="flex gap-1 max-md:gap-[35px]">
      <dt className="w-[88px] shrink-0 text-fg-tertiary">{role}</dt>
      <dd>
        {mobile ? (
          <>
            <span className="max-md:hidden">{text}</span>
            <span className="md:hidden">{mobile}</span>
          </>
        ) : (
          text
        )}
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
 * Figma About 페이지 (2358:18527) / 모바일 (2499:4632)
 * 좌측 56.25% 에 전시 개요 → 52 → 주제 말씀·소개, 우측에 크레딧(묶음 사이 32) + 후원사 로고 줄.
 * 제목과 크레딧은 화면 위에서 190 (헤더 84 + 106) 에서 같이 시작한다.
 * 모바일은 한 열 — 헤더 아래 28 에 제목 20 → 12 → 일정 14 → 36 → 말씀·소개 12/1.5 (사이 16)
 * → 44 → 크레딧 12 (묶음 사이 28, 줄 사이 8). 소개 글은 시안대로 홈 소개(HOME_INTRO)를 한 문단으로 쓴다.
 */
export default function AboutPage() {
  const [titleHead, titleTail] = SITE.fullTitle.split("한동대학교 ");

  return (
    // 후원사 로고 줄 끝 ~ 푸터 140 (데스크톱) — 화면보다 짧아도 늘리지 않는다
    <PageShell hideOnScroll headerHeight={84} fillScreen={false}>
      <div className="grid gap-y-16 pt-[106px] pb-[140px] max-md:gap-y-11 max-md:pt-7 max-md:pb-[86px] lg:grid-cols-[56.25%_1fr]">
        {/* ───── 좌측: 전시 개요 + 주제 말씀 ───── */}
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
              {/* 시안의 영문 제목 상자는 행간(32)보다 2 높은 34 */}
              <span className="text-h3 uppercase max-md:text-h4 md:h-[34px]">{SITE.title}</span>
            </h1>
            <div className="mt-4 font-kr text-kr-body-lg max-md:mt-3 max-md:text-kr-body-sm max-md:text-fg-secondary">
              <p>{SITE.period}</p>
              <p>{SITE.place}</p>
            </div>
          </div>

          <div className="mt-[52px] flex flex-col gap-3 font-kr text-kr-body-lg max-md:mt-9 max-md:gap-4 max-md:text-[12px] max-md:leading-[1.5] max-md:text-fg-secondary">
            <div>
              <p>{SITE.verse.ref}</p>
              {/* '채워주어,' 뒤에서 줄을 바꾼다 */}
              <p>
                {SITE.verse.text.split(", ").map((part, i, all) => (
                  <span key={part}>
                    {part}
                    {i < all.length - 1 && (
                      <>
                        ,<br />
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
        </div>

        {/* ───── 우측: 크레딧 ───── */}
        <div className="px-margin lg:pl-[6.55px]">
          <dl className="flex max-w-[834px] flex-col gap-8 text-body max-md:gap-7 max-md:text-[12px] max-md:leading-[18px]">
            <CreditGroup title="주최" className="max-md:gap-1">
              <p className="font-kr">{HOST}</p>
            </CreditGroup>

            <CreditGroup title="졸업준비위원회">
              <div className="flex flex-col gap-1 font-kr max-md:gap-2">
                {[...COMMITTEE_LEADS, ...COMMITTEE_TEAMS].map((c) => (
                  <CreditRow key={c.role} role={c.role} names={c.names} />
                ))}
              </div>
            </CreditGroup>

            <CreditGroup title="도움을 주신 분들">
              <div className="flex flex-col gap-2 font-kr max-md:gap-3 max-md:[&_dd]:leading-5">
                {THANKS.map((t) => (
                  <CreditRow
                    key={t.role}
                    role={t.role}
                    names={t.names}
                    mobile={t.role === "후원사" ? <SponsorLogos /> : undefined}
                  />
                ))}
              </div>
              {/* 이름 목록 아래 32 (그룹 gap 12 + 20). 시안상 로고 줄은 텍스트 칸보다 10 왼쪽에서 시작한다 */}
              <SponsorLine className="mt-5 -ml-[10.32px] max-md:hidden" />
            </CreditGroup>
          </dl>
        </div>
      </div>
    </PageShell>
  );
}
