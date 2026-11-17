import { ArrowDownRight } from "lucide-react";
import { useEffect, useState } from "react";
import { CylinderCarousel } from "@/components/motion/cylinder-carousel";
import { InfiniteMasonry } from "@/components/motion/infinite-masonry";
import { useViewer } from "@/components/viewer";
import { MOMENTS } from "@/data";

/* ───────── Work reel: every artefact on one drag-to-roll cylinder ───────── */

type ReelItem = { src: string; title: string; note: string; href: string; position?: string };

const REEL: ReelItem[] = [
  { src: "/media/reschar-poster.jpg", title: "RescharAI", note: "desktop app · 2025", href: "#case-reschar" },
  { src: "/media/jag-cover.jpg", title: "J. Applied Geophysics", note: "paper · 2025", href: "#research", position: "50% 20%" },
  { src: "/media/soh-poster.jpg", title: "SOH Order Management", note: "operations software", href: "#case-soh" },
  { src: "/media/paper-waterinjectors.png", title: "SPE ATC 2026", note: "paper · causal models", href: "#research", position: "20% 30%" },
  { src: "/media/fortell-poster.jpg", title: "Fortell", note: "no-code ML web app", href: "#case-fortell" },
  { src: "/media/paper-flowunit.png", title: "Hydraulic flow units", note: "autoencoders + K-means", href: "#research", position: "18% 40%" },
  { src: "/media/atc-2026.jpg", title: "Abidjan", note: "presenting at ATC 2026", href: "#moments", position: "50% 30%" },
];

export function WorkReel() {
  const [index, setIndex] = useState(0);
  const narrow = useNarrow();
  const current = REEL[((index % REEL.length) + REEL.length) % REEL.length];
  return (
    <div className="relative">
      <div className="w-full [clip-path:inset(0_round_1.5rem)]">
        <CylinderCarousel key={narrow ? "n" : "w"} itemSize={250} height={narrow ? 250 : 330} visibleItems={narrow ? 3 : 5} variant="concave" autoRotate autoRotateSpeed={0.25} onIndexChange={setIndex} className="w-full">
          {REEL.map((item) => (
            <div key={item.title} className="relative size-full overflow-hidden rounded-[1.25rem] border border-border bg-card-2 shadow-[0_20px_40px_-24px_rgb(0_0_0/0.7)]">
              <img src={item.src} alt="" draggable={false} className="size-full object-cover" style={{ objectPosition: item.position ?? "50% 50%" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
              <p className="absolute right-3 bottom-3 left-3 hidden truncate sm:block font-mono text-[0.6875rem] tracking-[0.08em] text-white/90 uppercase" data-no-scramble>
                {item.title}
              </p>
            </div>
          ))}
        </CylinderCarousel>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.9375rem]">
          <span className="font-semibold">{current.title}</span> <span className="text-muted-foreground">· {current.note}</span>
        </p>
        <div className="flex items-center gap-4">
          <span className="kicker hidden sm:inline">drag · scroll · arrow keys</span>
          <a href={current.href} className="link inline-flex items-center gap-1 text-[0.9375rem] font-medium">
            go to it <ArrowDownRight className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

function useNarrow() {
  const query = "(max-width: 639px)";
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return narrow;
}

/* ───────── Photo wall: room to breathe, captions under each print ───────── */

export function PhotoWall() {
  const view = useViewer();
  const items = MOMENTS.map((m, i) => ({ ...m, id: `m-${i}` }));
  return (
    <InfiniteMasonry
      items={items}
      getItemKey={(m) => m.id}
      hasMore={false}
      onLoadMore={() => {}}
      minColumnWidth={260}
      maxColumns={3}
      gap={18}
      estimateSize={(m) => (m.h / m.w) * 340 + 56}
      ariaLabel="Photos from events and outreach"
      className="h-[min(46rem,85vh)] rounded-[1.5rem] border-border bg-card p-4 sm:p-5"
      renderItem={(m, i) => (
        <figure className="group">
          <button
            type="button"
            onClick={() => view({ title: "In the room", items: MOMENTS.map((x) => ({ src: x.src, caption: `${x.caption} · ${x.place}` })), start: i, download: false })}
            className="block w-full overflow-hidden rounded-xl bg-card-2"
            aria-label={`Open photo: ${m.caption}`}
          >
            <img
              src={m.src}
              alt={m.caption}
              loading="lazy"
              decoding="async"
              className="block w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              style={{ aspectRatio: `${m.w} / ${m.h}` }}
            />
          </button>
          <figcaption className="flex items-baseline justify-between gap-3 px-1 pt-2.5">
            <span className="text-[0.875rem] font-medium">{m.caption}</span>
            <span className="kicker shrink-0">{m.place}</span>
          </figcaption>
        </figure>
      )}
    />
  );
}
