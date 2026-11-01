import { ChevronLeft, ChevronRight, Download, ExternalLink, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { SPRING_PANEL } from "@/lib/ease";

export type ViewerItem = { src: string; caption?: string; /** Original file to open or download, when src is only a preview. */ file?: string };
export type ViewerRequest = { title: string; items: ViewerItem[]; start?: number; download?: boolean };

const ViewerContext = createContext<(request: ViewerRequest) => void>(() => {});
export const useViewer = () => useContext(ViewerContext);

const kind = (src: string): "pdf" | "video" | "image" =>
  /\.pdf($|\?)/i.test(src) ? "pdf" : /\.(mp4|webm|mov)($|\?)/i.test(src) ? "video" : "image";

export function ViewerProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<ViewerRequest | null>(null);
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const open = useCallback((next: ViewerRequest) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setIndex(next.start ?? 0);
    setRequest(next);
  }, []);
  const close = useCallback(() => setRequest(null), []);

  const count = request?.items.length ?? 0;
  const step = useCallback((by: number) => setIndex((i) => (count ? (i + by + count) % count : 0)), [count]);

  useEffect(() => {
    if (!request) {
      returnFocus.current?.focus?.({ preventScroll: true });
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [request, close, step]);

  const item = request?.items[index];

  return (
    <ViewerContext.Provider value={open}>
      {children}
      <AnimatePresence>
        {request && item && (
          <motion.div
            key="viewer"
            role="dialog"
            aria-modal="true"
            aria-label={request.title}
            className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.18 }}
          >
            <button
              type="button"
              aria-label="Close viewer"
              tabIndex={-1}
              onClick={close}
              className="absolute inset-0 cursor-default bg-black/70"
            />
            <motion.div
              className="relative flex h-[92dvh] w-full max-w-5xl flex-col overflow-hidden bg-ground sm:h-[86vh]"
              initial={reduce ? false : { y: 40, scale: 0.97, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { y: 24, scale: 0.98, opacity: 0 }}
              transition={SPRING_PANEL}
            >
              <header className="flex items-center gap-3 px-4 py-3 sm:px-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{request.title}</p>
                  {item.caption && <p className="truncate text-small text-muted">{item.caption}</p>}
                </div>
                {count > 1 && (
                  <div className="flex items-center gap-1">
                    <IconButton label="Previous" onClick={() => step(-1)}>
                      <ChevronLeft className="size-4" />
                    </IconButton>
                    <span className="w-14 text-center text-small tabular-nums text-muted">
                      {index + 1} / {count}
                    </span>
                    <IconButton label="Next" onClick={() => step(1)}>
                      <ChevronRight className="size-4" />
                    </IconButton>
                  </div>
                )}
                {kind(item.file ?? item.src) === "pdf" && (
                  <a
                    href={item.file ?? item.src}
                    target="_blank"
                    rel="noopener"
                    aria-label="Open in new tab"
                    className="hidden size-9 items-center justify-center text-muted transition-colors hover:bg-panel-2 hover:text-ink sm:flex"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                )}
                {request.download !== false && (
                  <a
                    href={item.file ?? item.src}
                    download
                    className="btn btn-quiet min-h-10 text-small"
                  >
                    <Download className="size-3.5" /> Download
                  </a>
                )}
                <IconButton label="Close" onClick={close} buttonRef={closeRef}>
                  <X className="size-4" />
                </IconButton>
              </header>
              <div className="relative flex min-h-0 flex-1 items-center justify-center bg-panel-2">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={item.src}
                    className="flex h-full w-full items-center justify-center"
                    initial={reduce ? false : { opacity: 0, filter: "blur(6px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {kind(item.src) === "pdf" ? (
                      <div className="relative h-full w-full">
                        <iframe src={`${item.src}#view=FitH`} title={request.title} className="h-full w-full bg-white" />
                        <a
                          href={item.src}
                          target="_blank"
                          rel="noopener"
                          className="btn absolute bottom-3 left-1/2 -translate-x-1/2 sm:hidden"
                        >
                          <ExternalLink className="size-3.5" /> Open the PDF
                        </a>
                      </div>
                    ) : kind(item.src) === "video" ? (
                      <video src={item.src} controls autoPlay playsInline className="max-h-full max-w-full" />
                    ) : (
                      <img src={item.src} alt={item.caption ?? request.title} className="max-h-full max-w-full object-contain p-2 sm:p-6" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ViewerContext.Provider>
  );
}

function IconButton({
  label,
  onClick,
  children,
  buttonRef,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  buttonRef?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-10 items-center justify-center text-muted transition-colors hover:bg-panel-2 hover:text-ink"
    >
      {children}
    </button>
  );
}
