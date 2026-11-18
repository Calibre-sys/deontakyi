"use client";

// Adapted from beUI's Card Folder (MIT, see LICENSE-beui). The payment fields
// became generic masked fields, and a `details` layer sits over the card once
// the purse has folded away, so the card can hold real links.

import { Eye, EyeOff } from "lucide-react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { DigitSwap } from "@/components/motion/digit-swap";
import { EASE_IN_OUT, EASE_OUT, SPRING_PRESS } from "@/lib/ease";
import { cn } from "@/lib/utils";

// The two purse layers collapse as one material surface after the card starts
// moving, then reverse immediately so closing feels like the card is caught.
const PURSE_MORPH_TRANSITION = { duration: 0.28, ease: EASE_IN_OUT } as const;
const PURSE_REDUCED_TRANSITION = { duration: 0.16, ease: EASE_OUT } as const;

// React 18 has no `inert` prop; an empty string sets the attribute, undefined drops it.
const inert = (on: boolean) => (on ? { inert: "" } : {}) as object;

// The card's own box inside the folder, shared by the card and its details layer.
const CARD_BOX = "absolute left-[4.7%] right-[4.7%] top-0 aspect-[1.586/1]";

export type FolderField = {
  label: string;
  value: string;
  /** Shown while details are hidden. Same length as `value` rolls glyph for glyph. */
  masked?: string;
};

export interface CardFolderProps {
  /** Names the folder for assistive technology. */
  title: string;
  /** Small fields at the top right of the purse. */
  fields?: FolderField[];
  /** The long line along the purse's bottom edge, such as an email address. */
  secret: FolderField;
  /** Card artwork. It sits inside the button, so keep it non-interactive. */
  card: ReactNode;
  /** Interactive layer laid over the card once the purse has folded away. */
  details?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  detailsVisible?: boolean;
  defaultDetailsVisible?: boolean;
  onDetailsVisibleChange?: (visible: boolean) => void;
  className?: string;
  cardClassName?: string;
}

/**
 * A landscape card tucked into a stitched purse pocket. Pressing it folds the
 * purse into its bottom seam and leaves the card (and its `details`) in front;
 * a separate eye control reveals the masked fields on the purse.
 */
export function CardFolder({
  title,
  fields = [],
  secret,
  card,
  details,
  open,
  defaultOpen = false,
  onOpenChange,
  detailsVisible,
  defaultDetailsVisible = false,
  onDetailsVisibleChange,
  className,
  cardClassName,
}: CardFolderProps) {
  const reduce = useReducedMotion();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [internalVisible, setInternalVisible] = useState(defaultDetailsVisible);
  const isOpen = open ?? internalOpen;
  const visible = detailsVisible ?? internalVisible;

  const progress = useMotionValue(isOpen ? 1 : 0);
  const cardTransform = useTransform(progress, (value) => {
    const lift = Math.sin(Math.PI * Math.min(1, Math.max(0, value)));
    return `translateY(${-8 * lift}%) scale(${1 + 0.01 * lift})`;
  });
  const backTransform = useTransform(progress, [0, 1], ["translateY(0%) scaleY(1)", "translateY(18%) scaleY(0.18)"]);
  const frontTransform = useTransform(progress, [0, 1], ["translateY(0%) rotateX(0deg)", "translateY(18%) rotateX(-72deg)"]);
  const purseOpacity = useTransform(progress, [0, 0.76, 1], [1, 1, 0]);
  // Details arrive once the card has settled back from its lift.
  const detailsOpacity = useTransform(progress, [0.7, 1], [0, 1]);

  useEffect(() => {
    const controls = animate(progress, isOpen ? 1 : 0, reduce ? { duration: 0 } : PURSE_MORPH_TRANSITION);
    return () => controls.stop();
  }, [isOpen, progress, reduce]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, open],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, setOpen]);

  const toggleVisible = () => {
    if (detailsVisible === undefined) setInternalVisible(!visible);
    onDetailsVisibleChange?.(!visible);
  };

  const swap = (field: FolderField) => ({
    value: visible || !field.masked ? field.value : field.masked,
    animationKey: visible ? "revealed" : "masked",
    direction: visible ? ("up" as const) : ("down" as const),
  });

  return (
    <div
      data-open={isOpen}
      className={cn("relative aspect-[1029/592] w-96 max-w-full select-none [perspective:1200px]", className)}
    >
      <motion.button
        type="button"
        aria-label={isOpen ? `Put away ${title}` : `Open ${title}`}
        aria-expanded={isOpen}
        onClick={() => setOpen(!isOpen)}
        whileTap={reduce ? undefined : { scale: 0.96 }}
        transition={reduce ? { duration: 0 } : SPRING_PRESS}
        className="absolute inset-0 block cursor-pointer rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={reduce ? { opacity: isOpen ? 0 : 1 } : undefined}
          transition={PURSE_REDUCED_TRANSITION}
          style={reduce ? undefined : { opacity: purseOpacity, transform: backTransform }}
          className="absolute inset-x-0 top-[10%] bottom-0 rounded-2xl border border-foreground/10 bg-background [transform-origin:center_bottom]"
        />
        <motion.span
          aria-hidden="true"
          style={reduce ? undefined : { transform: cardTransform }}
          className={cn(
            CARD_BOX,
            "z-10 overflow-hidden rounded-xl border border-foreground/10 bg-background [transform-origin:center_bottom] will-change-transform",
            cardClassName,
          )}
        >
          {card}
        </motion.span>
      </motion.button>

      {details ? (
        <motion.div
          aria-hidden={!isOpen}
          {...inert(!isOpen)}
          initial={false}
          animate={reduce ? { opacity: isOpen ? 1 : 0 } : undefined}
          transition={PURSE_REDUCED_TRANSITION}
          style={reduce ? undefined : { opacity: detailsOpacity }}
          // Clicks on empty card space fall through to the button and close it.
          className={cn(CARD_BOX, "pointer-events-none z-30 [&_a]:pointer-events-auto [&_button]:pointer-events-auto", !isOpen && "invisible")}
        >
          {details}
        </motion.div>
      ) : null}

      <motion.span
        aria-hidden={isOpen}
        {...inert(isOpen)}
        initial={false}
        animate={reduce ? { opacity: isOpen ? 0 : 1 } : undefined}
        transition={PURSE_REDUCED_TRANSITION}
        style={reduce ? undefined : { opacity: purseOpacity, transform: frontTransform }}
        className="pointer-events-none absolute inset-x-0 top-1/2 bottom-0 z-20 [backface-visibility:hidden] [transform-origin:center_bottom]"
      >
        <svg aria-hidden="true" viewBox="0 0 384 110" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
          <path
            d="M0 17C15 7 31 4 49 4H87C110 4 126 17 144 32L158 44C176 59 206 59 225 43L240 30C257 16 271 4 295 4H335C354 4 370 8 384 18V94C384 103 377 110 368 110H16C7 110 0 103 0 94Z"
            fill="var(--background)"
            stroke="var(--foreground)"
            strokeOpacity="0.12"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M10 21C22 13 35 11 51 11H85C105 11 120 23 137 37L153 50C175 68 208 68 231 49L246 36C262 23 275 11 297 11H333C350 11 363 14 374 22V89C374 97 369 101 360 101H24C15 101 10 96 10 89Z"
            fill="none"
            stroke="var(--foreground)"
            strokeDasharray="5 5"
            strokeLinecap="round"
            strokeOpacity="0.22"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <span className="absolute inset-x-[5%] inset-y-0 z-10 flex min-w-0 flex-col justify-between py-3 sm:py-4">
          <span className="flex items-start justify-between pr-2">
            <motion.button
              type="button"
              tabIndex={isOpen ? -1 : undefined}
              aria-label={visible ? "Hide contact details" : "Show contact details"}
              aria-pressed={visible}
              onClick={toggleVisible}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              transition={reduce ? { duration: 0.12 } : SPRING_PRESS}
              className={cn(
                "z-30 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                isOpen ? "pointer-events-none" : "pointer-events-auto",
              )}
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={visible ? "hide" : "show"}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                  transition={reduce ? { duration: 0.12 } : { type: "spring", duration: 0.3, bounce: 0 }}
                  className="flex items-center justify-center"
                >
                  {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <span className="flex shrink-0 items-end gap-3.5 pt-2">
              {fields.map((field) => (
                <span key={field.label} className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-medium text-muted-foreground">{field.label}</span>
                  <DigitSwap {...swap(field)} className="text-xs font-medium text-foreground tabular-nums" />
                </span>
              ))}
            </span>
          </span>

          <span className="flex min-w-0 items-baseline justify-between gap-3">
            <span className="text-[11px] font-medium text-muted-foreground">{secret.label}</span>
            <DigitSwap
              {...swap(secret)}
              glyphClassName={visible ? "text-foreground" : "text-muted-foreground"}
              suffixLength={secret.value.includes("@") ? secret.value.length - secret.value.indexOf("@") : 0}
              suffixClassName="text-foreground"
              className="min-w-0 truncate font-mono text-[11px] sm:text-xs"
            />
          </span>
        </span>
      </motion.span>
    </div>
  );
}
