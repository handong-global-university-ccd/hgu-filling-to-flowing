import Link from "next/link";
import { NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/cn";
import ArrowUpRight from "@/components/icons/ArrowUpRight";

/**
 * Figma Footer (1886:24239 Black / 1900:14584 White) — 1920×346
 *
 * - 메뉴      : left 25, top 21, 폭 143, 줄간격 2, Caption(12/18)
 * - 외부 링크 : left 81.25%-2, top 21, 폭 163, 글자 바로 뒤에 20px 화살표
 * - 서브비주얼: left 0, top 16, 2034×537 — 푸터 아래로 잘려 나간다
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
        "relative h-[346px] overflow-hidden",
        inverse ? "bg-bg-inverse text-fg-inverse" : "bg-bg text-fg",
      )}
    >
      {/* 마블링 서브비주얼 — Figma 에서 2034×537 로 미리 회전해 내보낸 뒤 주석 해제 */}
      <div className="pointer-events-none absolute top-4 left-0 h-[537px] w-[2034px] max-w-none">
        {/* <Image
          src={asset("/brand/footer-subvisual.webp")}
          alt=""
          aria-hidden
          width={2034}
          height={537}
          className="size-full object-cover object-bottom"
        /> */}
      </div>

      <nav
        aria-label="푸터 메뉴"
        className="absolute top-[21px] left-[25px] w-[143px] space-y-[2px] text-caption"
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

      <ul className="absolute top-[21px] left-[calc(81.25%-2px)] w-[163px] text-caption">
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
