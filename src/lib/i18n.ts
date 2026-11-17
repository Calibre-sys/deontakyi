// Minimal stand-in for beUI's locale provider: English defaults, overridable per instance.
export function useMessages<T extends Record<string, string>>(_ns: string, defaults: T, overrides?: Partial<T>) {
  return (key: keyof T): string => (overrides?.[key] ?? defaults[key]) as string;
}
