import { copyPng, copyText, debounce, svgToPngDataUrl } from './utils'

interface ArtElement {
  element: Element
  depth: number
}

type Tool = 'pen' | 'brush' | 'eraser' | ''

class ArtWork {
  currentTool = ref<Tool>('')
  element = shallowRef<Element | null>(null)
  pigment = ref<string>('')
  color = ref<string>('')
  opacity = ref<number>(1.0)
  mask: HTMLElement

  isBrushedRect(elem: Element) {
    return elem.tagName === 'rect' && elem.classList.contains('brushed-rect')
  }

  search(x: number, y: number): ArtElement[] {
    if (!this.element.value)
      return []
    const result: ArtElement[] = []
    const fn = (elem: Element, depth: number) => {
      if (this.isBrushedRect(elem))
        return
      const rect = elem.getBoundingClientRect()
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom)
        result.push({ element: elem, depth })
      Array.from(elem.children).forEach(child => fn(child, depth + 1))
    }
    fn(this.element.value, 0)
    return result
  }

  replace(element: Element) {
    // const fn = (elem: Element) => {
    //   if (elem.getAttribute('fill'))
    //     elem.setAttribute('fill', this.color.value)
    //   if (elem.getAttribute('stroke'))
    //     elem.setAttribute('stroke', this.color.value)
    //   Array.from(elem.children).forEach(child => fn(child))
    // }
    // fn(element)
    // const g = Array.from(element.children).at(-1)
    const g = element.lastChild! as SVGGElement
    g.setAttribute('fill', this.color.value)
    g.setAttribute('stroke', this.color.value)
  }

  process(element: Element) {
    // // eslint-disable-next-line no-console
    // console.log(element)
    if (this.currentTool.value === 'pen') {
      element.setAttribute('fill', this.pigment.value)
    }
    else if (this.currentTool.value === 'brush') {
      if (element.previousElementSibling && this.isBrushedRect(element.previousElementSibling))
        return
      try {
        // 1. use getBBox() to get the bounding box of the element
        if (!(element instanceof SVGGraphicsElement)) {
          /* ... error handling ... */
          return
        }
        const bbox = element.getBBox()

        // 2. get the parent element of the SVG element
        const parentElement = element.parentElement
        if (!parentElement) {
          /* ... error handling ... */
          return
        }
        if (!(parentElement instanceof SVGGraphicsElement || parentElement instanceof SVGSVGElement)) {
          /* ... error handling ... */
          return
        }

        // 3. calculate the transformation matrix (element-to-parent)
        const elementCTM = element.getCTM()
        const parentCTM = parentElement.getCTM()
        if (!elementCTM || !parentCTM) {
          /* ... error handling ... */
          return
        }
        const parentInverseCTM = parentCTM.inverse()
        if (!parentInverseCTM) {
          /* ... error handling ... */
          return
        }
        const relativeMatrix = parentInverseCTM.multiply(elementCTM)

        // 4. calculate the position (x, y) relative to the parent element
        const svgRoot = element.ownerSVGElement
        if (!svgRoot) {
          /* ... error handling ... */
          return
        }
        const svgPoint = svgRoot.createSVGPoint()
        let boxX: number, boxY: number
        if (svgPoint) {
          svgPoint.x = bbox.x
          svgPoint.y = bbox.y
          const transformedPoint = svgPoint.matrixTransform(relativeMatrix)
          boxX = transformedPoint.x
          boxY = transformedPoint.y
        }
        else {
          console.warn('SVGPoint not supported, cannot calculate position.')
          return
        }

        // 5. calculate the size (width, height) - reverse from screen size to parent coordinate system
        const screenBBox = element.getBoundingClientRect() // final pixel size

        // get the screen transformation matrix of the parent element to get the local scaling
        const parentScreenCTM = (parentElement as SVGGraphicsElement).getScreenCTM()
        if (!parentScreenCTM) {
          console.warn('cannot get parent screen CTM, cannot calculate size.')
          return
        }

        // calculate the effective scaling factor of the parent coordinate system (considering rotation/tilt)
        // use Math.abs to handle negative d value caused by scale(1,-1), we need the magnitude of scaling
        const parentScaleX = Math.sqrt(parentScreenCTM.a * parentScreenCTM.a + parentScreenCTM.c * parentScreenCTM.c)
        const parentScaleY = Math.sqrt(parentScreenCTM.b * parentScreenCTM.b + parentScreenCTM.d * parentScreenCTM.d)

        // prevent division by zero error
        if (parentScaleX === 0 || parentScaleY === 0) {
          console.warn('scale factor is zero, cannot calculate size.')
          return
        }

        // convert screen pixel size back to parent coordinate system units
        const boxWidth = screenBBox.width / parentScaleX
        const boxHeight = screenBBox.height / parentScaleY

        // 6. create a rectangle
        const box = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

        // 7. set attributes
        box.setAttribute('x', `${boxX}`)
        box.setAttribute('y', `${boxY}`)
        box.setAttribute('width', `${boxWidth}`)
        box.setAttribute('height', `${boxHeight}`)
        box.setAttribute('class', 'brushed-rect')

        // 8. set styles
        box.setAttribute('stroke', this.pigment.value)
        // width of the stroke '1' is 1 unit in the parent coordinate system. If you want it to be visually 1 pixel:
        // const strokeWidthInParentUnits = 1 / Math.max(parentScaleX, parentScaleY); // get the larger scale factor
        // box.setAttribute('stroke-width', `${strokeWidthInParentUnits}`);
        box.setAttribute('stroke-width', '1')
        box.setAttribute('fill', this.pigment.value)

        // 9. insert into DOM
        element.before(box)
      }
      catch (e) {
        console.error('error when handling brush', e)
      }
    }
    else if (this.currentTool.value === 'eraser') {
      element.removeAttribute('fill')
      if (element.previousElementSibling && this.isBrushedRect(element.previousElementSibling)) {
        element.previousElementSibling.remove()
      }
    }
  }

  resetMask() {
    this.mask.style.width = '0'
    this.mask.style.height = '0'
    this.mask.style.top = '0'
    this.mask.style.left = '0'
  }

  constructor() {
    watch(this.currentTool, () => {
      if (this.currentTool.value !== '')
        document.body.style.cursor = `crosshair`
      else
        document.body.style.cursor = 'auto'
    })
    watch(this.element, () => {
      // // eslint-disable-next-line no-console
      // console.log('element changed')
      this.element.value && this.replace(this.element.value)
    })
    watch(isDark, () => {
      this.pigment.value = isDark.value ? '#000000' : '#ffffff'
      this.color.value = isDark.value ? '#ffffff' : '#000000'
      this.element.value && this.replace(this.element.value)
    }, { immediate: true })

    this.mask = document.createElement('div')
    this.mask.style.position = 'absolute'
    this.resetMask()
    this.mask.style.pointerEvents = 'none'
    this.mask.style.zIndex = '9999'
    this.mask.style.backgroundColor = '#FCC705'
    this.mask.style.opacity = '0.2'
    this.mask.className = 'mask'
    document.body.appendChild(this.mask)

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.currentTool.value = ''
      }
    })
    document.addEventListener('click', (event) => {
      if (this.currentTool.value === '' || !this.element.value)
        return
      if (!this.element.value.contains(event.target as Element))
        return
      const elements = this.search(event.clientX, event.clientY)
      const sorted = elements.sort((a, b) => a.depth - b.depth)
      sorted.length && this.process(sorted.at(-1)!.element)
    })
    document.addEventListener('mousemove', debounce((event) => {
      // // eslint-disable-next-line no-console
      // console.log('mousemove')
      if (this.currentTool.value === '' || !this.element.value) {
        this.resetMask()
        return
      }
      if (!this.element.value.contains(event.target as Element)) {
        this.resetMask()
        return
      }
      const elements = this.search(event.clientX, event.clientY)
      const sorted = elements.sort((a, b) => a.depth - b.depth)
      const ae = sorted.at(-1)
      if (!ae)
        return
      const elem = ae.element as HTMLElement
      const rect = elem.getBoundingClientRect()
      this.mask.style.width = `${rect.width}px`
      this.mask.style.height = `${rect.height}px`
      this.mask.style.top = `${rect.top}px`
      this.mask.style.left = `${rect.left}px`
    }, 10))
  }

  switchTool(tool: Tool = '') {
    if (this.currentTool.value === tool)
      this.currentTool.value = ''
    else
      this.currentTool.value = tool
  }

  setElement(element: Element | null) {
    this.element.value = element
  }

  async copy(type: 'png' | 'svg') {
    if (!this.element.value)
      return
    if (type === 'png') {
      copyPng(await svgToPngDataUrl(this.element.value.outerHTML))
    }
    else {
      copyText(this.element.value.outerHTML)
    }
  }

  async download(type: 'png' | 'svg') {
    if (!this.element.value)
      return

    let blob: Blob
    let name: string

    if (type === 'svg') {
      blob = new Blob([this.element.value.outerHTML], { type: 'image/svg+xml;charset=utf-8' })
      name = 'mathjax-playground-download.svg'
    }
    else {
      blob = dataUrlToBlob(await svgToPngDataUrl(this.element.value.outerHTML))
      name = 'mathjax-playground-download.png'
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    a.remove()
    URL.revokeObjectURL(url) // Clean up the object URL
  }

  save() {
    // TODO
  }
}

export const art = new ArtWork()
