// https://github.com/solidjs-community/solid-primitives/blob/main/packages/props/src/combineProps.ts

import type { JSX } from 'solid-js'

const extractCSSregex = /((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g

export function stringStyleToObject(style: string): JSX.CSSProperties {
  const object: Record<string, string> = {}
  let match: RegExpExecArray | null
  while ((match = extractCSSregex.exec(style))) {
    if (match[1] && match[2]) {
      object[match[1]] = match[2]
    }
  }
  return object
}

type StyleProperties = JSX.CSSProperties | string | undefined

export function combineStyle(a: string, b: string): string
export function combineStyle(
  a: JSX.CSSProperties | undefined,
  b: JSX.CSSProperties | undefined,
): JSX.CSSProperties
export function combineStyle(a: StyleProperties, b: StyleProperties): JSX.CSSProperties
export function combineStyle(a: StyleProperties, b: StyleProperties): JSX.CSSProperties | string {
  if (typeof a === 'string') {
    if (typeof b === 'string') return `${a};${b}`

    a = stringStyleToObject(a)
  } else if (typeof b === 'string') {
    b = stringStyleToObject(b)
  }

  return { ...a, ...b }
}
