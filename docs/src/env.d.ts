/// <reference types="vite/client" />
/// <reference types="solid-mdx" />

declare module "*.mdx" {
  import { Component } from "solid-js";
  const MDXComponent: Component<any>;
  export default MDXComponent;
  export const frontmatter: Record<string, any>;
}

declare module "@docs/components/mdx" {
  export const mdxCustomComponents: Record<string, any>;
}

declare module "@docs/content" {
  export const Contents: Record<string, any>;
  export const docsNavigation: any[];
}
