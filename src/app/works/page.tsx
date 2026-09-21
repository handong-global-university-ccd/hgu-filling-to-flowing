import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import WorksBrowser from "@/components/works/WorksBrowser";
import { getWorks } from "@/data/works";
import { getDesigner } from "@/data/designers";

export const metadata: Metadata = { title: "Works" };

export default function WorksPage() {
  const items = getWorks().map((work) => ({
    work,
    designerNames: work.designerSlugs.map((s) => getDesigner(s)?.nameEn ?? s).join(", "),
  }));

  return (
    <PageShell>
      <WorksBrowser items={items} />
    </PageShell>
  );
}
