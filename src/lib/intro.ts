/** 인트로를 이번 세션에 이미 지나쳤는지 기억하는 sessionStorage 키 */
export const INTRO_SEEN_KEY = "degree2026:intro-seen";

/**
 * 이번 세션에 인트로를 이미 지나쳤으면 첫 페인트 전에 <html> 에 intro-seen 을 붙인다.
 * globals.css 가 이 클래스로 인트로를 숨겨서, 다시 들어와도 인트로가 깜빡이지 않는다.
 * 홈(서버 컴포넌트)에서 인트로보다 먼저 인라인 스크립트로 넣는다.
 * (<html> 클래스가 서버 HTML 과 달라지므로 layout 의 <html> 에 suppressHydrationWarning)
 */
export const INTRO_SEEN_SCRIPT = `try{sessionStorage.getItem(${JSON.stringify(INTRO_SEEN_KEY)})==="1"&&document.documentElement.classList.add("intro-seen")}catch(e){}`;
