"use client";

import { useSyncExternalStore } from "react";

/** SSR에서는 false, 브라우저에서는 실제 매칭 결과 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useIsPortrait = () => useMediaQuery("(orientation: portrait)");
export const useHasFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");
