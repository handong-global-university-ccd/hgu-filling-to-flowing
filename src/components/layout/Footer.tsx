import Link from "next/link";
import { NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/cn";
import FooterMarble from "@/components/footer/FooterMarble";
import ArrowUpRight from "@/components/icons/ArrowUpRight";

/**
 * Figma Footer (2573:23106 Black / 2573:27019 White) — 1924×285, 웹 285 고정, 모바일 260
 *
 * - 메뉴      : left 25, top 21, 폭 143, Body/Medium(16/26), 줄간격 없음
 * - 외부 링크 : left 81.25%-2, top 21, 폭 163, Body/Medium — Instagram · CCD Web (2573:23213)
 * - 학교 로고 : 외부 링크와 같은 열(오른쪽), 아래 30, 150×24 (CCD + 한동대학교). Black 은 흰색, White 는 Figma #3C3C3C → fg-secondary
 * - 링크 호버 : 글자 아래 밑줄 (페이지 이동·외부 링크 모두)
 * - 서브비주얼: 마블 인터랙션 — 푸터 아래로 잘려 나간다. 위치는 FooterMarble 참고
 *   위쪽은 물감이 넘쳐 흐를 수 있게 200px 열어 두고 양옆·아래만 자른다 (FooterMarble 의 overflow 래퍼)
 * 두 변형 모두 저작권 문구는 없다.
 *
 * 모바일 (2593:5330 · 2625:6005) — 390×120
 * - 메뉴      : left 17, top 11, Plus Jakarta 8/14
 * - 외부 링크 : left 264, top 11, 8/14 — INSTAGRAM ↗ · CCD 홈페이지 예정 ↗ (화살표 12, 글자 바로 뒤). 메일·BEHANCE 는 없다
 * - 학교 로고 : 오른쪽 16, 아래 10, 75×12
 * - 마블      : FooterMarble 참고
 */
export default function Footer({ inverse = true }: { inverse?: boolean }) {
  // 주소가 비어 있으면(준비 중) 링크 없이 글자만 보여 준다
  const links: { label: string; href: string }[] = [
    { label: "Instagram", href: SITE.contact.instagram },
    { label: "CCD Web", href: SITE.contact.ccd },
  ];

  return (
    <footer
      className={cn(
        // 모바일 8/14 · 데스크톱 Body/Medium 16/26 — leading-[14px] 이 text-body 의 행간까지 덮으므로 md 에서 다시 26
        "relative h-[120px] text-[8px] leading-[14px] md:h-[285px] md:text-body md:leading-[26px]",
        inverse ? "bg-bg-inverse text-fg-inverse" : "bg-bg text-fg",
      )}
    >
      <FooterMarble />

      <nav
        aria-label="푸터 메뉴"
        className="absolute top-[21px] left-[25px] z-10 w-[143px] max-md:top-[11px] max-md:left-[17px]"
      >
        <Link href="/" className="block w-fit underline-offset-4 hover:underline">
          HOME
        </Link>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block w-fit uppercase underline-offset-4 hover:underline"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* 태블릿 폭에서도 화면 끝을 넘지 않게 max-w */}
      <ul className="absolute top-[21px] left-[calc(81.25%-2px)] z-10 w-[163px] max-w-[calc(18.75%+2px)] max-md:hidden">
        {links.map((l) => (
          <li key={l.label}>
            {/* 주소가 정해지기 전에는 글자만 둔다 */}
            {l.href ? (
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {l.label}
              </a>
            ) : (
              l.label
            )}
          </li>
        ))}
      </ul>

      {/* 모바일 외부 링크 (2593:5340) — INSTAGRAM · CCD WEB(Figma 에선 "CCD 홈페이지 예정" — 학부 사이트가 열려 바꿈), 글자 뒤에 ↗ */}
      <ul className="absolute top-[11px] left-[calc(264/390*100%)] z-10 md:hidden">
        {(
          [
            { label: "INSTAGRAM", href: SITE.contact.instagram },
            { label: "CCD WEB", href: SITE.contact.ccd },
          ] as { label: string; href: string }[]
        ).map((l) => (
          <li key={l.label}>
            {l.href ? (
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 underline-offset-2 hover:underline"
              >
                {l.label}
                <ArrowUpRight className="size-3 shrink-0" />
              </a>
            ) : (
              <span className="flex items-center gap-1 font-kr">
                {l.label}
                <ArrowUpRight className="size-3 shrink-0" />
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* 학교 로고 — 한 장의 흰색 SVG 를 마스크로 써서 글자색(토큰)을 그대로 칠한다 */}
      <span
        role="img"
        aria-label="한동대학교 콘텐츠융합디자인학부"
        className={cn(
          // Figma Footer=Black(2573:23106): 외부 링크 열과 같은 x(1561), 아래 30
          "absolute bottom-[30px] left-[calc(81.25%-2px)] z-10 h-6 w-[151px] bg-current max-md:right-4 max-md:bottom-[10px] max-md:left-auto max-md:h-3 max-md:w-[75px]",
          "[mask:url(/brand/footer/ccd-hgu-logo.svg)_no-repeat_center/contain]",
          !inverse && "text-fg-secondary",
        )}
      />
    </footer>
  );
}
