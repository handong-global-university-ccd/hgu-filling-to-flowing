"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import WorkCard from "./WorkCard";
import { useWorksFilter } from "./works-filter";
import { FIELDS, type Work } from "@/data/types";
import { getProjects, inProject } from "@/data/projects";
import { cn } from "@/lib/cn";

type Item = { work: Work; designerNames: string };

/**
 * Works 본문 — Figma Works (2564:9040 AX/팀 · 2564:9184 AX/개인 · 2564:8888·8203 커뮤니케이션 ·
 * 2564:9368 서비스 · 2564:8431·8583 UX · 2561:5623 공간 · 2573:25419·25523 스크롤)
 *
 * - 분야 탭·검색은 헤더 둘째 줄에 있다 (Header.tsx)
 * - 왼쪽 3칸 : 분야 안의 전시 목록. 고른 항목만 검정 + 6px 사각 점, 나머지 Neutral/300.
 *              스크롤해도 제자리에 남는다 — 헤더가 Scroll(74px) 로 접히면 그 아래 48px(top 122)에 붙는다
 * - 오른쪽 9칸 : 전시 제목(Body/Large) · 지도교수 · 소개글(16/1.7, 문단 사이 8) → 48 아래 작품 3열 (가로 16, 세로 64)
 * - All 은 소개글 없이 전체 작품. 왼쪽 칸은 분야 목록이 되어 누르면 그 분야로 간다
 */
export default function WorksBrowser({ items }: { items: Item[] }) {
  const filter = useWorksFilter();
  const reduce = useReducedMotion();
  const field = filter?.field ?? "all";
  const q = filter?.q ?? "";

  const projects = useMemo(() => (field === "all" ? [] : getProjects(field)), [field]);
  const project = projects.find((p) => p.key === filter?.project) ?? projects[0];

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter(({ work, designerNames }) => {
      if (project && !inProject(work, project)) return false;
      if (!query) return true;
      return (
        (work.cardTitle ?? work.title).toLowerCase().includes(query) ||
        designerNames.toLowerCase().includes(query)
      );
    });
  }, [items, project, q]);

  // 다른 분야·전시로 바꾸면 소개글부터 다시 보이게 맨 위로
  const scope = project?.key ?? field;
  const firstScope = useRef(scope);
  useEffect(() => {
    if (scope === firstScope.current) return;
    firstScope.current = scope;
    if (window.scrollY > 0) window.scrollTo({ top: 0 });
  }, [scope]);

  const nav =
    field === "all"
      ? FIELDS.map((f) => ({
          key: f.key,
          label: f.label,
          active: false,
          select: () => filter?.setField(f.key),
        }))
      : projects.map((p) => ({
          key: p.key,
          label: p.label,
          active: p.key === project?.key,
          select: () => filter?.setProject(p.key),
        }));

  return (
    <div className="pb-90 max-lg:px-margin lg:page-grid lg:pt-[49px]">
      {/* 왼쪽 칸 — 모바일은 위쪽에 가로로 */}
      <nav
        aria-label={field === "all" ? "분야" : "전시"}
        className="self-start max-lg:pt-4 lg:sticky lg:top-[122px] lg:col-span-3 lg:pl-1"
      >
        <ul className="flex text-body max-lg:flex-wrap max-lg:gap-x-4 lg:flex-col">
          {nav.map((n) => (
            <li key={n.key}>
              <button
                type="button"
                onClick={n.select}
                aria-current={n.active ? "true" : undefined}
                className={cn(
                  "flex items-center gap-[11px] text-left transition-colors",
                  n.active ? "text-fg" : "text-neutral-300 hover:text-fg-secondary",
                )}
              >
                {n.active && <span aria-hidden className="size-1.5 shrink-0 bg-current" />}
                {n.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <motion.div
        key={scope}
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-lg:mt-8 lg:col-span-9"
      >
        {project && (
          <header className="mb-12 font-kr text-fg-secondary">
            {project.title && <h1 className="text-body-lg">{project.title}</h1>}
            <p className="mt-1 text-kr-body leading-[1.7]">지도교수 | {project.advisor}</p>
            {project.intro.length > 0 && (
              <div className="mt-6 flex max-w-[1046px] flex-col gap-2 text-kr-body leading-[1.7] break-keep lg:whitespace-pre-line">
                {project.intro.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
            )}
          </header>
        )}

        <ul className="grid grid-cols-2 gap-x-gutter gap-y-8 md:gap-y-16 lg:grid-cols-3">
          {filtered.map(({ work, designerNames }) => (
            <li key={work.slug}>
              <WorkCard work={work} designerName={designerNames} />
            </li>
          ))}
        </ul>
        {filtered.length === 0 && (
          <p className="py-20 text-center text-fg-tertiary">
            {q.trim() ? "검색 결과가 없습니다." : "작품을 준비하고 있습니다."}
          </p>
        )}
      </motion.div>
    </div>
  );
}
