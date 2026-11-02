import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

/*
 * A stack of instant-camera prints. The top print slides out and tucks in at the back every few
 * seconds, or on click / tap / Enter. Each print "develops" from washed-out to full colour as it
 * reaches the top.
 */

type Print = { src: string; alt: string; caption: string; position: string; tilt: number };

const PRINTS: Print[] = [
  { src: "/portrait-card.jpg", alt: "Portrait of Deon Takyi-Amponsem", caption: "Deon · Accra", position: "50% 22%", tilt: -3 },
  { src: "/media/atc-2026.jpg", alt: "Deon at the SPE Africa Technology Conference, Abidjan", caption: "ATC Abidjan '26", position: "50% 28%", tilt: 4 },
  { src: "/media/buildingbytes-1.jpg", alt: "Building Bytes Pitch Program, Kumasi", caption: "Building Bytes, Kumasi", position: "55% 40%", tilt: -5 },
  { src: "/media/energy4me-2.jpg", alt: "SPE Energy4me outreach in a classroom", caption: "Energy4me outreach", position: "60% 40%", tilt: 3 },
  { src: "/media/buildingbytes-2.jpg", alt: "Building Bytes demo day", caption: "Demo day", position: "50% 45%", tilt: -2 },
];

const VISIBLE = 4;
const INTERVAL = 4200;

export function PhotoStack() {
  const reduce = useReducedMotion();
  const [order, setOrder] = useState(() => PRINTS.map((_, i) => i));
  const [leaving, setLeaving] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const busy = useRef(false);

  const shuffle = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    const top = order[0];
    if (reduce) {
      setOrder((o) => [...o.slice(1), o[0]]);
      busy.current = false;
      return;
    }
    setLeaving(top);
    // Halfway out, the print drops behind the deck; then it slides back in at the bottom.
    window.setTimeout(() => setOrder((o) => [...o.slice(1), o[0]]), 320);
    window.setTimeout(() => {
      setLeaving(null);
      busy.current = false;
    }, 700);
  }, [order, reduce]);

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setInterval(() => {
      if (!document.hidden) shuffle();
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, [shuffle, reduce, paused]);

  const top = PRINTS[order[0]];

  return (
    <div
      className="relative mx-auto aspect-[5/6] w-full max-w-[24rem] select-none"
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <button
        type="button"
        onClick={shuffle}
        aria-label={`Photo: ${top.caption}. Show the next photo`}
        className="absolute inset-0 z-50 cursor-pointer rounded-sm"
      />
      {PRINTS.map((print, id) => {
        const depth = order.indexOf(id);
        const isLeaving = leaving === id;
        const hidden = depth >= VISIBLE && !isLeaving;
        const pose = isLeaving
          ? { x: "62%", y: -18, rotate: print.tilt + 14, scale: 1 }
          : {
              x: depth * 7 * (depth % 2 ? -1 : 1),
              y: depth * 6,
              rotate: depth === 0 ? print.tilt * 0.5 : print.tilt,
              scale: 1 - depth * 0.025,
            };
        return (
          <motion.figure
            key={print.src}
            aria-hidden={depth !== 0}
            className="absolute inset-x-[6%] top-[3%] origin-bottom bg-[#fbfaf6] p-[5%] pb-[4%] shadow-[0_18px_40px_-14px_rgb(0_0_0/0.55),0_2px_6px_rgb(0_0_0/0.18)]"
            style={{ zIndex: 40 - depth }}
            initial={false}
            animate={{ ...pose, opacity: hidden ? 0 : 1 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 210, damping: 26, mass: 0.9 }}
          >
            <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
              <motion.img
                src={print.src}
                alt={depth === 0 ? print.alt : ""}
                draggable={false}
                loading={id === 0 ? "eager" : "lazy"}
                className="size-full object-cover"
                style={{ objectPosition: print.position }}
                initial={false}
                animate={{
                  filter:
                    depth === 0
                      ? "sepia(0.18) saturate(0.92) contrast(1.04) brightness(1)"
                      : "sepia(0.5) saturate(0.4) contrast(0.85) brightness(1.35)",
                }}
                transition={{ duration: reduce ? 0 : 1.6, ease: "easeOut" }}
              />
              {/* Film sheen and soft vignette. */}
              <span aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_rgb(0_0_0/0.28)]" />
            </div>
            <figcaption className="pt-[5%] text-center font-[family-name:var(--font-hand)] font-semibold text-[clamp(1.25rem,1rem+0.8vw,1.6rem)] leading-none text-[#2a2a2a]">
              {print.caption}
            </figcaption>
          </motion.figure>
        );
      })}
      <p className="absolute -bottom-9 inset-x-0 text-center text-[0.8125rem] text-muted-foreground" aria-live="polite">
        <span className="sr-only">Now showing: {top.caption}. </span>
        Tap to shuffle
      </p>
    </div>
  );
}
