/**
 * Figma 모바일 헤더의 search (28×28, 2491:3256).
 * currentColor 를 쓰므로 흰/검정 배경 양쪽에서 글자색을 따라간다.
 */
export default function Search({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
      className={className}
    >
      <circle cx="11.5" cy="11.5" r="7.5" />
      <path d="m17 17 7 7" />
    </svg>
  );
}
