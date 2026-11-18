import { InfiniteMasonry } from "@/components/motion/infinite-masonry";
import { useViewer } from "@/components/viewer";
import { MOMENTS } from "@/data";

/* ───────── Photo wall: masonry of event photos with captions ───────── */

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
      className="h-auto rounded-none border-0 bg-transparent p-0"
      renderItem={(m, i) => (
        <figure className="group">
          <button
            type="button"
            onClick={() => view({ title: "Photos", items: MOMENTS.map((x) => ({ src: x.src, caption: x.caption })), start: i, download: false })}
            className="block w-full overflow-hidden rounded-xl bg-card-2 transition-opacity duration-300 hover:opacity-90"
            aria-label={`Open photo: ${m.caption}`}
          >
            <img
              src={m.src}
              alt={m.caption}
              loading="lazy"
              decoding="async"
              className="block w-full object-cover"
              style={{ aspectRatio: `${m.w} / ${m.h}` }}
            />
          </button>
          <figcaption className="px-1 pt-2.5 text-[0.875rem] text-muted-foreground">{m.caption}</figcaption>
        </figure>
      )}
    />
  );
}
