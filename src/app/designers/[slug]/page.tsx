import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import DesignerProfile, { type ProfileDesigner } from "@/components/designers/DesignerProfile";
import { WorksFilterProvider } from "@/components/works/works-filter";
import { DESIGNERS, getDesigner, getDesigners } from "@/data/designers";
import { getWork } from "@/data/works";
import { FIELDS } from "@/data/types";

export const dynamicParams = false;
export function generateStaticParams() {
  return DESIGNERS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/designers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getDesigner(slug);
  return d ? { title: `${d.nameKo} ${d.nameEn}` } : {};
}

const fieldLabel = (key: string) => FIELDS.find((f) => f.key === key)?.label ?? key;

/**
 * Figma 디자이너 상세 (1807:15093 들어오자마자 / 1807:15124 / 1807:15169)
 * 화면설명 1837:11750 — 이름(한/영) → 분야 → 연락처 → 참여 작품 순,
 *                      좌측 리스트는 흑백, 우측 프로필 사진은 컬러
 */
export default async function DesignerDetailPage({ params }: PageProps<"/designers/[slug]">) {
  const { slug } = await params;
  if (!getDesigner(slug)) notFound();

  const list = getDesigners();
  const designers: ProfileDesigner[] = list.map((d) => ({
    slug: d.slug,
    nameKo: d.nameKo,
    nameEn: d.nameEn,
    disciplines: d.fields.map(fieldLabel).join(", "),
    contacts: [d.email, d.instagram].filter((c): c is string => Boolean(c)),
    profile: d.profile,
    profileMono: d.profileMono,
    works: d.workSlugs
      .map(getWork)
      .filter((w) => w !== undefined)
      .map((w) => ({ slug: w.slug, title: w.title })),
  }));

  const initialIndex = list.findIndex((d) => d.slug === slug);

  // 헤더 둘째 줄(분야 탭·검색)이 Scroll 상태로 붙어 있어서 Provider 가 필요하다
  return (
    <WorksFilterProvider>
      <PageShell filters compact>
        <DesignerProfile designers={designers} initialIndex={initialIndex} />
        <div className="h-90" />
      </PageShell>
    </WorksFilterProvider>
  );
}
