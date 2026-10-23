declare module "*.mdx" {
  export const docsSearchText: string;
  import type { ComponentType, ElementType } from "react";
  const MDXContent: ComponentType<{
    components?: Record<string, ElementType | Record<string, ElementType>>;
  }>;
  export default MDXContent;
}
