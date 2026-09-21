"use client";

import { useMemo, useState } from "react";
import WorkCard from "./WorkCard";
import { FIELDS, type FieldKey, type Work } from "@/data/types";
import { cn } from "@/lib/cn";

type Item = { work: Work; designerNames: string };

/** 탭 필터(기본 All) + 검색(타이틀·디자이너명) */
export default function WorksBrowser({ items }: { items: Item[] }) {
  const [field, setField] = useState<FieldKey | "all">("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter(({ work, designerNames }) => {
      if (field !== "all" && work.field !== field) return false;
      if (!query) return true;
      return work.title.toLowerCase().includes(query) || designerNames.toLowerCase().includes(query);
    });
  }, [items, field, q]);

  const tabs = [{ key: "all" as const, label: "All" }, ...FIELDS];

  return (
    <div className="px-margin">
      <div className="mb-6 flex items-end justify-between gap-6">
        <div role="tablist" aria-label="분야" className="flex flex-wrap gap-4 text-body-sm">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={field === t.key}
              onClick={() => setField(t.key)}
              className={cn(field === t.key ? "text-fg" : "text-fg-tertiary hover:text-fg-secondary")}
            >
              {t.label}
            </button>
          ))}
        </div>
        <label className="w-full max-w-[340px] border-b border-border">
          <span className="sr-only">프로젝트 또는 디자이너 검색</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent py-1 text-body-sm outline-none placeholder:text-fg-tertiary"
          />
        </label>
      </div>

      <ul className="grid grid-cols-2 gap-x-gutter gap-y-10 lg:grid-cols-4">
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
