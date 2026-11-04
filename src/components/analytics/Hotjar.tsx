import Script from "next/script";

/**
 * Hotjar(Contentsquare) 추적 코드 — NEXT_PUBLIC_HOTJAR_ID 가 있을 때만 넣는다 (로컬 개발 중에는 기록하지 않음)
 * - Contentsquare 태그 ID(예: 846119ff47977, 설치 화면 "Tag") → https://t.contentsquare.net/uxa/<ID>.js
 * - 예전 Hotjar 숫자 ID(예: 1234567) → Hotjar 기본 설치 코드
 * - 주소(https://…js) → 그 스크립트를 그대로 불러온다
 * 정적 export 라 빌드할 때 값이 박힌다 — 값을 바꾸면 다시 배포해야 한다
 */
const VALUE = process.env.NEXT_PUBLIC_HOTJAR_ID?.trim() ?? "";

export default function Hotjar() {
  if (/^\d+$/.test(VALUE)) {
    return (
      <Script id="hotjar" strategy="afterInteractive">
        {`(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${VALUE},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
      </Script>
    );
  }
  if (/^[0-9a-f]+$/i.test(VALUE)) {
    return (
      <Script id="hotjar" src={`https://t.contentsquare.net/uxa/${VALUE}.js`} strategy="afterInteractive" />
    );
  }
  if (/^https:\/\//.test(VALUE)) return <Script id="hotjar" src={VALUE} strategy="afterInteractive" />;
  return null;
}
