/**
 * 아카이브 사진 공개 여부 — 사진이 준비되기 전에는 Behind·Exhibition View 둘 다
 * 사진 자리에 "준비중입니다." 를 띄운다. 준비되면 각각 true 로 바꾼다.
 * (Behind 사진: npm run pull:archive → archive-photos.json / Exhibition View: archive/exhibition/page.tsx 의 photos)
 */
export const ARCHIVE_READY = { behind: true, exhibition: false } as const;
