import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import WorksBrowser from "@/components/works/WorksBrowser";
import { WorksFilterProvider } from "@/components/works/works-filter";
import { getWorks } from "@/data/works";
import { getDesigner } from "@/data/designers";

export const metadata: Metadata = { title: "Works" };

export default function WorksPage() {
  const items = getWorks().map((work) => ({
    work,
    designerNames: work.designerSlugs.map((s) => getDesigner(s)?.nameEn ?? s).join(", "),
  }));

  // 분야 탭·검색은 헤더에 있고 결과는 본문에 있어서 상태를 PageShell 바깥에서 공유한다
  return (
    <WorksFilterProvider>
      <PageShell filters>
        <WorksBrowser items={items} />
      </PageShell>
    </WorksFilterProvider>
  );
}
