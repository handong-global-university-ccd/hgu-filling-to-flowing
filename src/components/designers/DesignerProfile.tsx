"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import ArrowUpRight from "@/components/icons/ArrowUpRight";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

export type ProfileWork = { slug: string; title: string };
export type ProfileDesigner = {
  slug: string;
  nameKo: string;
  nameEn: string;
  disciplines: string;
  contacts: string[];
  profile: string;
  profileMono?: string;
  works: ProfileWork[];
};

/** Figma 디자이너 상세 (1807:15093 / 1807:15124 / 1807:15169) */
const HEADER = 74;
const ITEM_W = 80;
const ITEM_H = 120;
const RAIL_GAP = 36;
const PITCH = ITEM_H + RAIL_GAP; // 156
const RAIL_X = 24;
const MARKER = 6;
const MARKER_GAP = 16;

/**
 * 인터렉션 설명 (1841:11720)
 * - Click  : 좌측 흑백 이미지를 누르면 우측 프로필 정보·이미지가 그 디자이너로 바뀐다
 * - 사각형(■) : 설정된 위치에 고정 — 움직이는 건 리스트 쪽이다
 * - Scroll : 스크롤하면 리스트 순서대로 다음 디자이너로 전환된다
 * - Work   : 작품을 누르면 작품 상세로 간다
 *
 * 스크롤 한 칸(156px)이 디자이너 한 명이다. 화면은 sticky 로 고정하고
 * 그 아래 (n-1)×156px 만큼 길이를 줘서, 다 넘기면 푸터가 나온다.
 */
export default function DesignerProfile({
  designers,
  initialIndex,
}: {
  designers: ProfileDesigner[];
  initialIndex: number;
}) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(initialIndex * PITCH);
  const [stageH, setStageH] = useState(0);

  const span = (designers.length - 1) * PITCH;
  const active = Math.min(designers.length - 1, Math.max(0, Math.round(progress / PITCH)));
  const d = designers[active];

  // 들어오자마자 해당 디자이너가 보이도록 스크롤 위치를 맞춘다
  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, (section.current?.offsetTop ?? 0) + initialIndex * PITCH);
  }, [initialIndex]);

  useEffect(() => {
    const measure = () => setStageH(stage.current?.clientHeight ?? 0);
    const read = () => {
      const top = section.current?.offsetTop ?? 0;
      setProgress(Math.min(span, Math.max(0, window.scrollY - top)));
    };
    measure();
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", measure);
    };
  }, [span]);

  // 주소만 바꾼다 — 페이지를 다시 그리지 않고 공유·새로고침만 맞춰준다
  useEffect(() => {
    history.replaceState(null, "", `/designers/${d.slug}/`);
  }, [d.slug]);

  const goTo = useCallback(
    (i: number) => {
      const top = (section.current?.offsetTop ?? 0) + i * PITCH;
      window.scrollTo({ top, behavior: "smooth" });
    },
    [],
  );

  const markerTop = stageH / 2 - ITEM_H / 2;

  return (
    <section ref={section} className="relative" style={{ height: `calc(100svh - ${HEADER}px + ${span}px)` }}>
      <div
        ref={stage}
        className="sticky overflow-hidden"
        style={{ top: HEADER, height: `calc(100svh - ${HEADER}px)` }}
      >
        {/* 좌측 리스트 — 흑백. 움직이는 건 리스트, ■ 는 제자리 */}
        <div
          aria-hidden
          className="absolute bg-fg"
          style={{ left: RAIL_X, top: `calc(50% - ${MARKER / 2}px)`, width: MARKER, height: MARKER }}
        />
        <ul className="absolute inset-y-0 left-0 w-[102px] list-none">
          {designers.map((o, i) => (
            <li
              key={o.slug}
              className="absolute transition-transform duration-300 ease-out"
              style={{
                left: RAIL_X,
                top: markerTop + i * PITCH - progress,
                width: ITEM_W,
                height: ITEM_H,
                transform: i === active ? `translateX(${MARKER + MARKER_GAP}px)` : undefined,
              }}
            >
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === active ? "true" : undefined}
                aria-label={`${o.nameKo} 프로필 보기`}
                className="block size-full"
              >
                <Image
                  src={asset(o.profileMono ?? o.profile)}
                  alt=""
                  width={ITEM_W}
                  height={ITEM_H}
                  className="size-full object-cover grayscale"
                />
              </button>
            </li>
          ))}
        </ul>

        {/* 우측 정보 — 좌측 리스트는 흑백, 이 프로필 사진만 컬러 (화면설명 1837:11750) */}
        <motion.div
          key={d.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute flex w-[338px] flex-col gap-10 py-8"
            style={{ left: "calc(56.25% + 6px)", top: 48 }}
          >
            <div className="flex flex-col gap-[2px]">
              <p className="font-kr text-kr-body-lg">{d.nameKo}</p>
              <p className="text-body-lg text-fg-secondary">{d.nameEn}</p>
            </div>

            <div className="flex flex-col gap-6 text-body">
              <div className="flex w-[210px] flex-col gap-[2px]">
                <p>Disciplines</p>
                <p className="text-fg-secondary">{d.disciplines}</p>
              </div>

              {d.contacts.length > 0 && (
                <div className="flex flex-col gap-[2px]">
                  <p>Contact</p>
                  <div className="flex flex-col text-fg-secondary">
                    {d.contacts.map((c) => (
                      <a
                        key={c}
                        href={c.includes("@") ? `mailto:${c}` : `https://${c.replace(/^https?:\/\//, "")}`}
                        className="w-fit hover:text-fg"
                      >
                        {c}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-[2px]">
                <p>Work</p>
                <ul className="w-[308px]">
                  {d.works.map((w) => (
                    <li key={w.slug}>
                      <Link
                        href={`/works/${w.slug}/`}
                        className="flex items-start font-kr text-kr-body text-fg-secondary hover:text-fg"
                      >
                        <span>{w.title}</span>
                        <ArrowUpRight className="size-6 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div
            className="absolute h-[452px] w-[338px]"
            style={{ left: "calc(81.25% - 2px)", top: 48 }}
          >
            <Image
              src={asset(d.profile)}
              alt={`${d.nameKo} 프로필 사진`}
              width={338}
              height={452}
              className={cn("size-full object-cover")}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
