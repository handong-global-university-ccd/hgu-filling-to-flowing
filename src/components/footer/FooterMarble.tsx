"use client";

import MarbleFooter from "./MarbleFooter";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MOBILE_QUERY } from "@/lib/header";

/**
 * 푸터 마블 서브비주얼 (Figma Footer 2378:5073 의 Subvisual).
 * 커서·손가락으로 물감 결을 밀 수 있는 WebGL 컴포넌트(MarbleFooter) 를 푸터 자리에 맞춰 둔다.
 *
 * 위치는 Figma 렌더와 실루엣을 맞춰 잰 값이다.
 *   1920 기준: 폭 2034(=105.94%), 위 35.6(=1.854vw), 왼쪽 0 — 푸터 높이 346 에서 아래가 잘린다
 *   모바일   : 폭 1000, 위 100, 왼쪽 -188 — 산마루가 화면 가운데, 메뉴 글자와 안 겹치게 (시안 없음)
 * 이미지는 3840×1250 누끼를 2560 으로 줄인 투명 WebP — 흰/검정 푸터 모두에 그대로 쓴다.
 */
export default function FooterMarble() {
  const isMobile = useMediaQuery(MOBILE_QUERY);

  return (
    <div className="pointer-events-none absolute top-[100px] left-[-188px] w-[1000px] max-w-none md:top-[1.854vw] md:left-0 md:w-[105.94%]">
      <MarbleFooter
        src="/brand/footer/marble-footer@2560.webp"
        alt=""
        aspectRatio={2560 / 834}
        interactionRadius={isMobile ? 110 : 160}
      />
    </div>
  );
}
