import { cn } from "@/lib/cn";

export type Contact = { label: string; href?: string };

/**
 * 디자이너 Contact 한 줄 — 시트에 적힌 글자 그대로.
 * 시트에서 하이퍼링크가 걸린 글자(또는 주소)는 링크로, 링크가 없는 글자(@아이디 등)는 글자만.
 * 링크는 호버하면 밑줄. 메일은 같은 창, 나머지는 새 탭.
 */
export default function ContactLink({ contact: c, className }: { contact: Contact; className?: string }) {
  if (!c.href) return <span className={cn("break-all", className)}>{c.label}</span>;
  return (
    <a
      href={c.href}
      {...(c.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      className={cn("break-all hover:text-fg hover:underline", className)}
    >
      {c.label}
    </a>
  );
}
