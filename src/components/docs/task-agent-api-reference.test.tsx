import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";

vi.mock("@/lib/aip-url", () => import("../../lib/aip-url"));
vi.mock("@/content/docs/task-agent-openapi", () => import("../../content/docs/task-agent-openapi"));
vi.mock("@hast/docs/components", () => ({ CodeBlock: () => null }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

it.each(["zh-CN", "en", "ja"] as const)("links %s API key management directly to the configured AIP", async (locale) => {
  vi.resetModules();
  vi.stubGlobal("React", React);
  vi.stubEnv("NEXT_PUBLIC_AIP_URL", "https://aip.example.test/");
  vi.stubEnv("NEXT_PUBLIC_AGENT_URL", "https://agent.example.test");
  const { ApiKeyLink } = await import("./task-agent-api-reference");
  const html = renderToStaticMarkup(<ApiKeyLink locale={locale} />);
  expect(html).toContain('href="https://aip.example.test/api-keys"');
  expect(html).not.toContain("agent.example.test");
  expect(html).not.toContain("/agent/api-keys");
});
