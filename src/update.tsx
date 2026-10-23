"use client";
import { useContext, useEffect, useId, type ReactNode } from "react";
import { FeaturesContext } from "./features";
import { Inline, slugify } from "./primitives";
export function Update({
  children,
  label,
  description,
  tags = [],
  className = "",
}: {
  children?: ReactNode;
  label: string;
  description?: string;
  tags?: string[];
  className?: string;
}) {
  const state = useContext(FeaturesContext);
  const id = useId();
  const key = JSON.stringify(tags);
  const register = state?.registerUpdate;
  useEffect(() => register?.(id, JSON.parse(key)), [register, id, key]);
  const anchor = slugify(label);
  return (
    <section
      id={anchor}
      className={`docs-update ${className}`}
      hidden={!!state?.tag && !tags.includes(state.tag)}
    >
      <aside>
        <a href={`#${anchor}`} className="docs-heading-anchor">
          <strong>
            <Inline>{label}</Inline>
          </strong>
        </a>
        {description && (
          <p>
            <Inline>{description}</Inline>
          </p>
        )}
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className="docs-badge cursor-pointer"
            onClick={() => state?.selectTag(state.tag === tag ? "" : tag)}
            aria-pressed={state?.tag === tag}
          >
            {tag}
          </button>
        ))}
      </aside>
      <div>{children}</div>
    </section>
  );
}
