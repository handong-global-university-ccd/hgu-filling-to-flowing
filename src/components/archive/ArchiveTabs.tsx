import Link from "next/link";

export default function ArchiveTabs({ current }: { current: "behind" | "exhibition" }) {
  return (
    <nav aria-label="아카이브" className="flex gap-4 px-margin pb-4 text-body-sm">
      <Link
        href="/archive/"
        aria-current={current === "behind" ? "page" : undefined}
        className={current === "behind" ? "" : "text-fg-tertiary"}
      >
        Behind
      </Link>
      <Link
        href="/archive/exhibition/"
        aria-current={current === "exhibition" ? "page" : undefined}
        className={current === "exhibition" ? "" : "text-fg-tertiary"}
      >
        Exhibition View
      </Link>
    </nav>
  );
}
