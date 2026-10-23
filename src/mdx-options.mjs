import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
export const docsMdxOptions = {
  remarkPlugins: [
    require.resolve("@hast/docs/fragments"),
    require.resolve("remark-gfm"),
    require.resolve("@hast/docs/remark"),
    require.resolve("@hast/docs/search"),
  ],
  rehypePlugins: [
    require.resolve("rehype-slug"),
    require.resolve("@hast/docs/highlight"),
    require.resolve("@hast/docs/rehype"),
  ],
};
