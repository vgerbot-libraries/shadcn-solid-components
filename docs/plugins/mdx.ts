import mdx from "@mdx-js/rollup"
import rehypeSlug from "rehype-slug"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import type { Plugin } from "vite"

export default (): Plugin => {
  return {
    enforce: "pre",
    ...mdx({
      jsx: true,
      jsxImportSource: "solid-js",
      providerImportSource: "solid-mdx",
      remarkPlugins: [remarkGfm, remarkFrontmatter],
      rehypePlugins: [rehypeSlug],
    }),
  }
}
