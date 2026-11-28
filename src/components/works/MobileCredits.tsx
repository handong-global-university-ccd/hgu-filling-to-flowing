import Image from "next/image";
import Link from "next/link";
import ArrowUpRight from "@/components/icons/ArrowUpRight";
import { asset } from "@/lib/asset";
import type { CreditDesigner } from "./WorkCredits";

/**
 * 모바일 작품 상세의 사진 + 참여자 (2563:7046 팀 / 2573:20660 개인) — 작업물 아래 80
 * - 팀: 팀 사진 173×115, 12 띄우고 이름 목록 (Pretendard 11, 줄 간격 24, 이름 뒤 ↗ 15)
 * - 개인: 디자이너 프로필 86×115, 12 띄우고 이름 ↗
 * - 팀인데 나뉨 (2563:7289): 개인과 같은 줄(프로필 86×115 + 이름 ↗)을 참여자마다, 줄 사이 12
 * 이름을 누르면 디자이너 프로필로 간다.
 */
export default function MobileCredits({
  photo,
  photoAlt,
  solo,
  designers,
  profiles,
}: {
  photo: string;
  photoAlt: string;
  solo: boolean;
  designers: CreditDesigner[];
  /** 팀인데 나뉨 — 있으면 팀 사진 대신 참여자마다 프로필 줄 */
  profiles?: (CreditDesigner & { profile: string })[];
}) {
  if (designers.length === 0) return null;
  if (profiles)
    return (
      <ul className="mt-20 flex flex-col gap-3 px-margin md:hidden">
        {profiles.map((d) => (
          <li key={d.slug} className="flex items-start gap-3">
            <div className="relative h-[115px] w-[86px] shrink-0">
              <Image
                src={asset(d.profile)}
                alt={`${d.nameKo} 프로필 사진`}
                fill
                sizes="86px"
                className="object-cover"
              />
            </div>
            <Link
              href={`/designers/${d.slug}/`}
              className="flex items-center gap-1 font-kr text-[11px] leading-5"
            >
              {d.nameKo}
              <ArrowUpRight className="size-[15px] shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    );
  return (
    <div className="mt-20 flex items-start gap-3 px-margin md:hidden">
      <div
        className={solo ? "relative h-[115px] w-[86px] shrink-0" : "relative h-[115px] w-[173px] shrink-0"}
      >
        <Image
          src={asset(photo)}
          alt={photoAlt}
          fill
          sizes={solo ? "86px" : "173px"}
          className="object-cover"
        />
      </div>
      <ul className="flex flex-col gap-1 font-kr text-[11px] leading-5">
        {designers.map((d) => (
          <li key={d.slug}>
            <Link href={`/designers/${d.slug}/`} className="flex items-center gap-1">
              {d.nameKo}
              <ArrowUpRight className="size-[15px] shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
