class ArtWork {
  currentTool = ref('')
  element = ref<Element | null>(null)

  constructor() {
    watch(this.currentTool, () => {
      console.log(this.currentTool.value)
      if (this.currentTool.value !== '') {
        document.body.style.cursor = `crosshair`
      } else {
        document.body.style.cursor = 'auto'
      }
    })
    document.addEventListener('click', (event) => {
      if (this.currentTool.value === '' || !this.element.value) return
      if (!this.element.value.contains(event.target as Element)) return
    })
  }

  switchTool(tool: string) {
    if (this.currentTool.value === tool) {
      this.currentTool.value = ''
    } else {
      this.currentTool.value = tool
    }
  }

  setElement(element: Element | null) {
    this.element.value = element
  }

  private copySVG() {
    const svg = this.element.value?.querySelector('svg')
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svg)
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    navigator.clipboard.write([
      new ClipboardItem({
        'image/svg+xml': blob,
      }),
    ])
  }

  private copyPNG() {
    const svg = this.element.value?.querySelector('svg')
    if (!svg) return
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const bbox = svg.getBBox()
    canvas.width = bbox.width
    canvas.height = bbox.height
    const data = new XMLSerializer().serializeToString(svg)
    const DOMURL = window.URL || window.webkitURL || window
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        if (blob) {
          navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ])
        }
      }, 'image/png')
      DOMURL.revokeObjectURL(data)
    }
    img.src = DOMURL.createObjectURL(new Blob([data], { type: 'image/svg+xml' }))
  }

  copy(type: 'png' | 'svg') {
    if (!this.element.value)
      return
    
    if (type === 'png') {
      this.copyPNG()
    } else {
      this.copySVG()
    }
  }

  save(type: 'png' | 'svg') {
    // TODO
  }
}

export const art = new ArtWork()