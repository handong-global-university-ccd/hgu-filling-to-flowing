import type { NextConfig } from "next";

// 에셋 CDN(R2) 호스트 — NEXT_PUBLIC_ASSET_URL 이 비어 있으면 원격 이미지를 쓰지 않는다.
const assetHost = (() => {
  const url = process.env.NEXT_PUBLIC_ASSET_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  // 정적 사이트로 빌드 → out/ 폴더를 Cloudflare Pages(또는 아무 정적 호스팅)에 올리면 됨
  output: "export",
  // /works/abc → /works/abc/index.html 로 찾도록
  trailingSlash: true,
  images: {
    // 정적 export 에서는 Next 이미지 최적화 서버가 없으므로 미리 webp/avif로 변환해서 올린다
    unoptimized: true,
    remotePatterns: assetHost ? [{ protocol: "https", hostname: assetHost }] : [],
  },
};

export default nextConfig;
