import { FileText, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/motion/theme-toggle";
import { useViewer } from "@/components/viewer";
import { PROFILE } from "@/data";
import { SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#research", label: "Research" },
  { href: "#certifications", label: "Certifications" },
  { href: "#work", label: "Work" },
  { href: "#bookshelf", label: "Bookshelf" },
  { href: "#journey", label: "Journey" },
  { href: "#contact", label: "Contact" },
];

function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const sections = LINKS.map((link) => document.querySelector(link.href)).filter(Boolean) as Element[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return active;
}

export function Header() {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const view = useViewer();
  const openCv = () => view({ title: `Curriculum Vitae — ${PROFILE.name}`, items: [{ src: PROFILE.cv }] });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <div
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center gap-2 rounded-full border px-2 pl-4 transition-[background-color,border-color,box-shadow] duration-300",
          scrolled || open ? "glass shadow-[0_8px_30px_-12px_rgb(0_0_0/0.18)]" : "border-transparent",
        )}
      >
        <a href="#top" className="mr-auto flex items-center gap-2.5 font-semibold tracking-tight" aria-label="Back to top">
          <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background">DT</span>
          <span className="hidden text-sm sm:inline">Deon Takyi-Amponsem</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-full px-3 py-1.5 text-sm transition-colors",
                active === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active === link.href && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-card ring-1 ring-border"
                  transition={SPRING_LAYOUT}
                />
              )}
              {link.label}
            </a>
          ))}
        </nav>

        <ThemeToggle
          variant="circle-blur"
          start="top-right"
          className="size-9 rounded-full text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          iconClassName="size-4"
        />
        <button
          type="button"
          onClick={openCv}
          className="hidden h-9 items-center gap-1.5 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-85 sm:flex"
        >
          <FileText className="size-3.5" /> CV
        </button>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-card hover:text-foreground lg:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            className="glass mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border p-2 lg:hidden"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={SPRING_LAYOUT}
          >
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-base hover:bg-card"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openCv();
              }}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-base font-medium text-background"
            >
              <FileText className="size-4" /> Read my CV
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
