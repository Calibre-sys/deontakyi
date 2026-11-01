import { ArrowUpRight, Lock, Play, TrendingUp } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useRef } from "react";
import { CARD_TARGET_CLASS, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/motion/card";
import { useViewer } from "@/components/viewer";
import { PROJECTS, type Project } from "@/data";
import { cn } from "@/lib/utils";
import { Reveal, Section, Serif } from "./ui";

export function Work() {
  return (
    <Section
      id="work"
      index="03"
      eyebrow="Selected work"
      title={
        <>
          Software that <Serif>replaced</Serif> manual work.
        </>
      }
      intro="Some of these run inside companies and can't be shared publicly, so I've recorded short demos. Hover a card to preview it, or click to watch."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {PROJECTS.map((project, i) => (
          <Reveal
            key={project.id}
            delay={(i % 3) * 0.06}
            className={cn(i < 2 ? "lg:col-span-3" : "lg:col-span-2", i === PROJECTS.length - 1 && "md:col-span-2 lg:col-span-2")}
          >
            <ProjectCard project={project} large={i < 2} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ProjectCard({ project, large }: { project: Project; large: boolean }) {
  const view = useViewer();
  const reduce = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);

  const play = () => {
    if (reduce || !video.current) return;
    void video.current.play().catch(() => {});
  };
  const pause = () => video.current?.pause();
  const open = () => project.video && view({ title: `${project.name} — demo`, items: [{ src: project.video }] });

  return (
    <Card
      interactive={Boolean(project.video)}
      className="h-full overflow-hidden pt-0"
      onPointerEnter={play}
      onPointerLeave={pause}
    >
      <div className={cn("relative overflow-hidden border-b border-border bg-card", large ? "aspect-[16/9]" : "aspect-[16/10]")}>
        {project.video ? (
          <>
            <video
              ref={video}
              src={`${project.video}#t=1`}
              muted
              loop
              playsInline
              preload="metadata"
              className="size-full object-cover"
            />
            <span className="glass pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium">
              <Play className="size-3 fill-current" /> Watch demo
            </span>
          </>
        ) : (
          <Placeholder name={project.name} />
        )}
        {project.private && (
          <span className="glass pointer-events-none absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] text-muted-foreground">
            <Lock className="size-3" /> Private build
          </span>
        )}
      </div>

      <CardHeader>
        <CardTitle as="h3" className="text-lg">
          {project.video ? (
            <button type="button" onClick={open} className={cn("text-left outline-none", CARD_TARGET_CLASS)}>
              {project.name}
            </button>
          ) : (
            project.name
          )}
        </CardTitle>
        <CardDescription>{project.blurb}</CardDescription>
      </CardHeader>

      {project.impact && (
        <CardContent>
          <p className="inline-flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2 text-sm font-medium text-success">
            <TrendingUp className="size-4 shrink-0" /> {project.impact}
          </p>
        </CardContent>
      )}

      <CardFooter className="mt-auto flex-wrap">
        {project.stack.map((item) => (
          <span key={item} className="rounded-md bg-card px-2 py-0.5 font-mono text-xs text-muted-foreground ring-1 ring-border">
            {item}
          </span>
        ))}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener"
            className="relative z-10 ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Live site <ArrowUpRight className="size-3.5" />
          </a>
        )}
      </CardFooter>
    </Card>
  );
}

function Placeholder({ name }: { name: string }) {
  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden">
      <div aria-hidden className="grid-lines absolute inset-0" />
      <div
        aria-hidden
        className="absolute size-48 rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
      />
      <span className="relative font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{name}</span>
    </div>
  );
}
