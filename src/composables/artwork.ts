import { copyPng, copyText, debounce, svgToPngDataUrl } from './utils'

interface ArtElement {
  element: Element
  depth: number
}

type Tool = 'paint' | 'brush' | 'eraser' | ''

class ArtWork {
  currentTool = ref<Tool>('')
  element = shallowRef<Element | null>(null)
  pigment = ref<string>('')
  color = ref<string>('')
  mask: HTMLElement

  search(x: number, y: number): ArtElement[] {
    if (!this.element.value)
      return []
    const result: ArtElement[] = []
    const fn = (elem: Element, depth: number) => {
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
    const g = Array.from(element.children).at(-1)
    g?.setAttribute('fill', this.color.value)
    g?.setAttribute('stroke', this.color.value)
  }

  process(element: Element) {
    // // eslint-disable-next-line no-console
    // console.log(element)
    if (this.currentTool.value === 'paint') {
      element.setAttribute('fill', this.pigment.value)
    }
    else if (this.currentTool.value === 'brush') {
      try {
        if (!(element instanceof SVGGraphicsElement))
          return
        const bbox = element.getBBox();

        const parentElement = element.parentElement;
        if (!parentElement) {
          console.error("Parent element not found");
          return;
        }
        if (!(parentElement instanceof SVGGraphicsElement || parentElement instanceof SVGSVGElement)) {
          console.error("Parent element is not an SVGGraphicsElement or SVGSVGElement");
          return;
        }

        const elementCTM = element.getCTM();
        const parentCTM = parentElement.getCTM();

        if (!elementCTM || !parentCTM) {
          console.error("CTM not found");
          return;
        }

        const parentInverseCTM = parentCTM.inverse();
        if (!parentInverseCTM) {
          console.error("Inverse CTM not found");
          return;
        }

        const relativeMatrix = parentInverseCTM.multiply(elementCTM);


        const box = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

        box.setAttribute('width', `${bbox.width}`);
        box.setAttribute('height', `${bbox.height}`);

        const svgPoint = element.ownerSVGElement?.createSVGPoint();
        if (svgPoint) {
          svgPoint.x = bbox.x;
          svgPoint.y = bbox.y;
          const transformedPoint = svgPoint.matrixTransform(relativeMatrix);
          box.setAttribute('x', `${transformedPoint.x}`);
          box.setAttribute('y', `${transformedPoint.y}`);
        } else {
          console.warn("SVGPoint not supported");
          return;
        }

        box.setAttribute('stroke', this.pigment.value);
        box.setAttribute('stroke-width', '1');
        box.setAttribute('fill', this.pigment.value);

        element.before(box);

      } catch (e) {
        console.error("Handle error", e);
      }
    }
    else if (this.currentTool.value === 'eraser') {
      element.setAttribute('fill', this.color.value)
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
      // eslint-disable-next-line no-console
      console.log('element changed')
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

  switchTool(tool: Tool) {
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

  download(type: 'png' | 'svg') {
    // TODO
    return type
  }

  save() {
    // TODO
  }
}

export const art = new ArtWork()
