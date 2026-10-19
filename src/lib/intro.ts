/** 인트로를 이번 세션에 이미 지나쳤는지 기억하는 sessionStorage 키 */
export const INTRO_SEEN_KEY = "degree2026:intro-seen";

/**
 * 이번 세션에 인트로를 이미 지나쳤으면 첫 페인트 전에 <html> 에 intro-seen 을 붙인다.
 * 인트로는 숨기지 않는다 — 홈을 다시 열면 인트로 바로 아래(홈 맨 위)에서 시작하고,
 * 위로 스크롤하면 인트로가 다시 보인다 (시작 위치는 SmoothScroll·INTRO_SKIP_SCRIPT).
 * 홈(서버 컴포넌트)에서 인트로보다 먼저 인라인 스크립트로 넣는다.
 * (<html> 클래스가 서버 HTML 과 달라지므로 layout 의 <html> 에 suppressHydrationWarning)
 */
export const INTRO_SEEN_SCRIPT = `try{sessionStorage.getItem(${JSON.stringify(INTRO_SEEN_KEY)})==="1"&&document.documentElement.classList.add("intro-seen")}catch(e){}`;

/** 홈을 다시 열 때 시작할 스크롤 위치 — 인트로를 지나쳤으면 인트로 높이(화면 px), 아니면 0 */
export function homeStartY() {
  if (!document.documentElement.classList.contains("intro-seen")) return 0;
  return document.querySelector("[data-intro]")?.getBoundingClientRect().height ?? 0;
}

/**
 * 홈 본문 끝에 넣는 인라인 스크립트 — 첫 페인트 전에 인트로 아래로 내려 둬서 인트로가 깜빡이지 않는다.
 * (하이드레이션 뒤에는 SmoothScroll 이 같은 위치로 다시 맞춘다)
 */
export const INTRO_SKIP_SCRIPT = `try{var d=document.documentElement,i=document.querySelector("[data-intro]");d.classList.contains("intro-seen")&&i&&window.scrollTo(0,i.getBoundingClientRect().height)}catch(e){}`;
