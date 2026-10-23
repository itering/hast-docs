import { Children, isValidElement, type ReactNode } from "react";
export type IconValue = string | ReactNode;
export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/[\s_]+/g, "-");
}
export { Icon } from "./icon";
export function Inline({ children }: { children?: ReactNode }) {
  if (typeof children !== "string") return <>{children}</>;
  return (
    <>
      {children
        .split(/(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
        .map((part, i) => {
          if (part.startsWith("**"))
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          if (part.startsWith("*") || part.startsWith("_"))
            return <em key={i}>{part.slice(1, -1)}</em>;
          if (part.startsWith("`"))
            return <code key={i}>{part.slice(1, -1)}</code>;
          const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (link && /^(https?:|\/|#)/.test(link[2]))
            return (
              <a key={i} href={link[2]}>
                {link[1]}
              </a>
            );
          return part;
        })}
    </>
  );
}
export function plainText(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number")
        return String(child);
      if (!isValidElement<{ children?: ReactNode }>(child)) return "";
      if (child.type === "br") return "\n";
      const text = plainText(child.props.children);
      return typeof child.type === "string" &&
        /^(p|li|pre|h[1-6]|blockquote)$/.test(child.type)
        ? `${text}\n`
        : text;
    })
    .join("");
}

// Preserve code whitespace; plainText adds separators for prose blocks.
export function codeText(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) =>
      typeof child === "string" || typeof child === "number"
        ? String(child)
        : isValidElement<{ children?: ReactNode }>(child)
          ? codeText(child.props.children)
          : "",
    )
    .join("");
}
