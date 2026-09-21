import Link from "next/link";
import { NAV, SITE } from "@/lib/site";

// TODO: Figma Footer(1871:3934) 하단 마블링 서브비주얼 영상/이미지 배치
export default function Footer() {
  return (
    <footer className="relative mt-40 flex min-h-[346px] justify-between bg-bg-inverse px-margin py-8 text-caption text-fg-inverse">
      <ul className="space-y-1 uppercase">
        <li>
          <Link href="/">Home</Link>
        </li>
        {NAV.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
      <ul className="space-y-1 text-right uppercase">
        {SITE.contact.instagram && (
          <li>
            <a href={SITE.contact.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </li>
        )}
        {SITE.contact.behance && (
          <li>
            <a href={SITE.contact.behance} target="_blank" rel="noreferrer">
              Behance
            </a>
          </li>
        )}
        <li className="pt-4">
          <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>
        </li>
      </ul>
    </footer>
  );
}
