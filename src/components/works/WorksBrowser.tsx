"use client";

import { useMemo } from "react";
import WorkCard from "./WorkCard";
import { useWorksFilter } from "./works-filter";
import type { Work } from "@/data/types";

type Item = { work: Work; designerNames: string };

/** 결과 그리드. 분야 탭·검색 UI 는 Figma 디자인대로 헤더에 있다 (Header.tsx) */
export default function WorksBrowser({ items }: { items: Item[] }) {
  const filter = useWorksFilter();
  const field = filter?.field ?? "all";
  const q = filter?.q ?? "";

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter(({ work, designerNames }) => {
      if (field !== "all" && work.field !== field) return false;
      if (!query) return true;
      return work.title.toLowerCase().includes(query) || designerNames.toLowerCase().includes(query);
    });
  }, [items, field, q]);

  return (
    <div className="px-margin pb-90">
      <ul className="grid grid-cols-2 gap-x-gutter gap-y-16 lg:grid-cols-4">
        {filtered.map(({ work, designerNames }) => (
          <li key={work.slug}>
            <WorkCard work={work} designerName={designerNames} />
          </li>
        ))}
      </ul>
      {filtered.length === 0 && <p className="py-20 text-center text-fg-tertiary">검색 결과가 없습니다.</p>}
    </div>
  );
}
