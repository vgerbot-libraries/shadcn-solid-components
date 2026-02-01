import {
  createSignal,
  createMemo,
  onCleanup,
  type Accessor,
} from "solid-js"

export type UrlInfo = {
  pathname: string
  hash: string
  searchParams: URLSearchParams
  href: string
}

export type UrlInfoInput = string | UrlInfo | Accessor<string | UrlInfo>

export const parseUrl = (input: string): UrlInfo => {
  if (typeof window === "undefined") {
    // Manual parsing for SSR environment
    const hashIndex = input.indexOf("#")
    const queryIndex = input.indexOf("?")
    const hashPart = hashIndex >= 0 ? input.substring(hashIndex) : ""
    const queryPart =
      queryIndex >= 0
        ? input.substring(queryIndex + 1, hashIndex >= 0 ? hashIndex : undefined)
        : ""
    return {
      pathname: input.split("?")[0]?.split("#")[0] || "",
      hash: hashPart,
      searchParams: new URLSearchParams(queryPart),
      href: input,
    }
  }

  try {
    // Use URL object for full URLs
    const url = new URL(input, window.location.origin)
    return {
      pathname: url.pathname,
      hash: url.hash,
      searchParams: url.searchParams,
      href: url.href,
    }
  } catch {
    // Fallback to window.location.href for relative paths
    const url = new URL(input, window.location.href)
    return {
      pathname: url.pathname,
      hash: url.hash,
      searchParams: url.searchParams,
      href: url.href,
    }
  }
}

const getCurrentUrlInfo = (): UrlInfo => {
  return {
    pathname: window.location.pathname,
    hash: window.location.hash,
    searchParams: new URLSearchParams(window.location.search),
    href: window.location.href,
  }
}

export const useCurrentUrl = (
  customUrl?: UrlInfoInput
): Accessor<UrlInfo> => {
  if (customUrl !== undefined) {
    if (typeof customUrl === "function") {
      // Create memo to parse Accessor values reactively
      return createMemo(() => {
        const value = customUrl()
        return typeof value === "string" ? parseUrl(value) : value
      })
    }
    const parsed = typeof customUrl === "string" ? parseUrl(customUrl) : customUrl
    return () => parsed
  }

  // Listen to window.location changes
  if (typeof window === "undefined") {
    return () => ({
      pathname: "",
      hash: "",
      searchParams: new URLSearchParams(),
      href: "",
    })
  }

  const [url, setUrl] = createSignal(getCurrentUrlInfo())

  // Listen to popstate event (browser back/forward navigation)
  const handlePopState = () => {
    setUrl(getCurrentUrlInfo())
  }

  // Intercept pushState/replaceState calls via history API
  const originalPushState = history.pushState
  const originalReplaceState = history.replaceState

  history.pushState = function (...args) {
    originalPushState.apply(history, args)
    setUrl(getCurrentUrlInfo())
  }

  history.replaceState = function (...args) {
    originalReplaceState.apply(history, args)
    setUrl(getCurrentUrlInfo())
  }

  // Listen to hashchange event
  const handleHashChange = () => {
    setUrl(getCurrentUrlInfo())
  }

  window.addEventListener("popstate", handlePopState)
  window.addEventListener("hashchange", handleHashChange)

  onCleanup(() => {
    window.removeEventListener("popstate", handlePopState)
    window.removeEventListener("hashchange", handleHashChange)
    history.pushState = originalPushState
    history.replaceState = originalReplaceState
  })

  return url
}

