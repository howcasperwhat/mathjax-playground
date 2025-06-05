export interface SerchingElement {
  element: SVGGraphicsElement
  depth: number
}

export class ColorSettings {
  light: string
  dark: string
  color: string
  opacity: number

  constructor(light: string = '#000', dark: string = '#fff') {
    this.light = hexify(light, '#000')
    this.dark = hexify(dark, '#fff')
    this.color = isDark.value ? this.dark : this.light
    this.opacity = 100
  }

  get hex() {
    return hexify(this.color, isDark.value ? this.dark : this.light, this.opacity)
  }

  // get color() {
  //   return hexify(this._color, isDark.value ? this.dark : this.light)
  // }

  // set color(value: string) {
  //   this._color = value
  // }

  // get opacity() {
  //   return shrink(this._opacity)
  // }

  // set opacity(value: number) {
  //   this._opacity = value
  // }
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

  private _mocker = new MockerElement({
    show: {
      backgroundColor: '#fcc70533',
      border: '1px solid #fcc70566',
    },
    hide: {
      backgroundColor: 'transparent',
      border: 'none',
    },
  })

  pen = reactive(new ColorSettings())
  brush = reactive(new ColorSettings())
  global = reactive(new ColorSettings())

  private _active: Ref<string> = ref('')
  memory: Ref<Record<string, Memory>> = ref(PlayGroundState.DEFAULT_MEMORY)
  tabs: Ref<Set<string>> = ref(new Set<string>())
  tex: Ref<string> = ref('')
  svg: Ref<string> = ref('')

  get active() {
    return this._active.value
  }

  set active(name: string) {
    this._active.value = name
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

  init() {
    if (!this.elem)
      return
    const g = this.elem.lastChild! as SVGGElement
    g.removeAttribute('fill')
    g.removeAttribute('stroke')
    this.elem.setAttribute('fill', this.global.hex)
    this.elem.setAttribute('stroke', this.global.hex)
  }

  paintForeground(element: SVGGraphicsElement) {
    if (element === this.elem)
      return message.error('Cannot operate on the root element')
    element.setAttribute('fill', this.pen.hex)
  }

  paintBackground(element: SVGGraphicsElement) {
    if (element === this.elem)
      return message.error('Cannot operate on the root element')
    if (this.isBrushedRect(element.previousElementSibling))
      return

    const [C, P] = [element, element.parentElement] as SVGGraphicsElement[]

    // https://www.w3.org/Graphics/SVG/IG/resources/svgprimer.html#getCTM
    // [[a, c, e], [b, d, f], [0, 0, 1]]
    // a: scaleX, d: scaleY | b: skewY, c: skewX (tanθ) | e: translateX, f: translateY

    const CRM = C.getCTM()!
    const PRM = P.getCTM()!
    const RPM = PRM.inverse()
    if (!RPM)
      return message.error('Parent Element is not invertible')
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
    if (wu === 0 || hu === 0)
      return message.error('scale factor is zero, cannot calculate size.')
    // width and height in the parent coordinate system
    const w = CRect.width / wu
    const h = CRect.height / hu

    const box = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    box.setAttribute('x', `${x}`)
    box.setAttribute('y', `${y}`)
    box.setAttribute('width', `${w}`)
    box.setAttribute('height', `${h}`)
    box.setAttribute('class', PlayGroundState.BRUSH_RECT_CLASS)
    box.setAttribute('fill', this.brush.hex)
    element.before(box)
  }

  eraseForeground(element: SVGGraphicsElement) {
    if (element === this.elem)
      return message.error('Cannot operate on the root element')
    element.removeAttribute('fill')
    element.removeAttribute('fill-opacity')
  }

  eraseBackground(element: SVGGraphicsElement) {
    if (element === this.elem)
      return message.error('Cannot operate on the root element')
    if (this.isBrushedRect(element.previousElementSibling))
      element.previousElementSibling!.remove()
  }

  erase(element: SVGGraphicsElement) {
    if (element === this.elem) {
      message.error('Cannot operate on the root element')
      return
    }
    element.removeAttribute('fill')
    if (this.isBrushedRect(element.previousElementSibling))
      element.previousElementSibling!.remove()
  }

  process(element?: SVGGraphicsElement) {
    if (!element)
      return
    switch (this.tool) {
      case ToolType.Pen:
        this.paintForeground(element)
        break
      case ToolType.Brush:
        this.paintBackground(element)
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
    useLocalStorage(`${APP_NAME}_memory`, this.memory)
    useLocalStorage(`${APP_NAME}_tabs`, this.tabs, {
      serializer: {
        write: (value: Set<string>) => JSON.stringify(Array.from(value)),
        read: (value: string) => new Set(JSON.parse(value)),
      },
    })
    useLocalStorage(`${APP_NAME}_active`, this._active)

    watch(this._tool, () => {
      document.body.style.cursor = this.free
        ? 'auto'
        : 'crosshair'
    })
    watch(isDark, () => {
      for (const settings of [this.pen, this.brush, this.global])
        settings.color = isDark.value ? settings.dark : settings.light
    })
    watch(this._elem, () => this.init())
    watch(this.global, () => this.init())

    useEventListener('keydown', (event) => {
      switch (event.key) {
        case 'Escape':
          this.tool = ToolType.Free
          break
        default:
          break
      }
    })
    useEventListener('click', (event) => {
      if (this.free || !this.elem)
        return
      this.process(this
        .search(event.clientX, event.clientY)
        .sort((a, b) => a.depth - b.depth)
        .at(-1)
        ?.element,
      )
    })
    useEventListener('mousemove', (event) => {
      if (this.free || !this.elem) {
        this._mocker.hide()
        return
      }
      const { top, left } = this.elem.getBoundingClientRect()
      const rect = this
        .search(event.clientX, event.clientY)
        .sort((a, b) => a.depth - b.depth)
        .at(-1)
        ?.element
        .getBoundingClientRect()
      !rect
        ? this._mocker.hide(top, left)
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
    name ??= this._active.value
    this.tabs.value.delete(name)
    this._active.value = Array.from(this.tabs.value).at(0) ?? ''
  }

  delete(name?: string) {
    name ??= this._active.value
    const item = this.memory.value[name]
    if (!item)
      return
    this.tabs.value.delete(name)
    delete this.memory.value[name]
    this._active.value = Array.from(this.tabs.value).at(0) ?? ''
  }

  save(type: 'tex' | 'svg' | 'workspace') {
    const name = this._active.value
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

  rename(o: string, n: string) {
    const item = this.memory.value[o]!
    if (!item)
      return
    this.memory.value[n] = item
    delete this.memory.value[this._active.value]
    this.tabs.value.delete(this._active.value)
    this.tabs.value.add(n)
    this._active.value = n
  }

  move(src: number, tar: number) {
    const len = this.tabs.value.size
    if (src < 0 || tar < 0 || src >= len || tar >= len || src === tar)
      return
    const tabs = Array.from(this.tabs.value)
    const result = []
    for (let i = 0; i < len; i++) {
      if (i === src)
        continue
      if (i === tar && src > tar)
        result.push(tabs[src])
      result.push(tabs[i])
      if (i === tar && src < tar)
        result.push(tabs[src])
    }
    this.tabs.value = new Set(result)
  }
}

export const playState = new PlayGroundState()
