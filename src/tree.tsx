"use client";
import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { ChevronRight, File, Folder } from "lucide-react";
import { plainText } from "./primitives";
type Content = { children?: ReactNode; className?: string };
export function Tree({
  children,
  className = "",
  style,
}: Content & { style?: CSSProperties & { "--tree-highlight"?: string } }) {
  const root = useRef<HTMLDivElement>(null);
  const search = useRef({ text: "", time: 0 });
  useEffect(() => {
    const first = root.current?.querySelector<HTMLElement>('[role="treeitem"]');
    if (first) first.tabIndex = 0;
  }, []);
  return (
    <div
      ref={root}
      style={style}
      className={`docs-tree ${className}`}
      role="tree"
      aria-label="文件树"
      onFocus={(e) => {
        if (e.target.getAttribute("role") !== "treeitem") return;
        root.current
          ?.querySelectorAll<HTMLElement>('[role="treeitem"]')
          .forEach((el) => (el.tabIndex = el === e.target ? 0 : -1));
      }}
      onKeyDown={(e) => {
        const current = e.target as HTMLElement;
        if (current.getAttribute("role") !== "treeitem") return;
        const items = [
          ...(root.current?.querySelectorAll<HTMLElement>(
            '[role="treeitem"]',
          ) ?? []),
        ].filter((el) => !el.closest("[hidden]"));
        const index = items.indexOf(current);
        const toggle = (item: HTMLElement) =>
          item.querySelector<HTMLElement>(":scope > .docs-tree-row")?.click();
        let target: HTMLElement | undefined | null;
        switch (e.key) {
          case "ArrowDown":
            target = items[Math.min(index + 1, items.length - 1)];
            break;
          case "ArrowUp":
            target = items[Math.max(index - 1, 0)];
            break;
          case "Home":
            target = items[0];
            break;
          case "End":
            target = items.at(-1);
            break;
          case "ArrowRight":
            if (current.getAttribute("aria-expanded") === "false")
              toggle(current);
            else
              target = current.querySelector<HTMLElement>(
                '[role="group"] > [role="treeitem"]',
              );
            break;
          case "ArrowLeft":
            if (
              current.getAttribute("aria-expanded") === "true" &&
              current.dataset.openable !== "false"
            )
              toggle(current);
            else
              target =
                current.parentElement?.closest<HTMLElement>(
                  '[role="treeitem"]',
                );
            break;
          case "Enter":
          case " ":
            if (current.hasAttribute("aria-expanded")) toggle(current);
            break;
          case "*":
            [...(current.parentElement?.children ?? [])].forEach((item) => {
              if (item.getAttribute("aria-expanded") === "false")
                toggle(item as HTMLElement);
            });
            break;
          default:
            if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey)
              return;
            {
              const now = Date.now();
              search.current = {
                text:
                  (now - search.current.time < 600 ? search.current.text : "") +
                  e.key.toLowerCase(),
                time: now,
              };
              const ordered = [
                ...items.slice(index + 1),
                ...items.slice(0, index + 1),
              ];
              target = ordered.find((item) =>
                item.dataset.name
                  ?.toLowerCase()
                  .startsWith(search.current.text),
              );
            }
        }
        e.preventDefault();
        e.stopPropagation();
        target?.focus();
      }}
    >
      {treeChildren(children)}
    </div>
  );
}
function treeChildren(node: ReactNode): ReactNode {
  return Children.map(node, (child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return child;
    if (child.type === "ul" || child.type === "ol")
      return treeChildren(child.props.children);
    if (child.type !== "li") return child;
    const parts = Children.toArray(child.props.children);
    const nested = parts.filter(
      (p) => isValidElement(p) && (p.type === "ul" || p.type === "ol"),
    );
    const name = plainText(parts.filter((p) => !nested.includes(p))).trim();
    return nested.length || name.endsWith("/") ? (
      <Tree.Folder name={name} defaultOpen>
        {treeChildren(nested)}
      </Tree.Folder>
    ) : (
      <Tree.File name={name} />
    );
  });
}
Tree.Folder = function TreeFolder({
  children,
  name,
  defaultOpen = false,
  openable = true,
  highlight = false,
  className = "",
}: Content & {
  name: string;
  defaultOpen?: boolean;
  openable?: boolean;
  highlight?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const expanded = !openable || open;
  return (
    <div
      role="treeitem"
      tabIndex={-1}
      aria-expanded={expanded}
      data-name={name}
      data-openable={openable}
      data-highlight={highlight}
      className={className}
    >
      <div
        className={`docs-tree-row ${openable ? "cursor-pointer" : ""}`}
        onClick={(e) => {
          e.currentTarget.parentElement?.focus();
          if (openable) setOpen(!open);
        }}
      >
        {openable && (
          <ChevronRight
            size={14}
            style={{ transform: expanded ? "rotate(90deg)" : undefined }}
          />
        )}
        <Folder size={16} />
        {name}
      </div>
      <div role="group" hidden={!expanded}>
        {treeChildren(children)}
      </div>
    </div>
  );
};
Tree.File = function TreeFile({
  name,
  highlight = false,
  className = "",
}: {
  name: string;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div
      role="treeitem"
      tabIndex={-1}
      data-name={name}
      data-highlight={highlight}
      className={`docs-tree-file cursor-pointer ${className}`}
      onClick={(e) => e.currentTarget.focus()}
    >
      <File size={16} />
      {name}
    </div>
  );
};

export const TreeFolder = Tree.Folder;
export const TreeFile = Tree.File;
