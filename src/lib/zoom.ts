/**
 * 화면 폭 비례 축소 — 1920 시안을 노트북에서도 같은 구성으로 보이게 한다.
 *
 * 맥북 14"(1512) · 13"(1440) 처럼 1920 보다 좁은 데스크톱에서는 페이지 전체에
 * CSS zoom = 화면폭 / 1920 을 건다 (브라우저 80% 확대/축소와 같은 효과).
 * - 1920 이상: 1 (그대로)
 * - 1024 미만(태블릿·모바일): 1 — 모바일 레이아웃을 따로 쓴다
 * - 그 사이: 화면폭/1920, 단 0.75 아래로는 줄이지 않는다 (본문 16px → 최소 12px)
 *
 * 첫 페인트 전에 적용되도록 layout <head> 의 인라인 스크립트로 넣는다.
 * zoom 이 걸리면 vw·svh 도 같이 줄어들므로 화면 크기 단위는 globals.css 의 --vw / --svh 를 쓴다.
 */
export const ZOOM = { base: 1920, from: 1024, min: 0.75 } as const;

export const ZOOM_SCRIPT = `(function(){var d=document.documentElement;function z(){var w=window.innerWidth,s=w>=${ZOOM.base}||w<${ZOOM.from}?1:Math.max(${ZOOM.min},w/${ZOOM.base});d.style.zoom=s===1?"":String(s);d.style.setProperty("--zoom",String(s))}z();window.addEventListener("resize",z)})()`;

/**
 * 지금 페이지에 걸린 zoom. 마우스 좌표(clientX/Y)나 getBoundingClientRect 값은 화면 기준이라,
 * 그 값을 style 의 px 로 다시 쓸 때는 이 값으로 나눠야 위치가 맞는다.
 */
export function pageZoom() {
  if (typeof document === "undefined") return 1;
  const z = parseFloat(document.documentElement.style.getPropertyValue("--zoom"));
  return z > 0 ? z : 1;
}
