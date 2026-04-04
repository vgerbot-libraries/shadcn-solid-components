import { ColorModeProvider } from "@kobalte/core"
import { render } from "solid-js/web"

import { ConfigProvider } from "shadcn-solid-components/components/config-provider"
import { Toaster } from "shadcn-solid-components/components/sonner"
import { ThemeProvider } from "shadcn-solid-components/components/theme"

import App from "./App"
import "./styles.css"

const rootElement = document.getElementById("root")

if (!rootElement) {
  throw new Error("Missing #root element for docs app.")
}

render(
  () => (
    <ColorModeProvider>
      <ThemeProvider defaultTheme={{ base: { radius: "md" } }} storageKey="shadcn-solid-docs-theme">
        <ConfigProvider>
          <App />
          <Toaster />
        </ConfigProvider>
      </ThemeProvider>
    </ColorModeProvider>
  ),
  rootElement,
)
