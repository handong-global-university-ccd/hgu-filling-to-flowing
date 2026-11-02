"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

/**
 * "검색 결과가 없습니다." 같은 빈 결과 문구 — 화면 전체의 가로·세로 가운데에 띄운다.
 * 부모에 transform(등장 모션)이 걸려 있으면 fixed 가 그 부모 기준이 되므로 body 로 포털한다.
 * 헤더(z-50) 아래에 깔리고, 클릭은 통과시킨다.
 */
export default function EmptyResult({
  children,
  className,
}: {
  children: React.ReactNode;
  /** 데스크톱·모바일 중 한쪽에만 띄울 때 (max-md:hidden 등) */
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <p
      role="status"
      className={cn(
        "pointer-events-none fixed inset-0 z-40 grid place-items-center px-margin text-center font-kr text-body text-fg-tertiary",
        className,
      )}
    >
      {children}
    </p>,
    document.body,
  );
}
