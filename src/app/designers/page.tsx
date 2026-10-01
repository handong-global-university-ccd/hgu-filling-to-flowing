import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import DesignerList, { type DesignerRow } from "@/components/designers/DesignerList";
import { WorksFilterProvider } from "@/components/works/works-filter";
import { getDesigners } from "@/data/designers";
import { getWork } from "@/data/works";
import { FIELDS } from "@/data/types";

export const metadata: Metadata = { title: "Designers" };

const fieldLabel = (key: string) => FIELDS.find((f) => f.key === key)?.label ?? key;

/**
 * Figma 디자이너 리스트 (1807:15014)
 * 화면설명 1837:11703 — 좌측부터 이름(한글) → 분야(영문), 가나다순 정렬
 */
export default function DesignersPage() {
  const rows: DesignerRow[] = getDesigners().map((d) => ({
    slug: d.slug,
    nameKo: d.nameKo,
    nameEn: d.nameEn,
    fieldKeys: [...d.fields],
    disciplines: d.fields.map(fieldLabel).join(" / "),
    profile: d.profile,
    thumbnails: d.workSlugs
      .slice(0, 3)
      .map((s) => getWork(s)?.thumbnails[0])
      .filter((s): s is string => Boolean(s)),
  }));

  // 분야 탭·검색은 헤더에 있고 리스트는 본문에 있어서 상태를 PageShell 바깥에서 공유한다
  return (
    <WorksFilterProvider>
      <PageShell filters>
        <DesignerList designers={rows} />
      </PageShell>
    </WorksFilterProvider>
  );
}
