export function dataUrlToBlob(dataurl: string) {
  const parts = dataurl.split(',')
  const type = parts[0].split(':')[1].split(';')[0]
  const base64 = atob(parts[1])
  const arr = new Uint8Array(base64.length)
  for (let i = 0; i < base64.length; i++)
    arr[i] = base64.charCodeAt(i)
  return new Blob([arr], { type })
}

export async function svgToPngDataUrl(svg: string) {
  const scaleFactor = 8

  const canvas = document.createElement('canvas')
  const image = document.createElement('img')
  const canvasCtx = canvas.getContext('2d')!

  return new Promise<string>((resolve) => {
    image.crossOrigin = 'anonymous'
    image.onload = async () => {
      Object.assign(canvas, {
        width: image.naturalWidth * scaleFactor,
        height: image.naturalHeight * scaleFactor,
      })
      canvasCtx.drawImage(image, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/png'))
    }
    image.src = URL.createObjectURL(
      new Blob([svg], {
        type: 'image/svg+xml;charset=utf-8',
      }),
    )
  })
}

export function getMaybeTransformedBBox(element: SVGGraphicsElement) {
  const [C, P] = [element, element.parentElement] as SVGGraphicsElement[]

  // https://www.w3.org/Graphics/SVG/IG/resources/svgprimer.html#getCTM
  // [[a, c, e], [b, d, f], [0, 0, 1]]
  // a: scaleX, d: scaleY | b: skewY, c: skewX (tanθ) | e: translateX, f: translateY

  const CRM = C.getCTM()!
  const PRM = P.getCTM()!
  const RPM = PRM.inverse()
  if (!RPM) {
    message.error('Parent Element is not invertible')
    return { x: 0, y: 0, w: 0, h: 0 }
  }
  const CPM = RPM.multiply(CRM)

  // https://www.w3.org/Graphics/SVG/IG/resources/svgprimer.html#getBBox
  // DOMRect that before transform (if has transform)
  const CBox = C.getBBox()
  // Transform to the parent coordinate system
  const x = CPM.a * CBox.x + CPM.c * CBox.y + CPM.e
  const y = CPM.b * CBox.x + CPM.d * CBox.y + CPM.f

  const CRect = element.getBoundingClientRect()
  const PSM = P.getScreenCTM()!
  // The unit length of the base coordinate of
  // the parent element in the screen coordinate system
  const wu = Math.sqrt(PSM.a * PSM.a + PSM.c * PSM.c)
  const hu = Math.sqrt(PSM.b * PSM.b + PSM.d * PSM.d)
  if (wu === 0 || hu === 0) {
    message.error('scale factor is zero, cannot calculate size.')
    return { x: 0, y: 0, w: 0, h: 0 }
  }
  // width and height in the parent coordinate system
  const w = CRect.width / wu
  const h = CRect.height / hu
  return { x, y, w, h }
}

export async function copyPng(dataUrl: string): Promise<boolean> {
  try {
    const blob = dataUrlToBlob(dataUrl)
    const item = new ClipboardItem({ 'image/png': blob })
    await navigator.clipboard.write([item])
    return true
  }
  catch (e) {
    console.error('Failed to copy png error', e)
    return false
  }
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  }
  catch (e) {
    console.error('Failed to copy text error', e)
    return false
  }
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

export function shrink(value: number, min: number = 0, max: number = 100) {
  return Math.max(min, Math.min(max, value))
}

export function hexify(color: string, _default: string, opacity: number = 100) {
  let hex = color.startsWith('#') ? color : `#${color}`
  if (!/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(color))
    hex = _default
  hex = color
  opacity = shrink(opacity, 0, 100)
  if (hex.length === 4)
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
  if (opacity < 100)
    return `${hex}${Math.round((opacity / 100) * 255).toString(16).padStart(2, '0')}`
  return hex
}

export function fontSize() {
  return Number.parseInt(
    window.getComputedStyle(
      document.documentElement,
    ).fontSize,
  ) || 16
}
