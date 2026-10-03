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
 */
const NAME_W = 84;
const COL_GAP = 8;
const ROW_GAP = 12;

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
    <div className="flex w-[336px] max-w-full items-start justify-between gap-6 font-kr text-kr-body">
      {!solo && teamName && <p className="shrink-0 whitespace-nowrap">{teamName}</p>}
      <ul
        className={cn("ml-auto grid shrink-0", solo ? "grid-cols-1" : "grid-cols-2")}
        style={{ columnGap: COL_GAP, rowGap: ROW_GAP }}
      >
        {designers.map((d) => (
          <li key={d.slug} style={{ width: NAME_W }}>
            <Link
              href={`/designers/${d.slug}/`}
              className="flex items-center transition-colors hover:text-fg-tertiary"
            >
              <span className="whitespace-nowrap">{d.nameKo}</span>
              <ArrowUpRight className="size-[19px] shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
