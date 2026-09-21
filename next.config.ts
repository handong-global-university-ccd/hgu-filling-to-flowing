import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 정적 사이트로 빌드 → out/ 폴더를 S3+CloudFront(또는 아무 정적 호스팅)에 올리면 됨
  output: "export",
  // S3에서 /works/abc → /works/abc/index.html 로 찾도록
  trailingSlash: true,
  images: {
    // 정적 export에서는 Next 이미지 최적화 서버가 없으므로 미리 webp/avif로 변환해서 올린다
    unoptimized: true,
  },
};

export default nextConfig;
