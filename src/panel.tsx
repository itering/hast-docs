"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CodeGroup } from "./interactive";
export const PanelHostContext = createContext<HTMLElement | null | undefined>(
  undefined,
);
export const ExampleHostContext = createContext<HTMLElement | null | undefined>(
  undefined,
);
const InsidePanel = createContext(false);
export function Panel({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  const host = useContext(PanelHostContext);
  const content = (
    <InsidePanel.Provider value={true}>
      <div className={`docs-panel docs-prose ${className}`}>{children}</div>
    </InsidePanel.Provider>
  );
  if (host === undefined) return content;
  return host ? createPortal(content, host) : null;
}
function Example({
  children,
  kind,
  dropdown = false,
  className = "",
}: {
  children?: ReactNode;
  kind: "request" | "response";
  dropdown?: boolean;
  className?: string;
}) {
  const host = useContext(ExampleHostContext);
  const inside = useContext(InsidePanel);
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const media = matchMedia("(min-width: 1151px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const content = (
    <section
      className={`docs-example docs-prose ${className}`}
      data-example={kind}
    >
      <h3>{kind === "request" ? "请求示例" : "响应示例"}</h3>
      <CodeGroup dropdown={dropdown}>{children}</CodeGroup>
    </section>
  );
  return !inside && desktop && host ? createPortal(content, host) : content;
}
export function RequestExample(props: {
  children?: ReactNode;
  dropdown?: boolean;
  className?: string;
}) {
  return <Example {...props} kind="request" />;
}
export function ResponseExample(props: {
  children?: ReactNode;
  dropdown?: boolean;
  className?: string;
}) {
  return <Example {...props} kind="response" />;
}
