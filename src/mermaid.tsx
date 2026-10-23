"use client";
import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";
type Placement = "top-left" | "top-right" | "bottom-left" | "bottom-right";
let engine: Promise<(typeof import("mermaid"))["default"]> | undefined;
function loadEngine() {
  return (engine ??= Promise.all([
    import("mermaid"),
    import("@mermaid-js/layout-elk"),
  ]).then(([{ default: mermaid }, { default: elk }]) => {
    mermaid.registerLayoutLoaders(elk);
    return mermaid;
  }));
}
export function Mermaid({
  code,
  actions,
  placement = "bottom-right",
  className = "",
}: {
  code: string;
  actions?: boolean;
  placement?: Placement;
  className?: string;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [large, setLarge] = useState(false);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const enabled = actions ?? large;
  useEffect(() => {
    let cancelled = false;
    let revision = 0;
    const render = async () => {
      const current = ++revision;
      setStatus("loading");
      try {
        const mermaid = await loadEngine();
        if (cancelled) return;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme:
            document.documentElement.dataset.theme === "dark"
              ? "dark"
              : "default",
          fontFamily: "Inter, sans-serif",
        });
        const { svg } = await mermaid.render(
          `docs-mermaid-${id}-${current}`,
          code,
        );
        if (!cancelled && current === revision && container.current) {
          container.current.innerHTML = svg;
          setLarge(container.current.getBoundingClientRect().height > 120);
          setView({ x: 0, y: 0, scale: 1 });
          setStatus("ready");
        }
      } catch {
        if (!cancelled && current === revision) {
          if (container.current) container.current.innerHTML = "";
          setStatus("error");
        }
      }
    };
    let visible = false;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        visible = true;
        void render();
        observer.disconnect();
      }
    });
    if (container.current) observer.observe(container.current);
    const themeObserver = new MutationObserver(() => {
      if (visible) void render();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => {
      cancelled = true;
      observer.disconnect();
      themeObserver.disconnect();
    };
  }, [code, id]);
  const move = (x: number, y: number) =>
    setView((v) => ({ ...v, x: v.x + x, y: v.y + y }));
  const zoom = (amount: number) =>
    setView((v) => ({
      ...v,
      scale: Math.max(0.25, Math.min(4, v.scale + amount)),
    }));
  return (
    <figure className={`docs-mermaid ${className}`}>
      <div
        className={`docs-mermaid-viewport ${enabled ? "docs-mermaid-draggable" : ""}`}
        onPointerDown={(e) => {
          if (
            !enabled ||
            e.button !== 0 ||
            (e.target as HTMLElement).closest("button")
          )
            return;
          drag.current = { x: e.clientX, y: e.clientY };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          move(e.clientX - drag.current.x, e.clientY - drag.current.y);
          drag.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        <div
          className="docs-mermaid-drawing"
          ref={container}
          role="img"
          aria-label="Mermaid 图表"
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          }}
        />
        {status === "loading" && <span role="status">正在生成图表…</span>}
        {enabled && status === "ready" && (
          <div
            className="docs-mermaid-controls"
            data-placement={placement}
            aria-label="图表控件"
          >
            <button
              type="button"
              aria-label="放大图表"
              onClick={() => zoom(0.25)}
              disabled={view.scale >= 4}
            >
              <Plus size={15} />
            </button>
            <button
              type="button"
              aria-label="缩小图表"
              onClick={() => zoom(-0.25)}
              disabled={view.scale <= 0.25}
            >
              <Minus size={15} />
            </button>
            <button
              type="button"
              aria-label="向左平移"
              onClick={() => move(-40, 0)}
            >
              <ArrowLeft size={15} />
            </button>
            <button
              type="button"
              aria-label="向右平移"
              onClick={() => move(40, 0)}
            >
              <ArrowRight size={15} />
            </button>
            <button
              type="button"
              aria-label="向上平移"
              onClick={() => move(0, -40)}
            >
              <ArrowUp size={15} />
            </button>
            <button
              type="button"
              aria-label="向下平移"
              onClick={() => move(0, 40)}
            >
              <ArrowDown size={15} />
            </button>
            <button
              type="button"
              aria-label="重置图表"
              onClick={() => setView({ x: 0, y: 0, scale: 1 })}
            >
              <RotateCcw size={15} />
            </button>
          </div>
        )}
      </div>
      <details>
        <summary className="cursor-pointer">
          {status === "error" ? "图表无法渲染，查看源码" : "查看图表源码"}
        </summary>
        <pre>{code}</pre>
      </details>
    </figure>
  );
}
