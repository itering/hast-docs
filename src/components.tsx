import type { CSSProperties, ReactNode } from "react";
import { GitHubRepo } from "./github-repo";
import { CopyButton } from "./copy-button";
import { Children, isValidElement, cloneElement } from "react";
import {
  Info,
  Lightbulb,
  TriangleAlert,
  CircleCheck,
  CircleAlert,
  ArrowUpRight,
} from "lucide-react";
export {
  Accordion,
  Tabs,
  Tab,
  CodeGroup,
  Tooltip,
  Banner,
  Expandable,
} from "./interactive";
export { CodeBlock } from "./code-block";
export { CopyButton } from "./copy-button";

type Content = { children?: ReactNode; className?: string };
export { Icon } from "./primitives";
import { Icon, Inline, slugify, type IconValue, plainText } from "./primitives";
export function AccordionGroup({ children, className = "" }: Content) {
  return <div className={`docs-accordion-group ${className}`}>{children}</div>;
}
export function Badge({
  children,
  color = "gray",
  size = "md",
  icon,
  shape,
  iconType,
  stroke = false,
  disabled = false,
  className = "",
}: Content & {
  color?: string;
  size?: string;
  icon?: IconValue;
  shape?: string;
  iconType?: string;
  stroke?: boolean;
  disabled?: boolean;
}) {
  return (
    <span
      className={`docs-badge docs-tone-${color} ${className}`}
      data-stroke={stroke || undefined}
      aria-disabled={disabled || undefined}
      data-size={size}
      data-shape={shape}
    >
      {icon && <Icon icon={icon} size={14} iconType={iconType} />}
      {children}
    </span>
  );
}
const calloutIcons = {
  note: Info,
  tip: Lightbulb,
  warning: TriangleAlert,
  danger: TriangleAlert,
  info: CircleAlert,
  check: CircleCheck,
};
export function Callout({
  children,
  type = "note",
  title,
  icon,
  color,
  iconType,
  className = "",
}: Content & {
  color?: string;
  iconType?: string;
  type?: keyof typeof calloutIcons;
  title?: string;
  icon?: IconValue;
}) {
  const Symbol = calloutIcons[type];
  return (
    <aside
      className={`docs-callout docs-callout-${type} ${className}`}
      style={
        color
          ? {
              color,
              borderColor: `color-mix(in srgb, ${color} 35%, transparent)`,
              background: `color-mix(in srgb, ${color} 8%, var(--docs-bg))`,
            }
          : undefined
      }
    >
      {icon ? (
        <Icon icon={icon} iconType={iconType} />
      ) : (
        <Symbol size={20} aria-hidden="true" />
      )}
      <div>
        {title && (
          <strong>
            <Inline>{title}</Inline>
          </strong>
        )}
        {children}
      </div>
    </aside>
  );
}
export const Note = (props: Content) => <Callout {...props} type="note" />;
export const Tip = (props: Content) => <Callout {...props} type="tip" />;
export const Warning = (props: Content) => (
  <Callout {...props} type="warning" />
);
export const InfoCallout = (props: Content) => (
  <Callout {...props} type="info" />
);
export const Danger = (props: Content) => <Callout {...props} type="danger" />;
export const Check = (props: Content) => <Callout {...props} type="check" />;
export function Card({
  children,
  title,
  icon,
  href,
  horizontal,
  img,
  className = "",
  cta,
  iconType,
  arrow,
  color,
  type,
}: Content & {
  color?: string;
  type?: keyof typeof calloutIcons;
  title: string;
  icon?: IconValue;
  href?: string;
  horizontal?: boolean;
  img?: string;
  cta?: string;
  iconType?: string;
  arrow?: boolean;
}) {
  const Tag = href ? "a" : "div";
  return (
    <Tag
      href={href}
      className={`docs-card ${horizontal ? "docs-card-horizontal" : ""} ${type ? `docs-card-tone docs-callout-${type}` : ""} ${className}`}
    >
      {img && <img src={img} alt="" />}
      {(icon || type) && (
        <Icon
          icon={
            icon ??
            {
              note: "info",
              info: "circle-alert",
              tip: "lightbulb",
              warning: "triangle-alert",
              check: "circle-check",
              danger: "triangle-alert",
            }[type!]
          }
          size={24}
          color={color}
          iconType={iconType}
        />
      )}
      <div>
        <strong>
          <Inline>{title}</Inline>
        </strong>
        {children && <div className="docs-card-description">{children}</div>}
      </div>
      {href && cta && <span className="docs-card-cta">{cta}</span>}
      {href && (arrow ?? /^https?:/.test(href)) && (
        <ArrowUpRight className="docs-card-arrow" size={16} />
      )}
    </Tag>
  );
}
export function Columns({
  children,
  cols = 2,
  className = "",
}: Content & { cols?: number }) {
  return (
    <div
      className={`docs-columns ${className}`}
      style={{ "--docs-cols": cols } as CSSProperties}
    >
      {children}
    </div>
  );
}
export const CardGroup = Columns;
export function Frame({
  children,
  caption,
  hint,
  className = "",
}: Content & { caption?: ReactNode; hint?: ReactNode }) {
  return (
    <figure className={`docs-frame ${className}`}>
      {hint && <p className="docs-frame-hint">{hint}</p>}
      <div>
        {Children.map(children, (child) =>
          isValidElement<{ autoPlay?: boolean }>(child) &&
          child.type === "video" &&
          child.props.autoPlay
            ? cloneElement(
                child as React.ReactElement<
                  React.VideoHTMLAttributes<HTMLVideoElement>
                >,
                { playsInline: true, loop: true, muted: true },
              )
            : child,
        )}
      </div>
      {caption && (
        <figcaption>
          <Inline>{caption}</Inline>
        </figcaption>
      )}
    </figure>
  );
}
type TitleSize = "p" | "h2" | "h3" | "h4";
export function Steps({
  children,
  titleSize = "p",
  className = "",
}: Content & { titleSize?: TitleSize }) {
  return (
    <div className={`docs-steps ${className}`}>
      {Children.map(children, (child) =>
        isValidElement<{ titleSize?: TitleSize }>(child)
          ? cloneElement(child, {
              titleSize: child.props.titleSize ?? titleSize,
            })
          : child,
      )}
    </div>
  );
}
export function Step({
  children,
  title,
  icon,
  stepNumber,
  iconType,
  titleSize = "p",
  id,
  noAnchor = false,
  className = "",
}: Content & {
  title: string;
  icon?: IconValue;
  stepNumber?: number;
  iconType?: string;
  titleSize?: TitleSize;
  id?: string;
  noAnchor?: boolean;
}) {
  const Tag = titleSize;
  const anchor = noAnchor ? undefined : (id ?? slugify(title));
  return (
    <section className={`docs-step ${className}`} id={anchor}>
      <span className="docs-step-number">
        {icon ? <Icon icon={icon} size={16} iconType={iconType} /> : stepNumber}
      </span>
      <Tag className="docs-step-title">
        {anchor ? (
          <a className="docs-heading-anchor" href={`#${anchor}`}>
            <Inline>{title}</Inline>
          </a>
        ) : (
          <Inline>{title}</Inline>
        )}
      </Tag>
      <div>{children}</div>
    </section>
  );
}
export function Field({
  children,
  name,
  type,
  required,
  default: defaultValue,
  deprecated,
  pre = [],
  post = [],
  className = "",
}: Content & {
  name?: string;
  type?: string;
  required?: boolean;
  default?: string | number | boolean | null;
  deprecated?: boolean;
  pre?: string[];
  post?: string[];
}) {
  return (
    <section
      className={`docs-field ${className}`}
      id={name ? `param-${name}` : undefined}
    >
      <div className="docs-field-heading">
        {pre.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
        <code>{name}</code>
        {post.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
        <span>{type}</span>
        {required && <Badge color="red">必填</Badge>}
        {deprecated && <Badge color="yellow">已弃用</Badge>}
        {defaultValue !== undefined && (
          <span>
            默认值: <code>{String(defaultValue)}</code>
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
export function ParamField({
  body,
  path,
  query,
  header,
  ...props
}: Parameters<typeof Field>[0] & {
  body?: string;
  path?: string;
  query?: string;
  header?: string;
}) {
  return (
    <Field {...props} name={body ?? path ?? query ?? header ?? props.name} />
  );
}
export const ResponseField = Field;
export { Panel } from "./panel";
export function Color({
  children,
  variant = "compact",
  className = "",
}: Content & { variant?: string }) {
  return (
    <div className={`docs-colors ${className}`} data-variant={variant}>
      {children}
    </div>
  );
}
Color.Item = function ColorItem({
  name,
  value,
}: {
  name?: string;
  value: string | { light: string; dark: string };
}) {
  const light = typeof value === "string" ? value : value.light;
  const dark = typeof value === "string" ? value : value.dark;
  return (
    <div className="docs-color">
      <span
        style={
          { "--swatch-light": light, "--swatch-dark": dark } as CSSProperties
        }
      />
      <strong>{name}</strong>
      <code>
        <span className="docs-light-only">{light}</span>
        <span className="docs-dark-only">{dark}</span>
      </code>
      <CopyButton
        text={light}
        darkText={dark}
        label={`复制 ${name ?? "色值"}`}
      />
    </div>
  );
};
Color.Row = function ColorRow({
  children,
  title,
  className = "",
}: Content & { title: string }) {
  return (
    <div className={`docs-color-row ${className}`}>
      <strong>
        <Inline>{title}</Inline>
      </strong>
      <div>{children}</div>
    </div>
  );
};
export const ColorGroup = Color;
export { Update } from "./update";
export function Tile({
  children,
  title,
  description,
  href,
  className = "",
}: Content & { title?: string; description?: string; href?: string }) {
  const Tag = href ? "a" : "div";
  return (
    <Tag href={href} className={`docs-tile ${className}`}>
      <div className="docs-tile-preview">{children}</div>
      <div className="docs-tile-caption">
        <strong>
          <Inline>{title}</Inline>
        </strong>
        {description && (
          <p>
            <Inline>{description}</Inline>
          </p>
        )}
      </div>
    </Tag>
  );
}
import { Tree as InteractiveTree, TreeFolder, TreeFile } from "./tree";
export function Tree(props: Parameters<typeof InteractiveTree>[0]) {
  return <InteractiveTree {...props} />;
}
Tree.Folder = TreeFolder;
Tree.File = TreeFile;
export { View, ViewGroup } from "./view";
export { RequestExample, ResponseExample } from "./panel";
export function Prompt({
  children,
  description,
  icon,
  actions = ["copy"],
  iconType,
  className = "",
}: Content & {
  description?: string;
  icon?: IconValue;
  actions?: ("copy" | "cursor")[];
  iconType?: string;
}) {
  const text = plainText(children).trim();
  const cursorHref = `cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(text)}`;
  return (
    <div className={`docs-prompt ${className}`}>
      <div className="docs-prompt-title">
        {icon && <Icon icon={icon} iconType={iconType} />}
        <Inline>{description}</Inline>
      </div>
      <div>{children}</div>
      <div className="docs-prompt-actions">
        {actions.includes("copy") && (
          <CopyButton text={text} label="复制提示" />
        )}
        {actions.includes("cursor") &&
          (cursorHref.length <= 8000 ? (
            <a href={cursorHref}>在 Cursor 中打开 ↗</a>
          ) : (
            <span>提示过长，请复制后粘贴到 Cursor</span>
          ))}
      </div>
    </div>
  );
}
export const GitHub = { Repo: GitHubRepo };
