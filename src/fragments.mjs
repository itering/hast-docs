import { compileSync } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import docsRemark from "./remark.mjs";

// Find literal MDX tags outside Markdown fences and inline code. This happens
// before remark-mdx parses expressions, so code placeholders remain Markdown.
function tags(source) {
  const found = [];
  let fence = null,
    offset = 0;
  for (const line of source.split(/(?<=\n)/)) {
    const match = line.match(/^\s*(`{3,}|~{3,})/);
    if (match) {
      if (!fence) fence = match[1];
      else if (match[1][0] === fence[0] && match[1].length >= fence.length)
        fence = null;
      offset += line.length;
      continue;
    }
    if (!fence) {
      const pattern = /(`+)([\s\S]*?)\1|<MDX\s*>|<\/MDX\s*>/g;
      for (const token of line.matchAll(pattern))
        if (!token[1])
          found.push({
            start: offset + token.index,
            end: offset + token.index + token[0].length,
            close: token[0].startsWith("</"),
          });
    }
    offset += line.length;
  }
  return found;
}
function dedent(value) {
  const lines = value
    .replace(/^\s*\n/, "")
    .replace(/\n\s*$/, "")
    .split("\n");
  const indent = Math.min(
    ...lines
      .filter((line) => line.trim())
      .map((line) => line.match(/^\s*/)[0].length),
  );
  return lines
    .map((line) => line.slice(Number.isFinite(indent) ? indent : 0))
    .join("\n");
}
export function expandFragments(source, depth = 0, count = { value: 0 }) {
  const tokens = tags(source);
  let result = "",
    cursor = 0;
  for (let i = 0; i < tokens.length; i++) {
    const opening = tokens[i];
    if (opening.close) continue;
    if (depth >= 8)
      throw new Error("MDX fragments cannot be nested more than 8 levels");
    if (++count.value > 500)
      throw new Error("A page cannot contain more than 500 MDX fragments");
    let nesting = 1,
      j = i + 1;
    for (; j < tokens.length; j++) {
      nesting += tokens[j].close ? -1 : 1;
      if (nesting === 0) break;
    }
    if (nesting) throw new Error("Unclosed MDX fragment");
    const closing = tokens[j];
    const fragmentId = count.value;
    const inner = expandFragments(
      dedent(source.slice(opening.end, closing.start)),
      depth + 1,
      count,
    );
    let compiled = String(
      compileSync(inner, {
        jsx: true,
        outputFormat: "function-body",
        remarkPlugins: [remarkGfm, docsRemark],
        rehypePlugins: [rehypeSlug],
      }),
    );
    compiled = compiled.replace(
      /return \{\s*default: MDXContent\s*\};/,
      "return _createMdxContent(props);",
    );
    compiled = compiled
      .replace(/\b_createMdxContent\b/g, `_renderFragment${fragmentId}`)
      .replace(/\bMDXContent\b/g, `FragmentContent${fragmentId}`)
      .replace(/\bMDXLayout\b/g, `FragmentLayout${fragmentId}`)
      .replace(/\b_missingMdxReference\b/g, `_missingFragment${fragmentId}`);
    result +=
      source.slice(cursor, opening.start) +
      `<>{(() => {\n${compiled}\n})()}</>`;
    cursor = closing.end;
    i = j;
  }
  return result + source.slice(cursor);
}
/** @type {import("unified").Plugin} */
const docsFragments = function () {
  const parser = this.parser;
  if (!parser) throw new Error("MDX fragments require a Markdown parser");
  this.parser = (source, file) => parser(expandFragments(source), file);
};
export default docsFragments;
