import { afterEach, describe, expect, it, vi } from "vitest";
import { loadDocsSearchIndex } from "./search-index";

afterEach(() => vi.unstubAllGlobals());

describe("on-demand documentation search index", () => {
  it("deduplicates loads and isolates language and content versions", async () => {
    const fetcher = vi.fn(async () => Response.json({ overview: "body text" }));
    vi.stubGlobal("fetch", fetcher);
    const first = loadDocsSearchIndex("/en.hash1.json");
    expect(loadDocsSearchIndex("/en.hash1.json")).toBe(first);
    await expect(first).resolves.toEqual({ overview: "body text" });
    await loadDocsSearchIndex("/en.hash1.json");
    expect(fetcher).toHaveBeenCalledTimes(1);
    await loadDocsSearchIndex("/ja.hash1.json");
    await loadDocsSearchIndex("/en.hash2.json");
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("allows retry after a failed response or invalid data", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(Response.json({ overview: 123 }))
      .mockResolvedValueOnce(Response.json({ overview: "recovered" }));
    vi.stubGlobal("fetch", fetcher);
    await expect(loadDocsSearchIndex("/retry.json")).rejects.toThrow("unavailable");
    await expect(loadDocsSearchIndex("/retry.json")).rejects.toThrow("Invalid");
    await expect(loadDocsSearchIndex("/retry.json")).resolves.toEqual({ overview: "recovered" });
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
});
