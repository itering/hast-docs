/** Preserve fence filenames, wrapping, highlights and Mermaid controls. */
export default function docsRemark() {
  return (tree) => {
    function visit(node) {
      if (node.type === "code" && node.meta) {
        const meta = node.meta;
        const props = {};
        if (/(?:^|\s)wrap(?=\s|$)/.test(meta)) props["data-wrap"] = true;
        const actions = meta.match(/\bactions=(?:\{|["'])?(true|false)/)?.[1];
        const placement = meta.match(
          /\bplacement=["'](top-left|top-right|bottom-left|bottom-right)["']/,
        )?.[1];
        if (actions) props["data-actions"] = actions;
        if (placement) props["data-placement"] = placement;
        node.data = {
          ...node.data,
          hProperties: { ...node.data?.hProperties, ...props },
        };
        const highlights = meta.match(/highlight=["']?([\d,-]+)/)?.[1];
        const title = meta
          .replace(/(?:^|\s)wrap(?=\s|$)/g, "")
          .replace(/actions=(?:\{|["'])?(?:true|false)(?:\}|["'])?/g, "")
          .replace(/placement=["'][^"']+["']/g, "")
          .replace(/highlight=["']?[\d,-]+["']?/, "")
          .trim();
        node.meta = [
          title && !title.startsWith("{") && !/\btitle=/.test(title)
            ? `title=${JSON.stringify(title)}`
            : title,
          highlights ? `{${highlights}}` : "",
        ]
          .filter(Boolean)
          .join(" ");
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(tree);
  };
}
