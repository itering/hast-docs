import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { taskAgentApiGroups } from "./task-agent-openapi";
import { docsPages, getDocsPages } from "./catalogue";

const source = (slug: string, locale = "zh-CN") => readFileSync(
  new URL(`../../../content/docs/${locale}/${slug}.mdx`, import.meta.url), "utf8",
);

describe.each(["zh-CN", "en", "ja"] as const)("%s product documentation", (locale) => {
  const localizedPages = getDocsPages(locale);
  it("places public API documentation under AIP", () => {
    const apiPages = localizedPages.filter((page) => page.slug.startsWith("aip-api-"));
    expect(apiPages.map((page) => page.slug)).toEqual([
      "aip-api-quickstart", "aip-api-events", "aip-api-reference",
    ]);
    expect(apiPages.every((page) => page.group === "AIP" && page.subgroup === "AIP API")).toBe(true);
    expect(localizedPages.some((page) => page.slug.startsWith("task-api-"))).toBe(false);
  });
  it("registers each page and resolves prose links and section anchors", () => {
    const slugs = new Set(docsPages.map((page) => page.slug));
    expect(slugs.size).toBe(docsPages.length);
    const registry = readFileSync(new URL(`./content.${locale}.ts`, import.meta.url), "utf8");
    for (const page of localizedPages) {
      const body = source(page.slug, locale);
      expect(registry).toContain(`/${locale}/${page.slug}.mdx`);
      expect(page.toc.length).toBeGreaterThan(0);
      for (const heading of page.toc) expect(body).toContain(`id="${heading.id}"`);
      for (const match of body.matchAll(/\]\(([a-z][a-z-]*)(?:#([^)]*))?\)/g)) {
        expect(slugs.has(match[1]), `${page.slug}: ${match[1]}`).toBe(true);
        if (match[2]) {
          if (match[1] === "aip-api-reference" && !source(match[1], locale).includes(`id="${match[2]}"`)) {
            expect(["openapi", "authentication", ...taskAgentApiGroups.map(([id]) => id)]).toContain(match[2]);
          } else expect(source(match[1], locale)).toContain(`id="${match[2]}"`);
        }
      }
    }
  });

  it("preserves page coverage, anchors, and technical examples across languages", () => {
    expect(localizedPages.map((page) => page.slug)).toEqual(docsPages.map((page) => page.slug));
    for (const page of localizedPages) {
      const original = source(page.slug);
      const translated = source(page.slug, locale);
      const ids = (body: string) => [...body.matchAll(/id="([^"]+)"/g)].map((match) => match[1]).sort();
      expect(ids(translated), page.slug).toEqual(ids(original));
      expect((translated.match(/^```/gm) ?? []).length, page.slug).toBe((original.match(/^```/gm) ?? []).length);
      if (locale !== "zh-CN") {
        expect(translated).not.toBe(original);
        expect(page.title).not.toBe(docsPages.find((entry) => entry.slug === page.slug)?.title);
        expect(translated).not.toContain("/zh-CN/");
      }
      if (locale === "en") expect(translated).not.toMatch(/\p{Script=Han}/u);
    }
  });

  it("keeps JSON examples valid and avoids unimplemented installation pages", () => {
    for (const page of localizedPages) {
      expect(page.slug).not.toMatch(/^(task|gtm)-(mcp|skills)(-|$)/);
      for (const match of source(page.slug, locale).matchAll(/```json\n([\s\S]*?)\n```/g)) {
        expect(() => JSON.parse(match[1]), page.slug).not.toThrow();
      }
    }
  });
});

describe("zh-CN product terminology", () => {
  it("uses the current Connectors and Secrets names", () => {
    for (const page of getDocsPages("zh-CN")) {
      const text = [page.title, ...page.toc.map((h) => h.title), source(page.slug)].join("\n");
      expect(text, page.slug).not.toMatch(/已连接应用|连接应用与设置能力/);
    }
    const secrets = getDocsPages("zh-CN").find((page) => page.slug === "aip-secrets");
    expect(secrets?.title).toBe("管理机密");
    expect(source("aip-secrets")).not.toContain("密钥");
  });
});

describe.each([
  ["zh-CN", "Profile API 密钥", /Profile (?:API key|key)|工作区 API key/],
  ["en", "Profile API key", /Workspace API key|Profile keys?\b/],
  ["ja", "Profile API キー", /Profile (?:API key|key|キー)|ワークスペース API キー/],
] as const)("%s API key terminology", (locale, name, obsolete) => {
  it("matches the creation option across the API and MCP guides", () => {
    for (const slug of ["aip-api-quickstart", "aip-api-events", "aip-api-reference", "mcp", "task-files", "task-overview"]) {
      const body = source(slug, locale);
      expect(body, slug).toContain(name);
      expect(body, slug).not.toMatch(obsolete);
    }
    const page = getDocsPages(locale).find((entry) => entry.slug === "aip-api-quickstart");
    expect(page?.toc.find((heading) => heading.id === "profile")?.title).toContain(name);
  });
});
