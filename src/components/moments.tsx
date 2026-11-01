import { Maximize2 } from "lucide-react";
import { InfiniteMasonry } from "@/components/motion/infinite-masonry";
import { useViewer } from "@/components/viewer";
import { MOMENTS } from "@/data";
import { Reveal, Section, Serif } from "./ui";

const noop = () => {};

export function Moments() {
  const view = useViewer();
  const open = (index: number) =>
    view({ title: "Events & outreach", items: MOMENTS.map((m) => ({ src: m.src, caption: m.title })), start: index, download: false });

  return (
    <Section
      id="events"
      index="06"
      eyebrow="Events & outreach"
      title={
        <>
          Off the screen, <Serif>in the room.</Serif>
        </>
      }
      intro="Conferences, pitch programs and teaching energy basics in schools with SPE Energy4me."
    >
      <Reveal>
        <InfiniteMasonry
          items={MOMENTS}
          getItemKey={(item) => item.id}
          onLoadMore={noop}
          hasMore={false}
          minColumnWidth={240}
          maxColumns={3}
          gap={12}
          ariaLabel="Event photos"
          estimateSize={(item) => Math.round((300 * item.h) / item.w) + 60}
          className="h-[min(40rem,78vh)] bg-card/40"
          renderItem={(item, index) => (
            <button
              type="button"
              onClick={() => open(index)}
              className="group block w-full overflow-hidden rounded-2xl border border-border bg-background text-left"
            >
              <span className="relative block overflow-hidden">
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  style={{ aspectRatio: `${item.w} / ${item.h}` }}
                  className="w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
                />
                <span className="glass absolute top-2 right-2 flex size-8 items-center justify-center rounded-full border opacity-0 transition-opacity group-hover:opacity-100">
                  <Maximize2 className="size-3.5" />
                </span>
              </span>
              <span className="flex items-start justify-between gap-3 p-3">
                <span className="text-sm font-medium">{item.title}</span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{item.tag}</span>
              </span>
            </button>
          )}
        />
      </Reveal>
    </Section>
  );
}
