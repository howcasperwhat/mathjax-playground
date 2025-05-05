import type { Reactive } from 'vue'
import { DEFAULT_MEMORY, DEFAULT_TEX } from './constants'
import { MockerElement } from './mocker-element'

interface ArtElement {
  element: SVGGraphicsElement
  depth: number
}
interface Memory {
  tex: string
  preview?: string
}

export enum ToolType {
  Pen,
  Brush,
  Eraser,
  Free,
}

class PlayGroundState {
  static readonly MAX_SIZE = 2e6
  static readonly BRUSH_RECT_CLASS = 'brushed-rect'
  static readonly DEFAULT_NAME = ''
  static readonly DEFAULT_TOOL: ToolType = ToolType.Free
  static readonly DEFAULT_TEX = DEFAULT_TEX
  static readonly DEFAULT_MEMORY = DEFAULT_MEMORY

  private _name = ref(PlayGroundState.DEFAULT_NAME)
  private _tool = ref(PlayGroundState.DEFAULT_TOOL)
  private _tex = ref(PlayGroundState.DEFAULT_TEX)
  private _elem: Ref<SVGSVGElement | null> = ref(null)

  get name() {
    return this._name.value
  }

  set name(name: string) {
    this._name.value = name
  }

  get tool() {
    return this._tool.value
  }

  set tool(tool: ToolType) {
    const prev = this._tool.value
    this._tool.value = prev === tool ? ToolType.Free : tool
  }

  get tex() {
    return this._tex.value
  }

  set tex(tex: string) {
    this._tex.value = tex
  }

  get elem() {
    return this._elem.value
  }

  set elem(elem: SVGSVGElement | null) {
    this._elem.value = elem
  }

  get cursor() {
    return document.body.style.cursor
  }

  set cursor(value: string) {
    document.body.style.cursor = value
  }

  private _mocker = new MockerElement({
    show: { backgroundColor: '#fcc70533' },
    hide: { backgroundColor: 'transparent' },
  })

  color = reactive({
    pen: '',
    brush: '',
    global: '',
  })

  opacity = reactive({
    pen: 100,
    brush: 100,
    global: 100,
  })

  memory: Reactive<Record<string, Memory>> = reactive(PlayGroundState.DEFAULT_MEMORY)

  isBrushedRect(elem: Element | null) {
    return elem
      && elem.tagName === 'rect'
      && elem.classList.contains(PlayGroundState.BRUSH_RECT_CLASS)
  }

  search(x: number, y: number): ArtElement[] {
    if (!this.elem)
      return []
    const result: ArtElement[] = []
    const fn = (elem: SVGGraphicsElement, depth: number) => {
      if (this.isBrushedRect(elem))
        return
      const rect = elem.getBoundingClientRect()
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom)
        result.push({ element: elem, depth })
      Array.from(elem.children).filter(
        child => child instanceof SVGGraphicsElement,
      ).forEach(child => fn(child, depth + 1))
    }
    fn(this.elem, 0)
    return result
  }

  initColor() {
    if (!this.elem)
      return
    const g = this.elem.lastChild! as SVGGElement
    g.removeAttribute('fill')
    g.removeAttribute('stroke')
    this.elem.setAttribute('fill', this.color.global)
    this.elem.setAttribute('stroke', this.color.global)
  }

  paint(element: SVGGraphicsElement) {
    element.setAttribute('fill', this.color.pen)
  }

  brush(element: SVGGraphicsElement) {
    if (this.isBrushedRect(element.previousElementSibling))
      return
    try {
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
      box.setAttribute('stroke', this.color.brush)
      // width of the stroke '1' is 1 unit in the parent coordinate system. If you want it to be visually 1 pixel:
      // const strokeWidthInParentUnits = 1 / Math.max(parentScaleX, parentScaleY); // get the larger scale factor
      // box.setAttribute('stroke-width', `${strokeWidthInParentUnits}`);
      box.setAttribute('stroke-width', '1')
      box.setAttribute('fill', this.color.brush)

      // 9. insert into DOM
      element.before(box)
    }
    catch (e) {
      console.error('error when handling brush', e)
    }
  }

  erase(element: SVGGraphicsElement) {
    element.removeAttribute('fill')
    if (this.isBrushedRect(element.previousElementSibling))
      element.previousElementSibling!.remove()
  }

  process(element?: SVGGraphicsElement) {
    if (!element)
      return
    switch (this.tool) {
      case ToolType.Pen:
        this.paint(element)
        break
      case ToolType.Brush:
        this.brush(element)
        break
      case ToolType.Eraser:
        this.erase(element)
        break
      default:
        break
    }
  }

  get free() {
    return this.tool === ToolType.Free
  }

  constructor() {
    useStorage('memory', this.memory)

    watch(this._tool, () => {
      this.cursor = this.free
        ? 'auto'
        : 'crosshair'
    })
    watch(this._elem, () => {
      this.initColor()
    })
    watch(isDark, () => {
      this.color.pen = isDark.value ? '#000000' : '#ffffff'
      this.color.brush = isDark.value ? '#ffffff' : '#000000'
      this.color.global = isDark.value ? '#ffffff' : '#000000'
      this.initColor()
    }, { immediate: true })

    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'Escape':
          this.tool = ToolType.Free
          break
        default:
          break
      }
    })
    document.addEventListener('click', (event) => {
      if (this.free || !this.elem)
        return
      this.process(this
        .search(event.clientX, event.clientY)
        .sort((a, b) => a.depth - b.depth)
        .at(-1)
        ?.element,
      )
    })
    document.addEventListener('mousemove', (event) => {
      if (this.free || !this.elem) {
        this._mocker.hide()
        return
      }
      const rect = this
        .search(event.clientX, event.clientY)
        .sort((a, b) => a.depth - b.depth)
        .at(-1)
        ?.element
        .getBoundingClientRect()
      !rect
        ? this._mocker.hide()
        : this._mocker.show({
            w: `${rect.width}px`,
            h: `${rect.height}px`,
            x: `${rect.left}px`,
            y: `${rect.top}px`,
          })
    })
  }

  async copy(type: 'png' | 'svg') {
    if (!this.elem)
      return
    switch (type) {
      case 'png':
        copyPng(await svgToPngDataUrl(this.elem.outerHTML))
        break
      case 'svg':
        copyText(this.elem.outerHTML)
        break
    }
  }

  async download(type: 'png' | 'svg') {
    if (!this.elem)
      return

    const name = `mathjax-playground-download.${type}`
    const blob = type === 'svg'
      ? new Blob([this.elem.outerHTML], { type: 'image/svg+xml;charset=utf-8' })
      : dataUrlToBlob(await svgToPngDataUrl(this.elem.outerHTML))

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  usage(name: string) {
    const memory = this.memory[name]
    return [name, memory.tex, memory?.preview]
      .filter(x => x !== undefined)
      .map(str => new Blob([str]).size)
      .reduce((acc, size) => acc + size, 0)
  }

  save(preview: boolean) {
    // eslint-disable-next-line no-console
    console.log('save', preview)
  }

  preShow(tex: string) {
    // eslint-disable-next-line no-console
    console.log('preShow', tex)
  }

  confirmShow() {
    // eslint-disable-next-line no-console
    console.log('confirmShow')
  }

  cancelShow() {
    // eslint-disable-next-line no-console
    console.log('cancelShow')
  }

  removeShow() {
    // eslint-disable-next-line no-console
    console.log('remove')
  }

  remove(name: string) {
    // eslint-disable-next-line no-console
    console.log('remove', name)
  }

  exists(name: string) {
    return Boolean(this.memory[name])
  }

  add(name: string) {
    this.memory[name] = {
      tex: '',
    }
  }
}

export const playState = new PlayGroundState()
