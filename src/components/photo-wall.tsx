import { InfiniteMasonry } from "@/components/motion/infinite-masonry";
import { useViewer } from "@/components/viewer";
import { MOMENTS } from "@/data";

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
            onClick={() => view({ title: "Photos", items: MOMENTS.map((x) => ({ src: x.src, caption: x.caption })), start: i, download: false })}
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
          <figcaption className="px-1 pt-2.5 text-[0.875rem] text-muted-foreground">{m.caption}</figcaption>
        </figure>
      )}
    />
  );
}
