// A tiny stand-in for `next-themes` so the beUI ThemeToggle runs on plain Vite.
// setTheme flips the `dark` class synchronously, which the view-transition
// reveal in ThemeToggle relies on to capture the "after" snapshot.
import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const KEY = "theme";
const listeners = new Set<() => void>();

function read(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function setTheme(next: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", next === "dark");
  root.style.colorScheme = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* storage can be unavailable; the class change still applies */
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTheme() {
  const resolvedTheme = useSyncExternalStore(subscribe, read, () => "light" as Theme);
  return { theme: resolvedTheme, resolvedTheme, setTheme };
}
