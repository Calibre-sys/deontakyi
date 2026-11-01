import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/motion/theme-toggle";
import { CHAPTERS } from "@/data";
import { cn } from "@/lib/utils";

function useActiveChapter() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    const hero = document.getElementById("top");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setActive(entry.target.id === "top" ? null : entry.target.getAttribute("data-chapter"));
        }
      },
      { rootMargin: "-50% 0px -49% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    if (hero) observer.observe(hero);
    return () => observer.disconnect();
  }, []);
  return active;
}

/**
 * The story read like a well log: a depth track down the left edge, filled as you scroll,
 * with each chapter marked at its year. On smaller screens it folds into a bar along the top.
 */
export function Rail() {
  const active = useActiveChapter();
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const current = CHAPTERS.find((c) => c.id === active);

  return (
    <>
      {/* Desktop: the depth track. */}
      <nav aria-label="Chapters" className="fixed top-0 bottom-0 left-0 z-40 hidden w-[150px] flex-col justify-between py-8 pl-[var(--gutter)] xl:flex">
        <a href="#top" className="font-display text-[1.375rem] leading-none font-extrabold uppercase">
          Deon
          <br />
          T-A
        </a>
        <div className="relative flex gap-4">
          <div className="relative w-1 shrink-0 bg-panel-2">
            <motion.div className="absolute inset-x-0 top-0 h-full origin-top bg-accent" style={{ scaleY: fill }} />
          </div>
          <ol className="grid gap-4">
            {CHAPTERS.map((chapter) => (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  aria-current={active === chapter.id ? "step" : undefined}
                  className={cn(
                    "block leading-tight transition-colors duration-300",
                    active === chapter.id ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  <span className={cn("block font-display text-[1.125rem] font-extrabold", active === chapter.id && "text-accent")}>
                    {chapter.year}
                  </span>
                  <span className="block text-small">{chapter.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
        <ThemeToggle variant="blinds" className="size-10 -translate-x-2 text-muted hover:text-ink" iconClassName="size-[18px]" />
      </nav>

      {/* Smaller screens: a bar with the current chapter and the same fill. */}
      <header className="fixed inset-x-0 top-0 z-40 bg-ground xl:hidden">
        <div className="flex h-14 items-center gap-4 px-[var(--gutter)]">
          <a href="#top" className="font-display text-[1.25rem] font-extrabold uppercase">
            Deon T-A
          </a>
          <span className="ml-auto truncate text-small text-muted" aria-live="polite">
            {current ? `${current.year}, ${current.label}` : "Accra, Ghana"}
          </span>
          <ThemeToggle variant="blinds" className="size-10 shrink-0 text-muted hover:text-ink" iconClassName="size-[18px]" />
        </div>
        <motion.div className="h-1 origin-left bg-accent" style={{ scaleX: fill }} />
      </header>
    </>
  );
}
