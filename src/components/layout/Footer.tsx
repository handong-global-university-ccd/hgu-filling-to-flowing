import Link from "next/link";
import { NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/cn";
import ArrowUpRight from "@/components/icons/ArrowUpRight";
import FooterMarble from "@/components/footer/FooterMarble";

/**
 * Figma Footer (1886:24239 Black / 1900:14584 White) — 1920×346
 *
 * - 메뉴      : left 25, top 21, 폭 143, 줄간격 2, Caption(12/18)
 * - 외부 링크 : left 81.25%-2, top 21, 폭 163, 글자 바로 뒤에 20px 화살표
 * - 서브비주얼: 마블 인터랙션 (Footer 2378:5073) — 푸터 아래로 잘려 나간다. 위치는 FooterMarble 참고
 * - 높이: 1920 에서 346, 화면 폭에 비례해 줄되 최소 200 (모바일은 260)
 *   위쪽은 물감이 넘쳐 흐를 수 있게 200px 열어 두고 양옆·아래만 자른다 (FooterMarble 의 overflow 래퍼)
 * 두 변형 모두 저작권 문구는 없다.
 */
export default function Footer({ inverse = true }: { inverse?: boolean }) {
  const links = [
    { label: "INSTAGRAM", href: SITE.contact.instagram },
    { label: "CCD 홈페이지 예정", href: SITE.contact.ccd },
  ].filter((l) => l.label);

  return (
    <footer
      className={cn(
        "relative h-[260px] md:h-[max(calc(100vw*346/1920),200px)]",
        inverse ? "bg-bg-inverse text-fg-inverse" : "bg-bg text-fg",
      )}
    >
      <FooterMarble />

      <nav
        aria-label="푸터 메뉴"
        className="absolute top-[21px] left-[25px] z-10 w-[143px] space-y-[2px] text-caption max-md:left-margin"
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

      {/* 모바일은 81.25% 지점이 화면 밖으로 넘쳐서 오른쪽 마진에 붙인다 */}
      <ul className="absolute top-[21px] left-[calc(81.25%-2px)] z-10 w-[163px] text-caption max-md:right-margin max-md:left-auto max-md:w-auto">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href || "#"}
              target="_blank"
              rel="noreferrer"
              className="flex w-fit items-center hover:opacity-70"
            >
              {l.label}
              <ArrowUpRight className="size-5 shrink-0" />
            </a>
          </li>
        ))}
      </ul>

      <a href={`mailto:${SITE.contact.email}`} className="sr-only">
        {SITE.contact.email}
      </a>
    </footer>
  );
}
