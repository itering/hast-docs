"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type ReactElement,
} from "react";
import { Icon, Inline, slugify, plainText, codeText, type IconValue } from "./primitives";
import { ChevronRight, X } from "lucide-react";

export function Accordion({
  children,
  title,
  description,
  defaultOpen = false,
  id,
  className = "",
  icon,
  iconType,
}: {
  children?: ReactNode;
  title: string;
  description?: string;
  defaultOpen?: boolean;
  id?: string;
  className?: string;
  icon?: IconValue;
  iconType?: string;
}) {
  const anchor = id ?? slugify(title);
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const reveal = () => {
      let hash;
      try {
        hash = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      if (hash === anchor && ref.current)
        ref.current.open = true;
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, [anchor]);
  return (
    <details
      ref={ref}
      id={anchor}
      open={defaultOpen}
      className={`docs-accordion ${className}`}
      onToggle={(event) => {
        if (event.currentTarget.open)
          history.replaceState(null, "", `#${encodeURIComponent(anchor)}`);
      }}
    >
      <summary className="cursor-pointer">
        <ChevronRight size={16} />
        {icon && <Icon icon={icon} size={18} iconType={iconType} />}
        <span>
          <Inline>{title}</Inline>
          {description && <small>{description}</small>}
        </span>
      </summary>
      <div className="docs-accordion-body">{children}</div>
    </details>
  );
}
export function Expandable({
  children,
  title = "显示子字段",
  defaultOpen = false,
  className = "",
}: {
  className?: string;
  children?: ReactNode;
  title?: string;
  defaultOpen?: boolean;
}) {
  return (
    <Accordion
      title={title}
      defaultOpen={defaultOpen}
      className={`docs-expandable ${className}`}
    >
      {children}
    </Accordion>
  );
}
export function Tab({
  children,
  className = "",
}: {
  className?: string;
  children?: ReactNode;
  title: string;
  icon?: IconValue;
  iconType?: string;
  id?: string;
}) {
  return <div className={className}>{children}</div>;
}
export function Tabs({
  children,
  defaultTabIndex = 0,
  sync = true,
  borderBottom = false,
  dropdown = false,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
  defaultTabIndex?: number;
  sync?: boolean;
  borderBottom?: boolean;
  dropdown?: boolean;
}) {
  const tabs = Children.toArray(children).filter(
    isValidElement,
  ) as ReactElement<{
    title?: string;
    children?: ReactNode;
    "data-title"?: string;
    id?: string;
    icon?: IconValue;
    iconType?: string;
  }>[];
  const titles = tabs.map(
    (tab, i) =>
      tab.props.title ??
      tab.props["data-title"] ??
      codeTitle(tab) ??
      `示例 ${i + 1}`,
  );
  const [selected, setSelected] = useState(Math.max(0, defaultTabIndex));
  const active = Math.min(selected, Math.max(0, tabs.length - 1));
  const id = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const titleKey = JSON.stringify(titles);
  const anchors = tabs.map(
    (tab, i) => tab.props.id ?? `${id}-${slugify(titles[i])}-${i}`,
  );
  const anchorKey = JSON.stringify(anchors);
  useEffect(() => {
    const reveal = () => {
      let hash = location.hash.slice(1);
      try {
        hash = decodeURIComponent(hash);
      } catch {
        return;
      }
      const index = (JSON.parse(anchorKey) as string[]).indexOf(hash);
      if (index >= 0) setSelected(index);
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, [anchorKey]);
  useEffect(() => {
    if (!sync) return;
    const onSync = (event: Event) => {
      const title = (event as CustomEvent<string>).detail;
      const index = (JSON.parse(titleKey) as string[]).indexOf(title);
      if (index >= 0) setSelected(index);
    };
    window.addEventListener("hast-docs-tab", onSync);
    return () => window.removeEventListener("hast-docs-tab", onSync);
  }, [sync, titleKey]);
  const select = (index: number) => {
    setSelected(index);
    history.replaceState(null, "", `#${encodeURIComponent(anchors[index])}`);
    if (sync)
      window.dispatchEvent(
        new CustomEvent("hast-docs-tab", { detail: titles[index] }),
      );
  };
  return (
    <div
      className={`docs-tabs ${borderBottom ? "docs-tabs-bordered" : ""} ${className}`}
    >
      {dropdown && (
        <select
          className="docs-code-select cursor-pointer"
          aria-label="选择语言"
          value={active}
          onChange={(event) => select(Number(event.target.value))}
        >
          {titles.map((title, index) => (
            <option key={index} value={index}>
              {title}
            </option>
          ))}
        </select>
      )}
      <div
        hidden={dropdown}
        ref={listRef}
        role="tablist"
        aria-label="内容选项卡"
        onKeyDown={(event) => {
          const delta =
            event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
          if (!delta && event.key !== "Home" && event.key !== "End") return;
          event.preventDefault();
          const next =
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? tabs.length - 1
                : (active + delta + tabs.length) % tabs.length;
          select(next);
          (listRef.current?.children[next] as HTMLButtonElement)?.focus();
        }}
      >
        {titles.map((title, index) => (
          <button
            className="cursor-pointer"
            type="button"
            key={`${title}-${index}`}
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={anchors[index]}
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            onClick={() => select(index)}
          >
            {tabs[index].props.icon && (
              <Icon
                icon={tabs[index].props.icon}
                iconType={tabs[index].props.iconType}
                size={16}
              />
            )}
            <Inline>{title}</Inline>
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={index}
          role="tabpanel"
          id={anchors[index]}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={active !== index}
          tabIndex={0}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}
export function CodeGroup({
  children,
  dropdown = false,
  className = "",
}: {
  className?: string;
  children?: ReactNode;
  dropdown?: boolean;
}) {
  return (
    <div className={`docs-code-group ${className}`}>
      <Tabs dropdown={dropdown}>{children}</Tabs>
    </div>
  );
}
function codeTitle(node: ReactNode): string | undefined {
  for (const child of Children.toArray(node)) {
    if (
      !isValidElement<{
        children?: ReactNode;
        "data-rehype-pretty-code-title"?: string;
        "data-language"?: string;
      }>(child)
    )
      continue;
    if (child.props["data-rehype-pretty-code-title"] !== undefined)
      return codeText(child.props.children);
    const nested = codeTitle(child.props.children);
    if (nested) return nested;
    if (child.props["data-language"]) return child.props["data-language"];
  }
}
export function Tooltip({
  children,
  tip,
  headline,
  cta,
  href,
  className = "",
}: {
  children?: ReactNode;
  tip: ReactNode;
  headline?: string;
  cta?: string;
  href?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <span
      className={`docs-tooltip ${className}`}
      tabIndex={0}
      aria-describedby={id}
    >
      {children}
      <span role="tooltip" id={id}>
        {headline && (
          <strong>
            <Inline>{headline}</Inline>
          </strong>
        )}
        <span>{tip}</span>
        {cta && href && <a href={href}>{cta} ↗</a>}
      </span>
    </span>
  );
}
export type BannerProps = {
  children?: ReactNode;
  content?: string;
  dismissible?: boolean;
  type?: "info" | "warning" | "critical";
  color?: { light?: string; dark?: string };
  className?: string;
};
export function Banner({
  children,
  content,
  dismissible = false,
  type = "info",
  color,
  className = "",
}: BannerProps) {
  const identity = content ?? plainText(children);
  const storageKey = `hast-docs-banner:${identity}`;
  const [dismissed, setDismissed] = useState<string | null>(null);
  useEffect(() => {
    try {
      setDismissed(
        localStorage.getItem(storageKey) === "dismissed" ? storageKey : null,
      );
    } catch {
      setDismissed(null);
    }
  }, [storageKey]);
  return dismissed !== storageKey ? (
    <aside
      className={`docs-banner ${className}`}
      data-type={type}
      style={
        color
          ? ({
              "--banner-light": color.light ?? color.dark,
              "--banner-dark": color.dark ?? color.light,
            } as React.CSSProperties)
          : undefined
      }
    >
      {content ? <Inline>{content}</Inline> : children}
      {dismissible && (
        <button
          type="button"
          className="cursor-pointer"
          aria-label="关闭横幅"
          onClick={() => {
            setDismissed(storageKey);
            try {
              localStorage.setItem(storageKey, "dismissed");
            } catch {
              /* Dismissal still works for this page. */
            }
          }}
        >
          <X size={16} />
        </button>
      )}
    </aside>
  ) : null;
}
