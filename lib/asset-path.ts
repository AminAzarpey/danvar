const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** next/image does not prefix string src values with basePath; do it explicitly. */
export function assetPath(path: string) {
  return basePath + path;
}
