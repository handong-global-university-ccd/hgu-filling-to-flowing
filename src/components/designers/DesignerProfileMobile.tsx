import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/asset";
import type { ProfileDesigner } from "./DesignerProfile";

/**
 * Figma 모바일 디자이너 상세 (2573:10650) — 390 기준, ← 헤더(46) 아래 9
 *
 * - 이름 한 14/20 · 영 12/18 (사이 2), 오른쪽 끝에 컬러 프로필 156×208 (이름과 같은 높이에서 시작)
 * - Disciplines (이름 위에서 107 아래) / Contact (17 아래) : 4px 사각 점 + 12 들여쓴 라벨 11/18 · 값 10/15 Neutral/500
 * - Work : 사진 아래 109 에 라벨, 8 아래로 작품마다 썸네일 358×210 → 8 → 제목 12/18 Neutral/500, 작품 사이 25
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
    <section className="px-margin pt-[9px] md:hidden">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-col gap-[2px]">
            <h1 className="font-kr text-kr-body-sm">{d.nameKo}</h1>
            <p className="text-caption text-fg-secondary">{d.nameEn}</p>
          </div>

          <dl className="mt-[67px] flex flex-col gap-[17px]">
            <Item label="Disciplines">
              <dd>{d.disciplines}</dd>
            </Item>
            {d.contacts.length > 0 && (
              <Item label="Contact">
                {d.contacts.map((c) => (
                  <dd key={c}>
                    <a
                      href={c.includes("@") ? `mailto:${c}` : `https://${c.replace(/^https?:\/\//, "")}`}
                      className="break-all"
                    >
                      {c}
                    </a>
                  </dd>
                ))}
              </Item>
            )}
          </dl>
        </div>

        <Image
          src={asset(d.profile)}
          alt={`${d.nameKo} 프로필 사진`}
          width={338}
          height={452}
          priority
          className="h-[208px] w-[156px] shrink-0 object-cover"
        />
      </div>

      {d.works.length > 0 && (
        <div className="mt-[109px]">
          <h2 className="flex items-center gap-2 text-[11px] leading-[18px]">
            <span aria-hidden className="size-1 shrink-0 bg-fg" />
            Work
          </h2>
          <ul className="mt-2 flex flex-col gap-[25px]">
            {d.works.map((w) => (
              <li key={w.slug}>
                <Link href={`/works/${w.slug}/`} className="block">
                  <div className="relative h-[210px] bg-bg-subtle">
                    <Image src={asset(w.thumbnail)} alt="" fill sizes="100vw" className="object-cover" />
                  </div>
                  <p className="mt-2 font-kr text-kr-caption text-fg-tertiary">{w.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col [&>dd]:pl-3 [&>dd]:text-[10px] [&>dd]:leading-[15px] [&>dd]:font-medium [&>dd]:text-fg-tertiary">
      <dt className="mb-[2px] flex items-center gap-2 text-[11px] leading-[18px]">
        <span aria-hidden className="size-1 shrink-0 bg-fg" />
        {label}
      </dt>
      {children}
    </div>
  );
}
