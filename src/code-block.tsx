"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import type { ThemedToken, BundledLanguage } from "shiki";
import { CopyButton } from "./copy-button";
import { Mermaid } from "./mermaid";
import { codeText } from "./primitives";

export function CodeBlock({
  children,
  code,
  title,
  language = "text",
  wrap = false,
  actions,
  placement,
  className = "",
}: {
  children?: ReactNode;
  code?: string;
  title?: string;
  language?: string;
  wrap?: boolean;
  actions?: boolean;
  placement?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const text = code ?? codeText(children).replace(/\n$/, "");
  const [highlighted, setHighlighted] = useState<{
    text: string;
    language: string;
    tokens: ThemedToken[][];
  } | null>(null);
  const plain = code !== undefined || typeof children === "string";
  useEffect(() => {
    if (!plain || language === "mermaid") return;
    let active = true;
    import("shiki")
      .then((shiki) =>
        shiki.codeToTokens(text, {
          lang: language as BundledLanguage,
          themes: { light: "github-light-default", dark: "dark-plus" },
          defaultColor: false,
        }),
      )
      .then((result) => {
        if (active) setHighlighted({ text, language, tokens: result.tokens });
      })
      .catch(() => {
        /* Unknown languages retain readable plain text. */
      });
    return () => {
      active = false;
    };
  }, [text, language, plain]);
  const tokens =
    highlighted?.text === text && highlighted.language === language
      ? highlighted.tokens
      : null;

  if (language === "mermaid")
    return (
      <Mermaid
        code={text}
        actions={actions}
        placement={placement}
        className={className}
      />
    );
  return (
    <div className={`docs-code ${className}`} data-wrap={wrap || undefined}>
      <div className="docs-code-header" data-untitled={!title || undefined}>
        {title && <span>{title}</span>}
        <CopyButton text={text} label="复制代码" />
      </div>
      <pre>
        <code className={`language-${language}`}>
          {tokens
            ? tokens.map((line, i) => (
                <Fragment key={i}>
                  <span data-line="">
                    {line.length
                      ? line.map((token, j) => (
                          <span
                            key={j}
                            style={token.htmlStyle as React.CSSProperties}
                          >
                            {token.content}
                          </span>
                        ))
                      : " "}
                  </span>
                  {i < tokens.length - 1 ? "\n" : ""}
                </Fragment>
              ))
            : (children ?? text)}
        </code>
      </pre>
    </div>
  );
}
