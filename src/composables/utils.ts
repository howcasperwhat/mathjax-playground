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

export function fontSize() {
  return Number.parseInt(
    window.getComputedStyle(
      document.documentElement,
    ).fontSize,
  ) || 16
}
