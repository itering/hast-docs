import { isValidElement, type ComponentProps, type ReactNode } from "react";
import * as Components from "./components";
import { CodeBlock } from "./code-block";

export const docsComponents = {
  ...Components,
  p: "p" as const,
  a: "a" as const,
  ul: "ul" as const,
  ol: "ol" as const,
  li: "li" as const,
  strong: "strong" as const,
  code: "code" as const,
  Info: Components.InfoCallout,
  Column: (props: { children?: ReactNode }) => <div>{props.children}</div>,
  FileTree: Components.Tree,
  MDX: (props: { children?: ReactNode }) => <>{props.children}</>,
  pre: ({ children, ...props }: ComponentProps<"pre">) => {
    const child = isValidElement<{
      children?: ReactNode;
      className?: string;
      "data-language"?: string;
      "data-wrap"?: boolean;
      "data-actions"?: string;
      "data-placement"?:
        | "top-left"
        | "top-right"
        | "bottom-left"
        | "bottom-right";
    }>(children)
      ? children
      : null;
    const language =
      child?.props["data-language"] ??
      child?.props.className?.replace("language-", "") ??
      "text";
    return (
      <CodeBlock
        wrap={child?.props["data-wrap"]}
        actions={
          child?.props["data-actions"] === undefined
            ? undefined
            : child.props["data-actions"] === "true"
        }
        placement={child?.props["data-placement"]}
        language={language}
        title={(props as { "data-title"?: string })["data-title"]}
      >
        {child?.props.children ?? children}
      </CodeBlock>
    );
  },
  h2: ({ children, id }: ComponentProps<"h2">) => (
    <h2 id={id}>
      <a className="docs-heading-anchor" href={`#${id}`}>
        {children}
      </a>
    </h2>
  ),
  h3: ({ children, id }: ComponentProps<"h3">) => (
    <h3 id={id}>
      <a className="docs-heading-anchor" href={`#${id}`}>
        {children}
      </a>
    </h3>
  ),
};
