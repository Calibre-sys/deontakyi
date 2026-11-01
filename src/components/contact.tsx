import { ArrowUpRight, Check, Copy, Mail, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ActionSwapButton } from "@/components/motion/action-swap";
import { PROFILE, REFERENCES } from "@/data";
import { Reveal, Serif } from "./ui";

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-border">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_bottom,black_10%,transparent_65%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span className="text-primary">07</span> — Contact
          </p>
          <h2 className="max-w-4xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-7xl">
            Got a hard problem? <Serif>Let's work on it.</Serif>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            I'm open to ML engineering, software and research work. The fastest way to reach me is email.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${PROFILE.email}`}
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-base font-medium text-background transition-transform active:scale-[0.97]"
          >
            <Mail className="size-4" /> Email me
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <CopyEmail />
        </Reveal>

        <Reveal delay={0.15} className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3">
          <ContactTile icon={<Phone className="size-4" />} label="Phone" value={PROFILE.phone} href={PROFILE.phoneHref} />
          <ContactTile icon={<GithubIcon />} label="GitHub" value="Calibre-sys" href={PROFILE.github} external />
          <ContactTile icon={<LinkedinIcon />} label="LinkedIn" value={PROFILE.name} href={PROFILE.linkedin} external />
        </Reveal>

        <Reveal delay={0.2} className="mt-10">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">References</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {REFERENCES.map((ref) => (
              <li key={ref.name} className="rounded-2xl border border-border p-4">
                <p className="font-medium">{ref.name}</p>
                <p className="text-sm text-muted-foreground">{ref.role}</p>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">Contact details available on request.</p>
        </Reveal>

        <footer className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <span className="font-mono">Accra, Ghana · Built with React & Motion</span>
        </footer>
      </div>
    </section>
  );
}

function ContactTile({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
      className="group flex items-center gap-3 bg-background p-5 transition-colors hover:bg-card"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-card text-muted-foreground ring-1 ring-border group-hover:text-foreground">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="block truncate text-sm font-medium">{value}</span>
      </span>
      <ArrowUpRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

function CopyEmail() {
  const [state, setState] = useState<"idle" | "done">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <ActionSwapButton
      variant="outline"
      size="lg"
      cycle={false}
      value={state}
      items={[
        { id: "idle", label: PROFILE.email, icon: <Copy className="size-4" />, ariaLabel: `Copy ${PROFILE.email}` },
        { id: "done", label: "Copied to clipboard", icon: <Check className="size-4" /> },
      ]}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(PROFILE.email);
          setState("done");
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setState("idle"), 1800);
        } catch {
          window.location.href = `mailto:${PROFILE.email}`;
        }
      }}
    />
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}
