interface SerchingElement {
  element: SVGGraphicsElement
  depth: number
}

export enum ToolType {
  Pen,
  Brush,
  Eraser,
  Free,
}

export class PlayGroundState {
  static readonly MAX_SIZE = 2e6
  static readonly BRUSH_RECT_CLASS = 'brushed-rect'
  static readonly DEFAULT_NAME = ''
  static readonly DEFAULT_TOOL: ToolType = ToolType.Free
  static readonly DEFAULT_MEMORY = DEFAULT_MEMORY

  private _tool = ref(PlayGroundState.DEFAULT_TOOL)
  private _elem: Ref<SVGSVGElement | null> = ref(null)

  get tool() {
    return this._tool.value
  }

  set tool(tool: ToolType) {
    const prev = this._tool.value
    this._tool.value = prev === tool ? ToolType.Free : tool
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

  memory: Ref<Record<string, Memory>> = ref(PlayGroundState.DEFAULT_MEMORY)
  tabs: Ref<Set<string>> = ref(new Set<string>())
  active: Ref<string> = ref('')
  tex: Ref<string> = ref('')
  svg: Ref<string> = ref('')

  switchActive(name: string) {
    this.active.value = name
  }

  isBrushedRect(elem: Element | null) {
    return elem
      && elem.tagName === 'rect'
      && elem.classList.contains(PlayGroundState.BRUSH_RECT_CLASS)
  }

  search(x: number, y: number): SerchingElement[] {
    if (!this.elem)
      return []
    const result: SerchingElement[] = []
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
    useLocalStorage('memory', this.memory)
    useLocalStorage('tabs', this.tabs, {
      serializer: {
        write: (value: Set<string>) => JSON.stringify(Array.from(value)),
        read: (value: string) => new Set(JSON.parse(value)),
      },
    })
    useLocalStorage('active', this.active)

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

  usage(name: string, item: Memory) {
    return [name, item?.tex, item?.svg]
      .filter(x => x !== undefined)
      .map(str => new Blob([str]).size)
      .reduce((acc, size) => acc + size, 0)
  }

  exists(name: string) {
    if (name === '')
      return true
    return Boolean(this.memory.value[name])
  }

  add(name: string) {
    return this.memory.value[name] = { tex: '' }
  }

  icon(nameOrItem: string | Memory) {
    const item = this.toItem(nameOrItem)
    const tex = item?.tex !== undefined
    const svg = item?.svg !== undefined
    if (tex && svg)
      return 'i:workspace'
    if (tex)
      return 'i:tex'
    if (svg)
      return 'i:svg'
    return 'i:default'
  }

  toItem(nameOrItem: string | Memory): Memory | undefined {
    return typeof nameOrItem === 'string'
      ? this.memory.value[nameOrItem]
      : nameOrItem
  }

  remove(name?: string) {
    name ??= this.active.value
    this.tabs.value.delete(name)
    this.active.value = Array.from(this.tabs.value).at(0) ?? ''
  }

  delete(name?: string) {
    name ??= this.active.value
    const item = this.memory.value[name]
    if (!item)
      return
    this.tabs.value.delete(name)
    delete this.memory.value[name]
    this.active.value = Array.from(this.tabs.value).at(0) ?? ''
  }

  save(type: 'tex' | 'svg' | 'workspace') {
    const name = this.active.value
    const item = this.memory.value[name]
    if (type === 'tex') {
      item.tex = this.tex.value
      item.svg = undefined
    }
    else if (type === 'svg') {
      item.tex = undefined
      item.svg = this.elem?.outerHTML ?? ''
    }
    else if (type === 'workspace') {
      item.tex = this.tex.value
      item.svg = this.elem?.outerHTML ?? ''
    }
  }

  rename(name: string) {
    const item = this.memory.value[this.active.value]!
    if (!item)
      return
    this.memory.value[name] = item
    delete this.memory.value[this.active.value]
    this.tabs.value.delete(this.active.value)
    this.tabs.value.add(name)
    this.active.value = name
  }
}

export const playState = new PlayGroundState()
