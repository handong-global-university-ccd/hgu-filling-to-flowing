"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FIELDS, MAJORS, type FilterKey } from "@/data/types";

type WorksFilter = {
  /** Works 는 분야(FieldKey), Designers 는 전공(MajorKey) 탭 */
  field: FilterKey;
  setField: (f: FilterKey) => void;
  /** Works 왼쪽 칸에서 고른 전시 (data/projects.ts). null 이면 분야의 첫 전시 */
  project: string | null;
  setProject: (key: string | null) => void;
  q: string;
  setQ: (q: string) => void;
  /** 지금 분야·전시를 담은 주소 뒷부분 ("?field=…" 또는 ""). 상세로 가는 링크에 붙인다 */
  query: string;
};

const Context = createContext<WorksFilter | null>(null);

const isFilterKey = (v: string | null): v is Exclude<FilterKey, "all"> =>
  [...FIELDS, ...MAJORS].some((f) => f.key === v);

/** 분야·전시 → "?field=communication&project=local-innovation" */
export function filterQuery(field: FilterKey, project: string | null) {
  const params = new URLSearchParams();
  if (field !== "all") params.set("field", field);
  if (field !== "all" && project) params.set("project", project);
  const s = params.toString();
  return s ? `?${s}` : "";
}

/**
 * Works·Designers 의 분야 탭·검색 상태.
 * Figma 헤더(Default/Scroll)에서는 이 UI 가 헤더 안에 있고 결과는 본문에 있어서,
 * 둘이 상태를 공유하도록 PageShell 바깥에서 감싼다.
 *
 * 분야·전시는 주소(?field=…&project=…)에도 적는다 — 상세에 갔다가 뒤로 오면 고른 분야가 그대로 남고,
 * 주소를 공유해도 같은 화면이 열린다. 검색어는 주소에 남기지 않는다.
 * 페이지를 새로 그리지 않도록 router 대신 history.replaceState 로 바꾼다 (Next 가 주소 변경을 따라온다).
 */
export function WorksFilterProvider({ children }: { children: React.ReactNode }) {
  const [field, setFieldState] = useState<FilterKey>("all");
  const [project, setProject] = useState<string | null>(null);
  const [q, setQ] = useState("");
  // 주소를 읽기 전에는 쓰지 않는다 — 안 그러면 첫 렌더의 All 이 주소의 ?field 를 지운다
  const [ready, setReady] = useState(false);

  // 처음 열릴 때 주소에서 읽는다 (정적 export 라 서버에서는 주소 뒷부분을 모른다)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const f = params.get("field");
    /* eslint-disable react-hooks/set-state-in-effect */
    if (isFilterKey(f)) {
      setFieldState(f);
      setProject(params.get("project"));
    }
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // 바뀌면 주소에 적는다 — 경로는 그대로 두고 뒷부분만
  useEffect(() => {
    if (!ready) return;
    const next = `${window.location.pathname}${filterQuery(field, project)}`;
    if (next !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(window.history.state, "", next);
    }
  }, [ready, field, project]);

  // 분야를 바꾸면 그 분야의 첫 전시부터 보여준다
  const setField = useCallback((f: FilterKey) => {
    setFieldState(f);
    setProject(null);
  }, []);

  const value = useMemo(
    () => ({ field, setField, project, setProject, q, setQ, query: filterQuery(field, project) }),
    [field, setField, project, q],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

/** Provider 바깥(= 필터가 없는 페이지)에서는 null 을 돌려준다. */
export const useWorksFilter = () => useContext(Context);
