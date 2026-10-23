import { expect, it } from "vitest";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import fragments, { expandFragments } from "./fragments.mjs";
import remark from "./remark.mjs";
import highlight from "./highlight.mjs";
import search from "./search.mjs";

it("compiles conditional MDX headings, tables, code placeholders and nested fragments", async () => {
  const source =
    "export const enabled = true;\n\n{enabled ? (<MDX>\n  ## Active\n\n  | Name | Value |\n  | --- | --- |\n  | A | B |\n\n  ```bash\n  git clone <repository-url> <project-root>\n  ```\n\n  <MDX>\n    **Nested**\n  </MDX>\n</MDX>) : (<MDX>\n  ## Inactive\n</MDX>)}";
  const result = await compile(source, {
    remarkPlugins: [fragments],
    outputFormat: "function-body",
  });
  const { default: Content } = await run(String(result), runtime);
  const html = renderToStaticMarkup(<Content />);
  expect(html).toContain('<h2 id="active">Active</h2>');
  expect(html).toContain("<table>");
  expect(html).toContain("&lt;repository-url&gt;");
  expect(html).toContain("<strong>Nested</strong>");
  expect(html).not.toContain("Inactive");
});
it("does not expand MDX tags shown as code examples and enforces fragment limits", () => {
  const source = "````mdx\n<MDX>\n## Example\n</MDX>\n````\n\n`<MDX>`";
  expect(expandFragments(source)).toBe(source);
  expect(() =>
    expandFragments("<MDX>".repeat(9) + "text" + "</MDX>".repeat(9)),
  ).toThrow(/8 levels/);
  expect(() => expandFragments("<MDX>text</MDX>\n".repeat(501))).toThrow(/500/);
});
it("preserves wrap and Mermaid controls through syntax highlighting", async () => {
  const result = String(
    await compile(
      '```mermaid actions={false} placement="top-left"\nflowchart LR\n A --> B\n```\n\n```js file.js wrap\nconst value = 1;\n```',
      { remarkPlugins: [remark], rehypePlugins: [highlight] },
    ),
  );
  expect(result).toContain('"data-actions": "false"');
  expect(result).toContain('"data-placement": "top-left"');
  expect(result).toContain('"data-wrap": true');
  expect(result).toContain("file.js");
  expect(result).not.toContain('title="actions=');
});

it("exports a local index for body text, code and component titles", async () => {
  const result = await compile(
    '## Content\n\nBody needle\n\n<Card title="Card needle" />\n\n```js\nconst codeNeedle = 1;\n```',
    { remarkPlugins: [search], outputFormat: "function-body" },
  );
  const exports = await run(String(result), runtime);
  expect(exports.docsSearchText).toContain("Body needle");
  expect(exports.docsSearchText).toContain("Card needle");
  expect(exports.docsSearchText).toContain("codeNeedle");
});
