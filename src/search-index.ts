const indexes = new Map<string, Promise<Record<string, string>>>();

/** Share in-flight and completed loads across documentation pages. Retry failures. */
export function loadDocsSearchIndex(url: string): Promise<Record<string, string>> {
  const existing = indexes.get(url);
  if (existing) return existing;
  const request = fetch(url).then(async (response) => {
    if (!response.ok) throw new Error("Search index unavailable");
    const value: unknown = await response.json();
    if (!value || typeof value !== "object" || Array.isArray(value) ||
      !Object.values(value).every((text) => typeof text === "string")) {
      throw new Error("Invalid search index");
    }
    return value as Record<string, string>;
  }).catch((error: unknown) => {
    indexes.delete(url);
    throw error;
  });
  indexes.set(url, request);
  return request;
}
