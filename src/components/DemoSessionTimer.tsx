import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { DEMO_MODE } from "@/lib/demo";
import { sessionNowAtom, sessionTimerAtom } from "@/atoms/sessionAtoms";

function formatRemaining(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function DemoSessionTimer() {
  const remaining = useAtomValue(sessionTimerAtom);
  const setSessionNow = useSetAtom(sessionNowAtom);

  useEffect(() => {
    if (!DEMO_MODE) {
      return;
    }

    const interval = window.setInterval(() => {
      setSessionNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [setSessionNow]);

  useEffect(() => {
    if (DEMO_MODE && remaining === 0) {
      window.location.reload();
    }
  }, [remaining]);

  if (!DEMO_MODE || remaining === null) {
    return null;
  }

  return (
    <div className="no-app-region-drag h-7 px-2.5 rounded-lg border border-[color:var(--lotus-border)] bg-[color:var(--lotus-panel)]/80 text-xs font-medium text-[color:var(--lotus-muted)] flex items-center">
      Demo {formatRemaining(remaining)}
    </div>
  );
}
