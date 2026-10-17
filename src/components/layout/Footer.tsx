import Link from "next/link";
import { NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/cn";
import FooterMarble from "@/components/footer/FooterMarble";

/**
 * Figma Footer (2573:23106 Black / 2573:27019 White) — 1924×285, 웹은 290 고정, 모바일 260
 *
 * - 메뉴      : left 25, top 21, 폭 143, Body/Medium(16/26), 줄간격 없음
 * - 외부 링크 : left 81.25%-2, top 21, 폭 163, Body/Medium — INSTAGRAM · BEHANCE · (빈 줄) · 메일
 * - 학교 로고 : left 25, 150×24 (CCD + 한동대학교). Black 은 흰색, White 는 Figma #3C3C3C → fg-secondary
 * - 서브비주얼: 마블 인터랙션 — 푸터 아래로 잘려 나간다. 위치는 FooterMarble 참고
 *   위쪽은 물감이 넘쳐 흐를 수 있게 200px 열어 두고 양옆·아래만 자른다 (FooterMarble 의 overflow 래퍼)
 * 두 변형 모두 저작권 문구는 없다.
 */
export default function Footer({ inverse = true }: { inverse?: boolean }) {
  const links = [
    { label: "INSTAGRAM", href: SITE.contact.instagram },
    { label: "BEHANCE", href: SITE.contact.behance },
  ];

  return (
    <footer
      className={cn(
        "relative h-[260px] text-body md:h-[290px]",
        inverse ? "bg-bg-inverse text-fg-inverse" : "bg-bg text-fg",
      )}
    >
      <FooterMarble />

      <nav
        aria-label="푸터 메뉴"
        className="absolute top-[21px] left-[25px] z-10 w-[143px] max-md:left-margin"
      >
        <Link href="/" className="block hover:opacity-70">
          HOME
        </Link>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="block uppercase hover:opacity-70">
            {item.label}
          </Link>
        ))}
      </nav>

      {/* 모바일은 81.25% 지점이 화면 밖으로 넘쳐서 오른쪽 마진에 붙인다. 태블릿 폭에서도 화면 끝을 넘지 않게 max-w */}
      <ul className="absolute top-[21px] left-[calc(81.25%-2px)] z-10 w-[163px] max-w-[calc(18.75%+2px)] max-md:right-margin max-md:left-auto max-md:w-auto max-md:max-w-none">
        {links.map((l) => (
          <li key={l.label}>
            {/* 주소가 정해지기 전에는 글자만 둔다 */}
            {l.href ? (
              <a href={l.href} target="_blank" rel="noreferrer" className="hover:opacity-70">
                {l.label}
              </a>
            ) : (
              l.label
            )}
          </li>
        ))}
        <li className="mt-[26px]">
          <a href={`mailto:${SITE.contact.email}`} className="whitespace-nowrap hover:opacity-70">
            {SITE.contact.email}
          </a>
        </li>
      </ul>

      {/* 학교 로고 — 한 장의 흰색 SVG 를 마스크로 써서 글자색(토큰)을 그대로 칠한다 */}
      <span
        role="img"
        aria-label="한동대학교 콘텐츠융합디자인학부"
        className={cn(
          "absolute bottom-[30px] left-[25px] z-10 h-6 w-[151px] bg-current max-md:left-margin",
          "[mask:url(/brand/footer/ccd-hgu-logo.svg)_no-repeat_center/contain]",
          !inverse && "text-fg-secondary",
        )}
      />
    </footer>
  );
}
