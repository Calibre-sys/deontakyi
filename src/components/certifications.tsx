import { ArrowUpRight, Award, Download } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { ArcPicker } from "@/components/motion/arc-picker";
import { useViewer } from "@/components/viewer";
import { CERTS } from "@/data";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { Pill, Reveal, Section, Serif } from "./ui";

function useMinWidth(px: number) {
  const query = `(min-width: ${px}px)`;
  const [match, setMatch] = useState(() => typeof window !== "undefined" && matchMedia(query).matches);
  useEffect(() => {
    const list = matchMedia(query);
    const onChange = () => setMatch(list.matches);
    onChange();
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);
  return match;
}

const OPTIONS = CERTS.map((cert) => ({ value: cert.id, label: cert.short }));
const byIssuer = (issuer: string) => CERTS.filter((cert) => cert.issuer === issuer).length;

export function Certifications() {
  const [selected, setSelected] = useState(CERTS[0].id);
  const wide = useMinWidth(1024);
  const reduce = useReducedMotion();
  const view = useViewer();
  const cert = CERTS.find((c) => c.id === selected) ?? CERTS[0];
  const index = CERTS.indexOf(cert);

  const openCert = () =>
    view({
      title: "Certificates",
      items: CERTS.map((c) => ({ src: c.preview, file: c.pdf, caption: `${c.title} · ${c.issuer} · ${c.date}` })),
      start: index,
    });

  return (
    <Section
      id="certifications"
      index="02"
      eyebrow="Certifications"
      title={
        <>
          Seven certificates. <Serif>All verifiable.</Serif>
        </>
      }
      intro={
        <>
          Deep learning, time series, LLM apps and core ML, from DataCamp ({byIssuer("DataCamp")}) and 365 Data Science (
          {byIssuer("365 Data Science")}). {wide ? "Scroll or drag the arc" : "Swipe the arc"} to flip through them, and open any certificate to see the original.
        </>
      }
    >
      <Reveal>
        <div className="grid overflow-hidden rounded-[2rem] border border-border bg-card/50 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="relative border-b border-border p-4 sm:p-6 lg:border-r lg:border-b-0">
            <p className="mb-2 flex items-center gap-2 px-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              <Award className="size-3.5" /> {String(index + 1).padStart(2, "0")} / {String(CERTS.length).padStart(2, "0")}
            </p>
            <ArcPicker
              aria-label="Choose a certificate"
              options={OPTIONS}
              value={selected}
              onValueChange={setSelected}
              side="right"
              radius={wide ? 420 : 300}
              itemHeight={wide ? 58 : 48}
              visibleCount={wide ? 7 : 3}
              className="[&_[data-slot=arc-picker-option]]:text-xl sm:[&_[data-slot=arc-picker-option]]:text-2xl"
            />
          </div>

          <div className="relative flex flex-col gap-5 p-5 sm:p-8">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.button
                key={cert.id}
                type="button"
                onClick={openCert}
                aria-label={`Open ${cert.title} certificate`}
                initial={reduce ? false : { opacity: 0, y: 16, rotate: -1.5, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, rotate: 0, filter: "blur(0px)" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, rotate: 1, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
                whileHover={reduce ? undefined : { y: -4 }}
                className="group relative block overflow-hidden rounded-2xl border border-border bg-white shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)]"
              >
                <img src={cert.preview} alt="" className="h-auto w-full" />
                <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  View full certificate <ArrowUpRight className="size-3.5" />
                </span>
              </motion.button>
            </AnimatePresence>

            <motion.div layout transition={SPRING_LAYOUT} className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Pill className={cn(cert.issuer === "DataCamp" ? "border-success/30 text-success" : "border-violet/30 text-violet")}>
                  {cert.issuer}
                </Pill>
                <Pill>{cert.date}</Pill>
                {cert.length && <Pill>{cert.length}</Pill>}
              </div>
              <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{cert.title}</h3>
              <div className="flex flex-wrap gap-1.5">
                {cert.skills.map((skill) => (
                  <span key={skill} className="rounded-md bg-background px-2 py-0.5 font-mono text-xs text-muted-foreground ring-1 ring-border">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={openCert}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-85"
                >
                  Open certificate
                </button>
                <a
                  href={cert.pdf}
                  download
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-card"
                >
                  <Download className="size-4" /> PDF
                </a>
                <span className="ml-auto font-mono text-xs text-muted-foreground">ID {cert.credential}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <ul className="scrollbar-hide -mx-4 mt-6 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0 lg:grid-cols-7">
          {CERTS.map((c) => (
            <li key={c.id} className="w-36 shrink-0 snap-start sm:w-auto">
              <button
                type="button"
                onClick={() => setSelected(c.id)}
                aria-pressed={c.id === selected}
                className={cn(
                  "group block w-full overflow-hidden rounded-xl border bg-white text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5",
                  c.id === selected ? "border-primary shadow-[0_0_0_1px_var(--primary)]" : "border-border",
                )}
              >
                <img src={c.preview} alt="" loading="lazy" className="aspect-[16/10] w-full bg-white object-contain" />
                <span className="block truncate border-t border-border bg-background px-2.5 py-2 text-xs font-medium text-foreground">{c.short}</span>
              </button>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
