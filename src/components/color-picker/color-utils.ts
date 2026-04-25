export type HSVA = { h: number; s: number; v: number; a: number }
export type RGBA = { r: number; g: number; b: number; a: number }
export type HSLA = { h: number; s: number; l: number; a: number }

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const round = (value: number, digits = 3) => {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

const normalizeHue = (value: number) => {
  if (!Number.isFinite(value)) return 0
  const result = value % 360
  return result < 0 ? result + 360 : result
}

export const normalizeHsva = (value: Partial<HSVA>): HSVA => ({
  h: normalizeHue(value.h ?? 0),
  s: clamp(value.s ?? 0, 0, 1),
  v: clamp(value.v ?? 0, 0, 1),
  a: clamp(value.a ?? 1, 0, 1),
})

const normalizeRgba = (value: Partial<RGBA>): RGBA => ({
  r: clamp(Math.round(value.r ?? 0), 0, 255),
  g: clamp(Math.round(value.g ?? 0), 0, 255),
  b: clamp(Math.round(value.b ?? 0), 0, 255),
  a: clamp(value.a ?? 1, 0, 1),
})

export const hsvaToRgba = (color: HSVA): RGBA => {
  const h = normalizeHue(color.h)
  const s = clamp(color.s, 0, 1)
  const v = clamp(color.v, 0, 1)
  const a = clamp(color.a, 0, 1)

  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c

  let r = 0
  let g = 0
  let b = 0

  if (h < 60) {
    r = c; g = x
  } else if (h < 120) {
    r = x; g = c
  } else if (h < 180) {
    g = c; b = x
  } else if (h < 240) {
    g = x; b = c
  } else if (h < 300) {
    r = x; b = c
  } else {
    r = c; b = x
  }

  return normalizeRgba({ r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255, a })
}

export const rgbaToHsva = (color: RGBA): HSVA => {
  const r = clamp(color.r, 0, 255) / 255
  const g = clamp(color.g, 0, 255) / 255
  const b = clamp(color.b, 0, 255) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0

  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6
    else if (max === g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4
    h *= 60
  }

  return normalizeHsva({
    h,
    s: max === 0 ? 0 : delta / max,
    v: max,
    a: clamp(color.a, 0, 1),
  })
}

const rgbaToHsla = (color: RGBA): HSLA => {
  const r = clamp(color.r, 0, 255) / 255
  const g = clamp(color.g, 0, 255) / 255
  const b = clamp(color.b, 0, 255) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  const l = (max + min) / 2

  let h = 0
  let s = 0

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))
    if (max === r) h = ((g - b) / delta) % 6
    else if (max === g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4
    h *= 60
  }

  return {
    h: normalizeHue(h),
    s: clamp(s, 0, 1),
    l: clamp(l, 0, 1),
    a: clamp(color.a, 0, 1),
  }
}

const hslToRgba = (color: HSLA): RGBA => {
  const h = normalizeHue(color.h)
  const s = clamp(color.s, 0, 1)
  const l = clamp(color.l, 0, 1)

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r = 0
  let g = 0
  let b = 0

  if (h < 60) {
    r = c; g = x
  } else if (h < 120) {
    r = x; g = c
  } else if (h < 180) {
    g = c; b = x
  } else if (h < 240) {
    g = x; b = c
  } else if (h < 300) {
    r = x; b = c
  } else {
    r = c; b = x
  }

  return normalizeRgba({ r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255, a: color.a })
}

const channelToHex = (value: number) =>
  clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0')

export const formatHex = (color: RGBA, showAlpha: boolean) => {
  const base = `#${channelToHex(color.r)}${channelToHex(color.g)}${channelToHex(color.b)}`
  if (showAlpha && color.a < 1) {
    return (base + channelToHex(color.a * 255)).toUpperCase()
  }
  return base.toUpperCase()
}

export const formatRgb = (color: RGBA, showAlpha: boolean) => {
  if (showAlpha && color.a < 1) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${round(color.a, 3)})`
  }
  return `rgb(${color.r}, ${color.g}, ${color.b})`
}

export const formatHsl = (color: RGBA, showAlpha: boolean) => {
  const hsla = rgbaToHsla(color)
  const h = Math.round(hsla.h)
  const s = Math.round(hsla.s * 100)
  const l = Math.round(hsla.l * 100)
  if (showAlpha && color.a < 1) {
    return `hsla(${h}, ${s}%, ${l}%, ${round(color.a, 3)})`
  }
  return `hsl(${h}, ${s}%, ${l}%)`
}

export type ColorFormat = 'hex' | 'rgb' | 'hsl'

export const stringifyColor = (color: HSVA, format: ColorFormat, showAlpha: boolean) => {
  const rgba = hsvaToRgba(color)
  if (format === 'hex') return formatHex(rgba, showAlpha)
  if (format === 'rgb') return formatRgb(rgba, showAlpha)
  return formatHsl(rgba, showAlpha)
}

const parseHex = (input: string): RGBA | null => {
  const value = input.trim()
  const match = value.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i)
  if (!match) return null

  const body = match[1]
  if (!body) return null

  const full =
    body.length === 3 || body.length === 4
      ? body.split('').map(char => char + char).join('')
      : body

  const hasAlpha = full.length === 8
  return normalizeRgba({
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
    a: hasAlpha ? Number.parseInt(full.slice(6, 8), 16) / 255 : 1,
  })
}

const parseRgb = (input: string): RGBA | null => {
  const value = input.trim().toLowerCase()
  const match = value.match(/^rgba?\((.+)\)$/)
  if (!match) return null

  const body = match[1]
  if (!body) return null

  const channels = body.split(',').map(part => part.trim())
  if (channels.length !== 3 && channels.length !== 4) return null

  const [rStr, gStr, bStr, aStr] = channels
  if (!rStr || !gStr || !bStr) return null

  const r = Number.parseFloat(rStr)
  const g = Number.parseFloat(gStr)
  const b = Number.parseFloat(bStr)
  const a = channels.length === 4 && aStr ? Number.parseFloat(aStr) : 1

  if ([r, g, b, a].some(ch => Number.isNaN(ch))) return null

  return normalizeRgba({ r, g, b, a })
}

const parseHsl = (input: string): RGBA | null => {
  const value = input.trim().toLowerCase()
  const match = value.match(/^hsla?\((.+)\)$/)
  if (!match) return null

  const body = match[1]
  if (!body) return null

  const channels = body.split(',').map(part => part.trim())
  if (channels.length !== 3 && channels.length !== 4) return null

  const [hStr, sStr, lStr, aStr] = channels
  if (!hStr || !sStr || !lStr) return null

  const h = Number.parseFloat(hStr.replace('deg', ''))
  const s = Number.parseFloat(sStr.replace('%', '')) / 100
  const l = Number.parseFloat(lStr.replace('%', '')) / 100
  const a = channels.length === 4 && aStr ? Number.parseFloat(aStr) : 1

  if ([h, s, l, a].some(ch => Number.isNaN(ch))) return null

  return hslToRgba({ h, s, l, a })
}

export const parseColor = (input: string): HSVA | null => {
  const parsed = parseHex(input) ?? parseRgb(input) ?? parseHsl(input)
  if (!parsed) return null
  return rgbaToHsva(parsed)
}

export const getEyeDropperCtor = () => {
  if (typeof window === 'undefined') return null
  return (
    window as Window & { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> } }
  ).EyeDropper
}
