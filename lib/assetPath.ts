// Prefix local public-folder asset paths with the GitHub Pages basePath.
// next/image with `unoptimized: true` does NOT auto-prepend basePath,
// so anywhere we reference a file under `/public` we must do it manually.
export function assetPath(path: string): string {
  if (!path.startsWith("/")) return path;
  if (/^https?:\/\//.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}
