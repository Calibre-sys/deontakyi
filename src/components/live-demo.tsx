import { ArrowUpRight, MousePointer2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { WindowFrame } from "@/components/case-visuals";
import { Loader } from "@/components/motion/loader";

const DEMO_URL = "/rescharai-demo/";
/** The app is laid out for a desktop window; render it at this size and scale it down. */
const FRAME_W = 1440;
const FRAME_H = 900;
/** Below this width the scaled app is too small to use: show the poster and a link. */
const MIN_EMBED_WIDTH = 560;
/** The demo keeps its own theme in localStorage (same origin). The embed always opens in light. */
function pinLightTheme() {
  try {
    localStorage.setItem("app-theme", "light");
  } catch {
    /* storage blocked */
  }
  return true;
}

/** The RescharAI demo embedded in the page, so visitors see the real app without a click. */
export function LiveDemo() {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  // The frame ignores the pointer until clicked, so scrolling the page never gets caught in it.
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useState(pinLightTheme);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = width / FRAME_W;
  const embed = width >= MIN_EMBED_WIDTH;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-[1.25rem] leading-tight">Try RescharAI</h3>
        <a href={DEMO_URL} target="_blank" rel="noopener" className="link inline-flex items-center gap-1 text-[0.9375rem]">
          Open full screen <ArrowUpRight className="size-4" />
        </a>
      </div>
      <WindowFrame>

      <div
        ref={box}
        onMouseLeave={() => setActive(false)}
        className="relative w-full overflow-hidden bg-white"
        style={embed ? { height: Math.round(FRAME_H * scale) } : { aspectRatio: "16 / 10" }}
      >
        {embed ? (
          <>
            <iframe
              src={DEMO_URL}
              title="RescharAI interactive demo"
              loading="lazy"
              onLoad={() => setLoaded(true)}
              className="absolute top-0 left-0 origin-top-left border-0"
              style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})`, pointerEvents: active ? "auto" : "none" }}
            />
            {!loaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white text-neutral-900">
                <Loader variant="dither" size={36} label="Loading the RescharAI demo" />
                
              </div>
            )}
            {!active && (
              <button
                type="button"
                onClick={() => setActive(true)}
                className="absolute inset-0 flex items-end justify-center p-4"
                aria-label="Use the RescharAI demo here"
              >
                <span className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-1.5 text-[0.875rem] font-medium text-white shadow-sm">
                  <MousePointer2 className="size-3.5" /> Click to try it
                </span>
              </button>
            )}
          </>
        ) : (
          <a href={DEMO_URL} target="_blank" rel="noopener" className="absolute inset-0 block">
            <img src="/media/reschar-poster.jpg" alt="RescharAI app" loading="lazy" className="size-full object-cover" />
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-md bg-background/90 px-3 py-1.5 text-[0.875rem] font-medium">
              open the demo <ArrowUpRight className="size-3.5" />
            </span>
          </a>
        )}
      </div>

      </WindowFrame>
      <p className="text-[0.8125rem] text-muted-foreground">Runs on sample wells. Uploads and exports are turned off.</p>
    </div>
  );
}
