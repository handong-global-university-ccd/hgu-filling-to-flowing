import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { getDesigners } from "@/data/designers";
import { FIELDS } from "@/data/types";

export const metadata: Metadata = { title: "Designers" };

const fieldLabel = (key: string) => FIELDS.find((f) => f.key === key)?.label ?? key;

/**
 * Figma 디자이너 리스트 (1807:15014)
 * TODO: 스크롤에 따라 한 명씩 활성화 + 우측 프로필/썸네일 교체 (GSAP ScrollTrigger snap)
 * TODO: 탭 필터·검색 (WorksBrowser 패턴 재사용)
 */
export default function DesignersPage() {
  const designers = getDesigners();
  return (
    <PageShell>
      <div className="page-grid">
        <table className="col-span-6 text-body-sm">
          <thead className="text-caption text-fg-tertiary">
            <tr>
              <th className="pb-4 text-left font-normal">Name</th>
              <th className="pb-4 text-left font-normal">Disciplines</th>
            </tr>
          </thead>
          <tbody>
            {designers.map((d) => (
              <tr key={d.slug} className="text-fg-tertiary transition-colors hover:text-fg">
                <td className="py-1 font-kr">
                  <Link href={`/designers/${d.slug}/`}>{d.nameKo}</Link>
                </td>
                <td className="py-1">{d.fields.map(fieldLabel).join(" / ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
