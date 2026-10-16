import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/asset";
import type { ProfileDesigner } from "./DesignerProfile";

/**
 * Figma 모바일 디자이너 상세 (2491:3761) — 390 기준, 헤더(141) 아래
 *
 * - 19 아래에 이름(한 14/20 · 영 12/18), 오른쪽 끝에 컬러 프로필 111×148
 * - Disciplines / Contact : 라벨 14/22 + 값 12/18 (Neutral/700)
 * - Work : 작품마다 제목 12/18 → 8 → 화면 너비 꽉 찬 썸네일(높이 270, 가운데 기준 자르기) → 41
 * 모바일에서는 흑백 레일이 없어서 한 명만 보여준다 — 다른 디자이너는 목록이나 분야 탭으로 이동.
 */
export default function DesignerProfileMobile({ designer: d }: { designer?: ProfileDesigner }) {
  if (!d) {
    return (
      <section className="px-margin md:hidden">
        <p role="status" className="py-20 text-center text-fg-tertiary">
          검색 결과가 없습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="relative px-margin pt-[19px] md:hidden">
      <Image
        src={asset(d.profile)}
        alt={`${d.nameKo} 프로필 사진`}
        width={338}
        height={452}
        priority
        className="absolute top-[19px] right-margin h-[148px] w-[111px] object-cover"
      />

      <div className="flex flex-col gap-[2px] pr-[127px]">
        <h1 className="font-kr text-kr-body-sm">{d.nameKo}</h1>
        <p className="text-caption text-fg-secondary">{d.nameEn}</p>
      </div>

      <dl className="mt-[71px] flex w-[210px] flex-col">
        <dt className="text-body-sm">Disciplines</dt>
        <dd className="mt-[3px] text-caption text-fg-secondary">{d.disciplines}</dd>
      </dl>

      {d.contacts.length > 0 && (
        <div className="mt-[23px] flex flex-col gap-[2px] pr-[127px]">
          <p className="h-[26px] text-body-sm">Contact</p>
          <ul className="flex flex-col text-caption text-fg-secondary">
            {d.contacts.map((c) => (
              <li key={c}>
                <a
                  href={c.includes("@") ? `mailto:${c}` : `https://${c.replace(/^https?:\/\//, "")}`}
                  className="break-all"
                >
                  {c}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {d.works.length > 0 && (
        <div className="mt-[67px]">
          <h2 className="text-body-sm">Work</h2>
          <ul className="mt-[11px] flex flex-col gap-[41px]">
            {d.works.map((w) => (
              <li key={w.slug}>
                <Link href={`/works/${w.slug}/`} className="block">
                  <p className="font-kr text-kr-caption text-fg-secondary">{w.title}</p>
                  <div className="relative -mx-margin mt-2 h-[270px]">
                    <Image src={asset(w.thumbnail)} alt="" fill sizes="100vw" className="object-cover" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
