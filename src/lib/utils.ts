import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The page's type steps (text-small … text-head) are font sizes, not colours.
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["small", "body", "lead", "head"] }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
