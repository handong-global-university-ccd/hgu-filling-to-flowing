import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import { DESIGNERS, getDesigner, getDesigners } from "@/data/designers";
import { getWork } from "@/data/works";
import { FIELDS } from "@/data/types";
import { asset } from "@/lib/asset";

export const dynamicParams = false;
export function generateStaticParams() {
  return DESIGNERS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/designers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getDesigner(slug);
  return d ? { title: `${d.nameKo} ${d.nameEn}` } : {};
}

/**
 * Figma 디자이너 상세 (1807:15093)
 * 좌측 흑백 리스트 이미지 클릭 → 해당 디자이너로 이동
 * TODO: 스크롤 시 다음 디자이너로 전환
 */
export default async function DesignerDetailPage({ params }: PageProps<"/designers/[slug]">) {
  const { slug } = await params;
  const d = getDesigner(slug);
  if (!d) notFound();
  const works = d.workSlugs.map(getWork).filter((w) => w !== undefined);

  return (
    <PageShell>
      <div className="page-grid">
        <ul className="col-span-2 grid grid-cols-3 content-start gap-1">
          {getDesigners().map((o) => (
            <li key={o.slug}>
              <Link href={`/designers/${o.slug}/`} aria-current={o.slug === slug ? "page" : undefined}>
                <Image
                  src={asset(o.profileMono ?? o.profile)}
                  alt={o.nameKo}
                  width={80}
                  height={100}
                  className="aspect-[4/5] object-cover grayscale"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="col-span-5 col-start-4 space-y-8">
          <div>
            <h1 className="font-kr text-h1">{d.nameKo}</h1>
            <p className="text-h2">{d.nameEn}</p>
          </div>
          <p className="text-body-sm">
            {d.fields.map((f) => FIELDS.find((x) => x.key === f)?.label).join(" / ")}
          </p>
          {d.email && (
            <p className="text-body-sm">
              <a href={`mailto:${d.email}`}>{d.email}</a>
            </p>
          )}
          <ul className="space-y-1 text-body-sm">
            {works.map((w) => (
              <li key={w.slug}>
                <Link href={`/works/${w.slug}/`}>{w.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-4">
          <Image
            src={asset(d.profile)}
            alt=""
            width={600}
            height={750}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
      </div>
    </PageShell>
  );
}
