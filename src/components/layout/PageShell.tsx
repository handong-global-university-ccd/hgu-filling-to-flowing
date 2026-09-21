import Header from "./Header";
import Footer from "./Footer";
import { cn } from "@/lib/cn";

/** 헤더(fixed) 높이만큼 본문을 내려주는 공통 레이아웃 */
export default function PageShell({
  children,
  inverse = false,
  className,
}: {
  children: React.ReactNode;
  inverse?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(inverse ? "bg-bg-inverse text-fg-inverse" : "bg-bg text-fg")}>
      <Header inverse={inverse} />
      <main id="main" className={cn("min-h-svh pt-[176px]", className)}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
