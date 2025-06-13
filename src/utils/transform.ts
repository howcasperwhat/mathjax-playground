export function dataUrlToBlob(dataurl: string) {
  const parts = dataurl.split(',')
  const type = parts[0].split(':')[1].split(';')[0]
  const base64 = atob(parts[1])
  const arr = new Uint8Array(base64.length)
  for (let i = 0; i < base64.length; i++)
    arr[i] = base64.charCodeAt(i)
  return new Blob([arr], { type })
}

export async function svgToPngDataUrl(svg: string, scale: number = 1) {
  const canvas = document.createElement('canvas')
  const image = document.createElement('img')
  const canvasCtx = canvas.getContext('2d')!

  return new Promise<string>((resolve) => {
    image.crossOrigin = 'anonymous'
    image.onload = async () => {
      Object.assign(canvas, {
        width: image.naturalWidth * scale,
        height: image.naturalHeight * scale,
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
