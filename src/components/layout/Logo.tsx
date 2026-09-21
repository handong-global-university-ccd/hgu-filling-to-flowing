import { cn } from "@/lib/cn";

/**
 * TODO: 디자이너에게 "FILLING TO FLOWING" 로고타입 SVG를 받아 교체.
 * 지금은 텍스트로 자리만 잡아둔 상태.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("block leading-[0.9] font-semibold tracking-tight uppercase", className)}>
      Filling
      <br />
      To Flowing
    </span>
  );
}
