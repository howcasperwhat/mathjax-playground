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
