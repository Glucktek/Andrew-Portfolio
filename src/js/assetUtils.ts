// Utility to resolve asset alias strings (e.g., "@images/resume/foo.png")
// to a usable URL at runtime in Astro components that receive JSON data.
// Note: This only supports known alias prefixes defined in tsconfig/astro config.

const ALIAS_PREFIXES = ["@images/", "@assets/", "@/", "@icons/"] as const;

type AliasPrefix = (typeof ALIAS_PREFIXES)[number];

function isAliasPath(path: string): path is `${AliasPrefix}${string}` {
  return ALIAS_PREFIXES.some((p) => path.startsWith(p));
}

function stripAlias(path: string): string {
  // Map alias to actual src-relative path roots
  if (path.startsWith("@images/"))
    return `src/assets/images/${path.slice("@images/".length)}`;
  if (path.startsWith("@assets/"))
    return `src/assets/${path.slice("@assets/".length)}`;
  if (path.startsWith("@icons/"))
    return `src/icons/${path.slice("@icons/".length)}`;
  if (path.startsWith("@/")) return `src/${path.slice(2)}`;
  return path;
}

export async function resolveAsset(path: string): Promise<string | null> {
  if (!path) return null;

  try {
    if (isAliasPath(path)) {
      const fsPath = stripAlias(path);
      const mod = await import(/* @vite-ignore */ `/${fsPath}`);
      return (mod?.default as string) ?? (mod as unknown as string);
    }

    // For already-public URLs or /public assets, return as-is
    if (path.startsWith("http") || path.startsWith("/")) return path;

    // Fallback: treat as relative to public
    const mod = await import(/* @vite-ignore */ `/${path}`);
    return (mod as unknown as { default: string }).default;
  } catch {
    return null;
  }
}

export function resolveAssetSync(path?: string | null): string | null {
  if (!path) return null;
  try {
    if (isAliasPath(path)) {
      const fsPath = stripAlias(path);
      // Dynamic import not allowed synchronously; rely on Vite's URL handling via new URL
      // Use import.meta.glob to create a map at build-time
      return null;
    }
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return null;
  } catch {
    return null;
  }
}

// Build-time map for common resume images to avoid many async imports per render
// This leverages Vite's import.meta.glob to eagerly import all resume assets
const resumeImages = import.meta.glob("/src/assets/images/resume/**/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export function resolveResumeImage(path: string): string | null {
  if (!path) return null;
  const fsPath = isAliasPath(path) ? stripAlias(path) : path;
  // Normalize to absolute with leading slash
  const abs = fsPath.startsWith("/") ? fsPath : `/${fsPath}`;
  return resumeImages[abs] ?? null;
}
