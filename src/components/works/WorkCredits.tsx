import Link from "next/link";
import ArrowUpRight from "@/components/icons/ArrowUpRight";
import { cn } from "@/lib/cn";

export type CreditDesigner = { slug: string; nameKo: string };

/**
 * Figma Works 상세 좌측 하단 (2243:14758 개인 / 2243:14655 팀_2인 /
 * 2243:14656 팀_4인 / 2243:14657 팀_5인)
 *
 * - 전체 폭 336. 왼쪽에 팀 이름, 오른쪽에 참여자 이름이 오른쪽 끝에 맞춰 붙는다.
 * - 이름은 2열 그리드에 행 우선(좌→우, 위→아래)으로 채운다.
 *   열 피치 92(= 이름칸 84 + 간격 8), 행 피치 38(= 줄높이 26 + 간격 12).
 * - 개인 작품은 팀 이름이 없고 이름 한 개가 오른쪽 열 자리에 붙는다.
 * - 이름을 누르면 그 디자이너의 프로필 페이지로 간다.
 *
 * 모바일 (2499:4351): 팀 이름 없이 이름만 오른쪽 끝에, 글자 12.
 *   이름칸 67(= 화살표 위치 48 + 화살표 19) + 열 간격 26, 행 피치 38 은 같다.
 */
export default function WorkCredits({
  teamName,
  designers,
}: {
  teamName?: string;
  designers: CreditDesigner[];
}) {
  if (designers.length === 0) return null;
  const solo = designers.length === 1;

  return (
    <div className="flex w-[336px] max-w-full items-start justify-between gap-6 font-kr text-kr-body max-md:w-full max-md:text-[12px]">
      {/* 모바일 시안(2499:4351)은 팀 이름 없이 이름만 오른쪽에 붙인다 */}
      {!solo && teamName && <p className="shrink-0 whitespace-nowrap max-md:hidden">{teamName}</p>}
      {/* 열 간격 8 / 행 간격 12 (모바일 열 간격 26) */}
      <ul
        className={cn(
          "ml-auto grid shrink-0 gap-x-2 gap-y-3 max-md:gap-x-[26px]",
          solo ? "grid-cols-1" : "grid-cols-2",
        )}
      >
        {designers.map((d) => (
          <li key={d.slug} className="w-[84px] max-md:w-[67px]">
            <Link
              href={`/designers/${d.slug}/`}
              className="flex items-center transition-colors hover:text-fg-tertiary"
            >
              {/* Figma: 화살표는 이름칸 48px 지점에 고정 — 짧은 이름도 화살표 열이 맞는다 */}
              <span className="min-w-12 whitespace-nowrap">{d.nameKo}</span>
              <ArrowUpRight className="size-[19px] shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
