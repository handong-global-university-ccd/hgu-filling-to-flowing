import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  /** 한 바퀴 도는 시간(초) */
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
};

/**
 * 가로 무한 루프. children 을 두 번 렌더링해서 -50% 이동 → 끊김 없이 반복.
 * 모션 줄이기 설정이면 globals.css 에서 자동으로 멈춘다.
 */
export default function Marquee({ children, duration = 60, reverse, pauseOnHover, className }: Props) {
  return (
    <div className={cn("group overflow-hidden", className)}>
      <div
        className={cn("marquee-track", pauseOnHover && "group-hover:[animation-play-state:paused]")}
        style={
          {
            "--marquee-duration": `${duration}s`,
            "--marquee-direction": reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
