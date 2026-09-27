import Header from "./Header";
import Footer from "./Footer";
import { cn } from "@/lib/cn";

/**
 * 헤더(fixed) 높이만큼 본문을 내려주는 공통 레이아웃.
 * filters=true 면 헤더가 분야 탭·검색을 포함한 Default(176px) 변형이 된다.
 * 이때 상태는 WorksFilterProvider 가 공급하므로 이 컴포넌트 바깥에서 감싸야 한다.
 */
export default function PageShell({
  children,
  inverse = false,
  filters = false,
  className,
}: {
  children: React.ReactNode;
  inverse?: boolean;
  filters?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(inverse ? "bg-bg-inverse text-fg-inverse" : "bg-bg text-fg")}>
      <Header inverse={inverse} filters={filters} />
      <main id="main" className={cn("min-h-svh", filters ? "pt-[176px]" : "pt-[110px]", className)}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
