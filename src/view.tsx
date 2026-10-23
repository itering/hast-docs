"use client";
import { useContext, useEffect, useId, type ReactNode } from "react";
import { FeaturesContext, DocsFeatures, ViewSelector } from "./features";
import type { IconValue } from "./primitives";
export function View({
  children,
  title,
  icon,
  iconType,
  className = "",
}: {
  children?: ReactNode;
  title?: string;
  icon?: IconValue;
  iconType?: string;
  className?: string;
}) {
  const state = useContext(FeaturesContext);
  const id = useId();
  const register = state?.registerView;
  useEffect(
    () =>
      title && register ? register({ id, title, icon, iconType }) : undefined,
    [register, id, title, icon, iconType],
  );
  if (!title) return null;
  const first = state?.views.find((v) => v.title === title);
  const visible = state
    ? state.selectedView === title && first?.id === id
    : true;
  return (
    <div
      className={`docs-view ${className}`}
      data-title={title}
      hidden={!visible}
    >
      {children}
    </div>
  );
}
export function ViewGroup({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  const state = useContext(FeaturesContext);
  return state ? (
    <div className={className}>{children}</div>
  ) : (
    <DocsFeatures>
      <div className={className}>
        <ViewSelector />
        {children}
      </div>
    </DocsFeatures>
  );
}
