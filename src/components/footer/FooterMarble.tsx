"use client";

import MarbleFooter from "./MarbleFooter";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MOBILE_QUERY } from "@/lib/header";

/**
 * 푸터 마블 서브비주얼 (Figma Footer 2378:5073 의 Subvisual).
 * 커서·손가락으로 물감 결을 밀 수 있는 WebGL 컴포넌트(MarbleFooter) 를 푸터 자리에 맞춰 둔다.
 *
 * 위치는 Figma Footer(2573:23106) 렌더와 실루엣을 맞춰 잰 값이다.
 *   1920 기준: 폭 1922(=화면 폭 × 1922/1920), 위 24 · 왼쪽 24(= 폭 × 24/1922) — 푸터(290) 아래로 잘린다
 *   웹 푸터는 290 고정이라, 화면이 좁아져도 그림 아래 끝이 푸터 바닥 위로 올라오지 않게 폭은 최소 860
 *   (860 × 834/2560 + 위 여백 11 ≈ 291) — 그보다 좁은 화면에서는 오른쪽이 잘린다
 *   모바일   : 폭 1000, 위 100, 왼쪽 -188 — 산마루가 화면 가운데, 메뉴 글자와 안 겹치게 (시안 없음)
 * 왼쪽 꼬리는 Figma 에서 잘려 있다(1920 기준 x 192 부터 보임) — 그대로 두면 왼쪽 아래 학교 로고(흰색) 뒤에
 * 밝은 물감이 깔려 로고가 안 보여서, 웹은 왼쪽 9vw 까지 지우고 20vw 까지 서서히 나타나게 마스크를 건다.
 * 이미지는 3840×1250 누끼를 2560 으로 줄인 투명 WebP — 흰/검정 푸터 모두에 그대로 쓴다.
 */
export default function FooterMarble() {
  const isMobile = useMediaQuery(MOBILE_QUERY);

  return (
    // 푸터 아래·양옆으로 넘치는 부분은 잘라야 페이지 끝에 빈 스크롤 공간이 생기지 않는다.
    // clip-path 는 그림만 자르고 스크롤 영역은 그대로 남아서, 위로 200px 더 깔린 overflow 래퍼로 자른다
    // (물감이 위로 넘쳐 흐르는 bleedTop 120 은 이 안에 들어온다)
    <div className="pointer-events-none absolute inset-x-0 -top-[200px] bottom-0 overflow-hidden md:[mask-image:linear-gradient(to_right,transparent_9vw,black_20vw)]">
      <div className="absolute top-[300px] left-[-188px] w-[1000px] max-w-none [--w:max(calc(100vw*1922/1920),860px)] md:top-[calc(var(--w)*24/1922+200px)] md:left-[calc(var(--w)*24/1922)] md:w-(--w)">
        <MarbleFooter
          src="/brand/footer/marble-footer@2560.webp"
          alt=""
          aspectRatio={2560 / 834}
          interactionRadius={isMobile ? 110 : 160}
        />
      </div>
    </div>
  );
}
