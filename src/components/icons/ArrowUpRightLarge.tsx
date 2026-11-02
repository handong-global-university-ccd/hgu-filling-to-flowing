/**
 * Figma Works 상세 Others 타일의 arrow-up-right (1807:14550) — 36×36, 선 1.5.
 * 경로는 Figma 에서 내보낸 SVG 그대로이고, 색만 currentColor 로 받는다.
 */
export default function ArrowUpRightLarge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      width={36}
      height={36}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M10.5 25.5L25.5 10.5" />
      <path d="M10.5 10.5H25.5V25.5" />
    </svg>
  );
}
