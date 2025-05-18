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
  const scaleFactor = 16

  const canvas = document.createElement('canvas')
  const imgPreview = document.createElement('img')
  imgPreview.setAttribute('style', 'position: absolute; top: -9999px')
  document.body.appendChild(imgPreview)
  const canvasCtx = canvas.getContext('2d')!

  const svgBlob: Blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const svgDataUrl = URL.createObjectURL(svgBlob)

  return new Promise<string>((resolve) => {
    imgPreview.onload = async () => {
      const img = new Image()
      const dimensions: { width: number, height: number } = await getDimensions(imgPreview.src)

      Object.assign(canvas, {
        width: dimensions.width * scaleFactor,
        height: dimensions.height * scaleFactor,
      })

      img.crossOrigin = 'anonymous'
      img.src = imgPreview.src
      img.onload = () => {
        canvasCtx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const imgData = canvas.toDataURL('image/png')
        resolve(imgData)
      }

      function getDimensions(
        src: string,
      ): Promise<{ width: number, height: number }> {
        return new Promise((resolve) => {
          const _img = new Image()
          _img.src = src
          _img.onload = () => {
            resolve({
              width: _img.naturalWidth,
              height: _img.naturalHeight,
            })
          }
        })
      }
    }
    imgPreview.src = svgDataUrl
  }).finally(() => {
    document.body.removeChild(imgPreview)
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

export async function copyText(text?: string) {
  if (text) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    }
    catch {
    }
  }
  return false
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
    document.documentElement.style.fontSize,
  ) || 16
}
