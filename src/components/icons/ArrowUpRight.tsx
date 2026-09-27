/**
 * Figma Footer 의 arrow-up-right (20×20).
 * TODO: 디자인팀이 내보낸 원본 SVG 를 받으면 path 를 교체할 것.
 *       currentColor 를 쓰므로 White/Black 푸터 양쪽에서 색이 자동으로 따라간다.
 */
export default function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M6.5 13.5 13.5 6.5" />
      <path d="M7.5 6.5h6v6" />
    </svg>
  );
}
