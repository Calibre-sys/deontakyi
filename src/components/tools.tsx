import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import * as Icons from "simple-icons";
import { cn } from "@/lib/utils";

/*
 * Tools hang off the thing they were used for: small logo charms on strings that sway, swing when
 * you touch them, and show their name. `rod` draws the bar they hang from when there is no edge
 * above them (for example beside a row of text).
 */

export const TOOLS = {
  python: { name: "Python", icon: Icons.siPython },
  pytorch: { name: "PyTorch", icon: Icons.siPytorch },
  tensorflow: { name: "TensorFlow", icon: Icons.siTensorflow },
  keras: { name: "Keras", icon: Icons.siKeras },
  sklearn: { name: "scikit-learn", icon: Icons.siScikitlearn },
  pandas: { name: "pandas", icon: Icons.siPandas },
  numpy: { name: "NumPy", icon: Icons.siNumpy },
  jupyter: { name: "Jupyter", icon: Icons.siJupyter },
  fastapi: { name: "FastAPI", icon: Icons.siFastapi },
  langchain: { name: "LangChain", icon: Icons.siLangchain },
  javascript: { name: "JavaScript", icon: Icons.siJavascript },
  react: { name: "React", icon: Icons.siReact },
  node: { name: "Node.js", icon: Icons.siNodedotjs },
  appsscript: { name: "Apps Script", icon: Icons.siGoogleappsscript },
  sheets: { name: "Google Sheets", icon: Icons.siGooglesheets },
  git: { name: "Git", icon: Icons.siGit },
  github: { name: "GitHub", icon: Icons.siGithub },
  autocad: { name: "AutoCAD", icon: Icons.siAutocad },
} as const;

export type ToolKey = keyof typeof TOOLS;

// String lengths and sway timings vary per position so neighbours never move in step.
const LENGTHS = [22, 40, 14, 32, 26, 46];
const PERIODS = [3.1, 3.7, 2.8, 4.2, 3.4, 3.9];

export function HangingTools({
  tools,
  rod = false,
  size = 36,
  align = "end",
  className,
}: {
  tools: readonly ToolKey[];
  rod?: boolean;
  size?: number;
  align?: "start" | "center" | "end";
  className?: string;
}) {
  if (!tools.length) return null;
  const names = tools.map((t) => TOOLS[t].name).join(", ");
  return (
    <div className={cn("relative", className)}>
      {rod && <div aria-hidden className="h-[3px] rounded-full bg-border-strong" />}
      <ul
        aria-label={`Tools used: ${names}`}
        className={cn(
          "flex gap-2.5 px-2",
          align === "start" && "justify-start",
          align === "center" && "justify-center",
          align === "end" && "justify-end",
        )}
      >
        {tools.map((key, i) => (
          <Charm key={key} tool={key} index={i} size={size} />
        ))}
      </ul>
    </div>
  );
}

function Charm({ tool, index, size }: { tool: ToolKey; index: number; size: number }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const { name, icon } = TOOLS[tool];
  const length = LENGTHS[index % LENGTHS.length];
  const period = PERIODS[index % PERIODS.length];

  return (
    <li className="relative" style={{ width: size }}>
      {/* Idle sway around the top of the string. */}
      <div
        className="origin-top"
        style={
          reduce
            ? undefined
            : { animation: `charm-sway ${period}s ease-in-out ${-index * 0.7}s infinite alternate` }
        }
      >
        {/* A damped swing when touched. */}
        <motion.div
          className="flex origin-top flex-col items-center"
          onHoverStart={() => setHover(true)}
          onHoverEnd={() => setHover(false)}
          onTapStart={() => setHover(true)}
          whileHover={reduce ? undefined : { rotate: [0, 16, -11, 7, -4, 2, 0], transition: { duration: 1.6, ease: "easeOut" } }}
          whileTap={reduce ? undefined : { rotate: [0, -14, 9, -5, 2, 0], transition: { duration: 1.2, ease: "easeOut" } }}
        >
          <span aria-hidden className="w-px bg-muted-foreground/70" style={{ height: length }} />
          <span aria-hidden className="-mb-[3px] size-[5px] rounded-full bg-muted-foreground/80" />
          <span
            role="img"
            aria-label={name}
            title={name}
            className="flex items-center justify-center rounded-full border border-border-strong bg-card shadow-[0_6px_14px_-6px_rgb(0_0_0/0.45)] transition-colors duration-300"
            style={{ width: size, height: size, ["--brand" as string]: `#${icon.hex}` }}
          >
            <svg viewBox="0 0 24 24" aria-hidden className={cn("transition-[fill] duration-300", hover ? "fill-[var(--brand)]" : "fill-foreground")} style={{ width: size * 0.5, height: size * 0.5 }}>
              <path d={icon.path} />
            </svg>
          </span>
        </motion.div>
      </div>
      {/* Name tag. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 rounded-md bg-foreground px-2 py-0.5 text-[0.75rem] font-medium whitespace-nowrap text-background transition-[opacity,transform] duration-200",
          hover ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
        )}
        style={{ top: length + size + 10 }}
      >
        {name}
      </span>
    </li>
  );
}
