/** Embed a local search index at build time; no search service is required. */
export default function docsSearch() {
  return (tree) => {
    const parts = [];
    function visit(node) {
      if (["text", "code", "inlineCode"].includes(node.type))
        parts.push(node.value);
      for (const attribute of node.attributes ?? []) {
        if (
          ["title", "name", "label", "description"].includes(attribute.name) &&
          typeof attribute.value === "string"
        )
          parts.push(attribute.value);
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(tree);
    const value = parts.join(" ").replace(/\s+/g, " ").trim();
    tree.children.push({
      type: "mdxjsEsm",
      value: `export const docsSearchText = ${JSON.stringify(value)};`,
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ExportNamedDeclaration",
              specifiers: [],
              source: null,
              declaration: {
                type: "VariableDeclaration",
                kind: "const",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: { type: "Identifier", name: "docsSearchText" },
                    init: { type: "Literal", value },
                  },
                ],
              },
            },
          ],
        },
      },
    });
  };
}
