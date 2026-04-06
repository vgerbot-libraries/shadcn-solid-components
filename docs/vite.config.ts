import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"
import tsConfigPaths from "vite-tsconfig-paths"

import content from "./plugins/content"
import mdx from "./plugins/mdx"

const normalizeBase = (value?: string) => {
  if (!value || value === "/") {
    return "/"
  }

  const trimmed = value.replace(/^\/+|\/+$/g, "")
  return trimmed ? `/${trimmed}/` : "/"
}

export default defineConfig({
  root: __dirname,
  base: normalizeBase(process.env.DOCS_BASE_PATH),
  plugins: [
    tsConfigPaths({
      projects: [path.resolve(__dirname, "./tsconfig.json")],
    }),
    tailwindcss(),
    mdx(),
    content(),
    solidPlugin({
      extensions: [".tsx", ".ts", ".mdx"],
    }),
  ],
  resolve: {
    dedupe: ["solid-js", "@kobalte/core"],
    alias: [
      {
        find: "@docs",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
  server: {
    port: 3001,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
})
