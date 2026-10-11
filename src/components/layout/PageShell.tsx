import Header, { type ArchiveTab } from "./Header";
import Footer from "./Footer";
import { cn } from "@/lib/cn";

/**
 * 헤더(fixed) 높이만큼 본문을 내려주는 공통 레이아웃.
 * 헤더·푸터 모두 페이지 배경(inverse)을 따라간다 — 홈만 검정, 나머지는 흰색.
 *
 * filters=true  : Works 분야 탭·검색을 포함한 Default(176px) 헤더.
 *                 상태는 WorksFilterProvider 가 공급하므로 이 컴포넌트 바깥에서 감싸야 한다.
 * archive=...   : Behind / Exhibition View 탭을 포함한 Default(176px) 헤더.
 *
 * fullscreen=true 면 페이지가 화면 한 장으로 끝난다 — 스크롤도 푸터도 없다.
 * 아카이브_비하인드처럼 "전체 레이아웃을 마우스로 둘러보는" 화면에 쓴다.
 * 본문은 헤더 높이만큼 내리지 않고 화면 전체(top 0)를 쓰며, 헤더는 그 위에 겹친다.
 * 헤더가 숨었을 때 그 자리가 빈 칸으로 남지 않게 하기 위해서다.
 * 본문은 flex column 이므로 안에서 flex-1 로 남은 높이를 다 쓰면 된다.
 */
export default function PageShell({
  children,
  inverse = false,
  filters = false,
  archive,
  compact = false,
  hideOnScroll = false,
  headerHeight = 110,
  fullscreen = false,
  className,
}: {
  children: React.ReactNode;
  inverse?: boolean;
  filters?: boolean;
  archive?: ArchiveTab;
  /** 둘째 줄 헤더를 처음부터 접힌(74px) 상태로 둔다 */
  compact?: boolean;
  /** 아래로 스크롤하면 헤더를 숨기고, 마우스를 화면 위로 올리면 다시 보여준다 */
  hideOnScroll?: boolean;
  /** 둘째 줄이 없는 단순 헤더의 높이(px) */
  headerHeight?: number;
  fullscreen?: boolean;
  className?: string;
}) {
  const tall = (filters || Boolean(archive)) && !compact;
  const padTop = !fullscreen;

  return (
    <div
      className={cn(
        fullscreen && "h-svh overflow-hidden",
        inverse ? "bg-bg-inverse text-fg-inverse" : "bg-bg text-fg",
      )}
    >
      <Header
        inverse={inverse}
        filters={filters}
        archive={archive}
        compact={compact}
        hideOnScroll={hideOnScroll}
        height={headerHeight}
      />
      <main
        id="main"
        className={cn(
          fullscreen ? "flex h-svh flex-col" : "min-h-svh",
          // 모바일 값은 lib/header.ts 의 HEADER_H.mobile 과 같아야 한다
          padTop &&
            (tall
              ? filters
                ? "pt-[166px] md:pt-[176px]"
                : "pt-[120px] md:pt-[176px]"
              : compact
                ? "pt-[108px] md:pt-[74px]"
                : "pt-16 md:pt-(--header-h)"),
          className,
        )}
        style={
          padTop && !tall && !compact
            ? ({ "--header-h": `${headerHeight}px` } as React.CSSProperties)
            : undefined
        }
      >
        {children}
      </main>
      {!fullscreen && <Footer inverse={inverse} />}
    </div>
  );
}
