"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { FieldKey } from "@/data/types";

type WorksFilter = {
  field: FieldKey | "all";
  setField: (f: FieldKey | "all") => void;
  q: string;
  setQ: (q: string) => void;
};

const Context = createContext<WorksFilter | null>(null);

/**
 * Works 의 분야 탭·검색 상태.
 * Figma 헤더(Default/Scroll)에서는 이 UI 가 헤더 안에 있고 결과 그리드는 본문에 있어서,
 * 둘이 상태를 공유하도록 PageShell 바깥에서 감싼다.
 */
export function WorksFilterProvider({ children }: { children: React.ReactNode }) {
  const [field, setField] = useState<FieldKey | "all">("all");
  const [q, setQ] = useState("");
  const value = useMemo(() => ({ field, setField, q, setQ }), [field, q]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

/** Provider 바깥(= 필터가 없는 페이지)에서는 null 을 돌려준다. */
export const useWorksFilter = () => useContext(Context);
