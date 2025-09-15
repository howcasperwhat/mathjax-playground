import { DEFAULT_MEMORY } from '../data/memory'

interface SerchingElement {
  element: SVGGraphicsElement
  depth: number
}

const message = useMessage()

export class AppState {
  static readonly MAX_SIZE = 2e6
  static readonly BRUSH_RECT_CLASS = 'brushed-rect'
  static readonly DEFAULT_NAME = ''
  static readonly DEFAULT_TOOL: ToolType = ToolType.Free
  static readonly DEFAULT_MEMORY = DEFAULT_MEMORY

  private _tool = ref(AppState.DEFAULT_TOOL)
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

  private _ghost = new GhostElement({
    show: {
      backgroundColor: '#fcc70533',
      border: '1px solid #fcc70566',
    },
    hide: {
      backgroundColor: 'transparent',
      border: 'none',
    },
  })

  pen = new ColorHandler()
  brush = new ColorHandler()
  global = new ColorHandler()

  private _active: Ref<string> = ref('')
  memory: Ref<Record<string, Memory>> = ref(AppState.DEFAULT_MEMORY)
  tabs: Ref<Set<string>> = ref(new Set<string>())
  tex: Ref<string> = ref('')
  svg: Ref<string> = ref('')
  picScale: Ref<number> = ref(1)

  get active() {
    return this._active.value
  }

  set active(name: string) {
    this._active.value = name
  }

  isBrushedRect(elem: Element | null) {
    return elem
      && elem.tagName === 'rect'
      && elem.classList.contains(AppState.BRUSH_RECT_CLASS)
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
    this.elem.setAttribute('fill', this.global.hex.value)
    this.elem.setAttribute('stroke', this.global.hex.value)
  }

  paintForeground(element: SVGGraphicsElement) {
    if (element === this.elem)
      return message.error('Cannot operate on the root element')
    element.setAttribute('fill', this.pen.hex.value)
  }

  paintBackground(element: SVGGraphicsElement) {
    if (element === this.elem)
      return message.error('Cannot operate on the root element')
    if (this.isBrushedRect(element.previousElementSibling))
      element.previousElementSibling!.remove()

    const { x, y, w, h } = getMaybeTransformedBBox(element)

    const box = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    box.setAttribute('x', `${x}`)
    box.setAttribute('y', `${y}`)
    box.setAttribute('width', `${w}`)
    box.setAttribute('height', `${h}`)
    box.setAttribute('class', AppState.BRUSH_RECT_CLASS)
    box.setAttribute('fill', this.brush.hex.value)
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
    useAppLocalStorage('memory', this.memory)
    useAppLocalStorage('tabs', this.tabs, {
      serializer: {
        write: (value: Set<string>) => JSON.stringify(Array.from(value)),
        read: (value: string) => new Set(JSON.parse(value)),
      },
    })
    useAppLocalStorage('active', this._active)
    useAppLocalStorage('pic-scale', this.picScale)
    useAppLocalStorage('pen', this.pen.props)
    useAppLocalStorage('brush', this.brush.props)
    useAppLocalStorage('global', this.global.props)

    watch(this._tool, () => {
      document.body.style.cursor = this.free
        ? 'auto'
        : 'crosshair'
    })
    watch(isDark, () => {
      for (const settings of [this.pen, this.brush, this.global]) {
        settings.props.value.color = isDark.value
          ? settings.props.value.dark
          : settings.props.value.light
      }
    })
    watch(this._elem, () => this.init())
    watch(this.global.props, () => this.init(), { deep: true })

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
        this._ghost.hide()
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
        ? this._ghost.hide(top, left)
        : this._ghost.show({
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
    const text = svgToText(this.elem, this.picScale.value)
    switch (type) {
      case 'png':
        await copyPng(await svgToPngDataUrl(text))
        break
      case 'svg':
        await copyText(text)
        break
    }
  }

  async download(type: 'png' | 'svg') {
    if (!this.elem)
      return

    const name = `mathjax-playground-download.${type}`
    const text = svgToText(this.elem, this.picScale.value)
    const blob = type === 'svg'
      ? new Blob([text], { type: 'image/svg+xml;charset=utf-8' })
      : dataUrlToBlob(await svgToPngDataUrl(text))

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

  save(type: 'tex' | 'svg' | 'workspace' | 'auto' = 'auto') {
    const name = this._active.value
    const item = this.memory.value[name]
    const utex = type === 'tex' || type === 'workspace' || (type === 'auto' && item?.tex !== undefined)
    const usvg = type === 'svg' || type === 'workspace' || (type === 'auto' && item?.svg !== undefined)
    utex ? (item.tex = this.tex.value) : (item.tex = undefined)
    usvg ? (item.svg = this.elem?.outerHTML ?? '') : (item.svg = undefined)
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

  update(tex: string, svg?: string) {
    this.tex.value = tex
    this.svg.value = svg ?? mathjax.from(tex).outerHTML
  }
}

export const appState = new AppState()
