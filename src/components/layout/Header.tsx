"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { NAV } from "@/lib/site";
import { cn } from "@/lib/cn";
import Logo from "./Logo";

/**
 * Figma: 헤더 컴포넌트 (default 176px / scroll 74px)
 * - 아래로 스크롤 → scroll 상태(축소)
 * - 최상단 도달 또는 헤더 호버 → default 상태(확장)
 */
export default function Header({ inverse = false }: { inverse?: boolean }) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [atTop, setAtTop] = useState(true);
  const [hovered, setHovered] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setAtTop(y < 40));

  const expanded = atTop || hovered;

  return (
    <motion.header
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      initial={false}
      animate={{ height: expanded ? 176 : 74 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex items-start justify-between px-margin pt-6",
        inverse ? "bg-bg-inverse text-fg-inverse" : "bg-bg text-fg",
      )}
    >
      <Link href="/" aria-label="홈으로">
        <motion.div
          initial={false}
          animate={{ scale: expanded ? 1 : 0.6 }}
          style={{ originX: 0, originY: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Logo className="text-[32px]" />
        </motion.div>
      </Link>

      <nav aria-label="주요 메뉴">
        <ul className="flex gap-12 text-body-sm">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "transition-opacity hover:opacity-100",
                    active ? "opacity-100" : "opacity-70",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.header>
  );
}
