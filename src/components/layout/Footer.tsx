import Link from "next/link";
import { NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/cn";
import ArrowUpRight from "@/components/icons/ArrowUpRight";

/** Figma Footer (1886:24239) — White / Black 두 변형, 높이 346px */
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
      {/* 마블링 서브비주얼. 파일이 아직 없으면 브랜드 그라디언트가 대신 보인다 */}
      <div className="pointer-events-none absolute inset-x-0 top-4 h-[537px] ">
        {/* <img
          src="/brand/footer-subvisual.webp"
          alt=""
          aria-hidden
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

      <ul className="absolute top-[21px] left-[81.25%] w-[163px] text-caption">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href || "#"}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:opacity-70"
            >
              {l.label}
              <ArrowUpRight className="size-5 shrink-0" />
            </a>
          </li>
        ))}
      </ul>
{/* 
      <p className="absolute right-margin bottom-6 font-kr text-[18px] leading-[1.2] font-medium tracking-[0.36px]">
        @ HGU CCD DEGREE 2026
      </p> */}

      <a href={`mailto:${SITE.contact.email}`} className="sr-only">
        {SITE.contact.email}
      </a>
    </footer>
  );
}
