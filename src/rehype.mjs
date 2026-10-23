/** Expose fence titles to both code panels and their enclosing tab group. */
export default function docsRehype() {
  return (tree) => {
    const text = (node) =>
      node.type === "text"
        ? node.value
        : (node.children ?? []).map(text).join("");
    function visit(node) {
      if (
        node.tagName === "figure" &&
        node.properties?.["data-rehype-pretty-code-figure"] !== undefined
      ) {
        const caption = node.children.find(
          (child) => child.tagName === "figcaption",
        );
        const pre = node.children.find((child) => child.tagName === "pre");
        if (caption && pre) {
          const title = text(caption);
          node.properties["data-title"] = title;
          pre.properties["data-title"] = title;
          node.children = node.children.filter((child) => child !== caption);
        }
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(tree);
  };
}
