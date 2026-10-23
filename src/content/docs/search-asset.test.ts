import { describe, expect, it, vi } from "vitest";
const source = vi.hoisted(() => ({ text: "body-only search phrase" }));
vi.mock("./content", () => ({
  getDocsContent: async (locale: string) => ({ docsSearchIndex: { overview: `${locale} ${source.text}` } }),
}));
import { getDocsSearchAsset } from "./search-asset";
import { generateStaticParams, GET } from "../../../app/docs-search/[file]/route";

describe("static localized search assets", () => {
  it("generates three versioned JSON files and serves immutable content", async () => {
    const params = await generateStaticParams();
    expect(params).toHaveLength(3);
    for (const param of params) {
      expect(param.file).toMatch(/^(en|ja|zh-CN)\.[a-f0-9]{64}\.json$/);
      const response = await GET(new Request("https://example.test"), { params: Promise.resolve(param) });
      expect(response.headers.get("Cache-Control")).toContain("immutable");
      expect(response.headers.get("Content-Type")).toContain("application/json");
      expect(await response.json()).toEqual({ overview: `${param.file.split(".")[0]} ${source.text}` });
    }
  });
  it("changes the URL with content and rejects unknown versions", async () => {
    const old = await getDocsSearchAsset("en");
    source.text = "updated text";
    expect((await getDocsSearchAsset("en")).file).not.toBe(old.file);
    for (const file of [old.file, "unknown.json"]) {
      expect((await GET(new Request("https://example.test"), { params: Promise.resolve({ file }) })).status).toBe(404);
    }
  });
});
