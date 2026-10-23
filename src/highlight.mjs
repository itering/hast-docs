import rehypePrettyCode from "rehype-pretty-code";
import { createHighlighter } from "shiki";

// MDX embeds TSX and fenced languages but does not load them automatically.
// Load them before tokenizing so JSX attributes and nested examples get colors.
/** @returns {ReturnType<typeof rehypePrettyCode>} */
export default function docsHighlight() {
  const transform = rehypePrettyCode({
    theme: { light: "github-light-default", dark: "dark-plus" },
    keepBackground: false,
    getHighlighter: (options) =>
      createHighlighter({
        ...options,
        langs: [
          ...new Set([
            ...(options.langs ?? []),
            "mdx",
            "tsx",
            "jsx",
            "html",
            "javascript",
            "typescript",
            "java",
            "python",
            "bash",
            "json",
            "css",
            "yaml",
          ]),
        ],
      }),
  });
  return async (tree, file) => {
    const saved = [];
    function collect(node) {
      if (node.tagName === "pre" && node.children?.[0]?.tagName === "code") {
        const props = node.children[0].properties ?? {};
        const attrs = Object.fromEntries(
          Object.entries(props).filter(([key]) =>
            ["data-wrap", "data-actions", "data-placement"].includes(key),
          ),
        );
        if (Object.keys(attrs).length) saved.push([node, attrs]);
      }
      for (const child of node.children ?? []) collect(child);
    }
    collect(tree);
    await transform(tree, file);
    for (const [node, attrs] of saved) {
      const pre =
        node.tagName === "pre"
          ? node
          : node.children?.find((child) => child.tagName === "pre");
      const code = pre?.children?.find((child) => child.tagName === "code");
      if (code) Object.assign(code.properties, attrs);
    }
  };
}
