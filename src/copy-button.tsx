"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { useDocsTranslation } from "./i18n";

export function CopyButton({
  text,
  darkText,
  label = "复制",
}: {
  text: string;
  darkText?: string;
  label?: string;
}) {
  const t = useDocsTranslation();
  const translatedLabel = t(label);
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  useEffect(() => {
    if (status === "idle") return;
    const timer = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(timer);
  }, [status]);
  return (
    <button
      type="button"
      className="docs-copy cursor-pointer"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(
            document.documentElement.dataset.theme === "dark"
              ? (darkText ?? text)
              : text,
          );
          setStatus("copied");
        } catch {
          setStatus("error");
        }
      }}
      aria-label={translatedLabel}
    >
      {status === "copied" ? <Check size={15} /> : <Copy size={15} />}
      <span aria-live="polite">
        {status === "copied"
          ? t("已复制")
          : status === "error"
            ? t("复制失败，请手动复制")
            : translatedLabel}
      </span>
    </button>
  );
}
