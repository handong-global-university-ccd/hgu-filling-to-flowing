"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { FieldKey } from "@/data/types";

type WorksFilter = {
  field: FieldKey | "all";
  setField: (f: FieldKey | "all") => void;
  /** Works 왼쪽 칸에서 고른 전시 (data/projects.ts). null 이면 분야의 첫 전시 */
  project: string | null;
  setProject: (key: string | null) => void;
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
  const [field, setFieldState] = useState<FieldKey | "all">("all");
  const [project, setProject] = useState<string | null>(null);
  const [q, setQ] = useState("");

  // 분야를 바꾸면 그 분야의 첫 전시부터 보여준다
  const setField = useCallback((f: FieldKey | "all") => {
    setFieldState(f);
    setProject(null);
  }, []);

  const value = useMemo(
    () => ({ field, setField, project, setProject, q, setQ }),
    [field, setField, project, q],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

/** Provider 바깥(= 필터가 없는 페이지)에서는 null 을 돌려준다. */
export const useWorksFilter = () => useContext(Context);
