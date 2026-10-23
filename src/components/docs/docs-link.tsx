import type { ComponentProps } from "react";
import { ExternalLink } from "lucide-react";

export function DocsLink({ href, children, className, rel, ...props }: ComponentProps<"a">) {
  const external = !!href && /^(https?:)?\/\//i.test(href);
  const linkClassName = ["cursor-pointer", className].filter(Boolean).join(" ");

  if (!external) {
    return <a {...props} href={href} className={linkClassName} rel={rel}>{children}</a>;
  }

  return (
    <a
      {...props}
      href={href}
      className={linkClassName}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ExternalLink aria-hidden="true" className="ml-1 inline-block h-3.5 w-3.5 align-baseline" />
    </a>
  );
}
