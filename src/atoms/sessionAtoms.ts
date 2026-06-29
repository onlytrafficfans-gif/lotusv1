import { atom } from "jotai";
import { DEMO_MODE, DEMO_SESSION_DURATION } from "@/lib/demo";

export const sessionStartTimeAtom = atom<number | null>(
  DEMO_MODE ? Date.now() : null,
);

export const sessionNowAtom = atom(Date.now());

export const sessionTimerAtom = atom<number | null>((get) => {
  const startTime = get(sessionStartTimeAtom);
  if (!startTime || !DEMO_MODE) {
    return null;
  }

  const elapsed = get(sessionNowAtom) - startTime;
  return Math.max(0, DEMO_SESSION_DURATION - elapsed);
});
