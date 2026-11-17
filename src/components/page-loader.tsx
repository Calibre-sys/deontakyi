import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Loader } from "@/components/motion/loader";

const MIN_MS = 1100;
const MAX_MS = 2600;
const KEY = "loader-seen";

/**
 * A short boot screen: the beUI dither loader, a name and a counter.
 * Shown on the first visit of a session only, and never under reduced motion.
 */
export function PageLoader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem(KEY);
    } catch {
      return true;
    }
  });
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!show || reduce) {
      setShow(false);
      onDone();
      return;
    }
    const start = performance.now();
    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad);
    let raf = 0;
    const tick = (now: number) => {
      const t = now - start;
      // Counts toward 90% on its own and only finishes once the page has loaded (or time runs out).
      const target = loaded && t > MIN_MS ? 100 : Math.min(90, (t / MIN_MS) * 90);
      setPct((p) => Math.max(p, Math.round(target)));
      if ((loaded && t > MIN_MS) || t > MAX_MS) {
        setPct(100);
        window.setTimeout(() => {
          setShow(false);
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {
            /* private mode */
          }
        }, 180);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = show ? "hidden" : "";
  }, [show]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && !reduce && (
        <motion.div
          key="loader"
          data-no-scramble
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-background"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
        >
          <Loader variant="dither" size={48} speed={1.1} className="text-foreground" label="Loading" />
          <div className="flex w-56 flex-col gap-3">
            <div className="flex items-baseline justify-between text-[0.8125rem] text-muted-foreground">
              <span>Deon Takyi-Amponsem</span>
              <span className="tabular-nums text-foreground">{pct}%</span>
            </div>
            <div className="h-px w-full overflow-hidden bg-border">
              <div className="h-full bg-foreground transition-[width] duration-150" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
