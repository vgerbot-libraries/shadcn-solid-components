import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"
import tsConfigPaths from "vite-tsconfig-paths"

import content from "./plugins/content"
import mdx from "./plugins/mdx"

export default defineConfig({
  root: __dirname,
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
