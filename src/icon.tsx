"use client";
import { useEffect, useState, type ReactNode } from "react";
import { icons, BookOpen } from "lucide-react";
type SvgData = { body: string; width: number; height: number };
export type IconProps = {
  icon?: string | ReactNode;
  src?: string;
  size?: number;
  color?: string;
  className?: string;
  iconType?: string;
  library?: "lucide" | "fontawesome" | "tabler";
};
const cache = new Map<string, Promise<SvgData | null>>();
function loadIcon(name: string, library: string, type: string) {
  const key = `${library}:${type}:${name}`;
  let request = cache.get(key);
  if (!request) {
    request = (async () => {
      if (library === "tabler") {
        const { default: pack } =
          await import("@iconify-json/tabler/icons.json");
        const item = (pack.icons as Record<string, { body: string }>)[name];
        return item
          ? { body: item.body, width: pack.width, height: pack.height }
          : null;
      }
      const pack =
        type === "brands"
          ? await import("@fortawesome/free-brands-svg-icons")
          : type === "regular"
            ? await import("@fortawesome/free-regular-svg-icons")
            : await import("@fortawesome/free-solid-svg-icons");
      const key =
        "fa" +
        name
          .split("-")
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join("");
      const item = (
        pack as unknown as Record<
          string,
          { icon: [number, number, unknown, unknown, string | string[]] }
        >
      )[key];
      if (!item?.icon) return null;
      const [width, height, , , paths] = item.icon;
      return {
        width,
        height,
        body: (Array.isArray(paths) ? paths : [paths])
          .map((d) => `<path fill="currentColor" d="${d}"/>`)
          .join(""),
      };
    })();
    cache.set(key, request);
  }
  return request;
}
export function Icon({
  icon,
  src,
  size = 20,
  color,
  className = "",
  iconType,
  library,
}: IconProps) {
  const value = src ?? icon ?? "book-open";
  const selectedLibrary = library ?? (iconType ? "fontawesome" : "lucide");
  const name = typeof value === "string" ? value : "";
  const external = /^(https?:\/\/|\/|\.\/|\.\.\/)/.test(name);
  const emoji = /\p{Extended_Pictographic}/u.test(name);
  const [loaded, setLoaded] = useState<{
    key: string;
    svg: SvgData | null;
  } | null>(null);
  const key = `${selectedLibrary}:${iconType}:${name}`;
  useEffect(() => {
    if (selectedLibrary === "lucide" || !name || external || emoji) return;
    let active = true;
    loadIcon(name, selectedLibrary, iconType ?? "solid")
      .then((svg) => {
        if (active) setLoaded({ key, svg });
      })
      .catch(() => {
        if (active) setLoaded({ key, svg: null });
      });
    return () => {
      active = false;
    };
  }, [selectedLibrary, name, iconType, key, external, emoji]);
  if (typeof value !== "string")
    return (
      <span className={className} style={{ color }}>
        {value}
      </span>
    );
  if (external)
    return (
      <img
        className={className}
        src={value}
        width={size}
        height={size}
        alt=""
      />
    );
  if (emoji)
    return (
      <span
        className={className}
        style={{ fontSize: size, color }}
        aria-hidden="true"
      >
        {value}
      </span>
    );
  if (loaded?.key === key && loaded.svg)
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox={`0 0 ${loaded.svg.width} ${loaded.svg.height}`}
        style={{ color }}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: loaded.svg.body }}
      />
    );
  const aliases: Record<string, string> = {
    book: "BookOpen",
    code: "Code",
    terminal: "Terminal",
    bolt: "Zap",
    warning: "TriangleAlert",
    check: "CircleCheck",
    github: "Github",
    "text-align-start": "AlignLeft",
    js: "FileCode",
    python: "FileCode",
  };
  const componentName =
    aliases[value] ??
    value
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join("");
  const Component = icons[componentName as keyof typeof icons] ?? BookOpen;
  return (
    <Component
      className={className}
      size={size}
      color={color}
      aria-hidden="true"
    />
  );
}
