import { copyPng, copyText, debounce, svgToPngDataUrl } from './utils'

interface ArtElement {
  element: Element
  depth: number
}

type Tool = 'pen' | 'brush' | 'eraser' | ''
// 200 000 characters => 1MB
interface Memory {
  tex: string
  preview?: string
}

class ArtWork {
  static readonly MAX_SIZE = 2e6
  name = ref('')
  currentTool = ref<Tool>('')
  tex = ref(`\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}`)
  element = shallowRef<Element | null>(null)
  // pigment = ref<string>('')
  // color = ref<string>('')
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

  mask: HTMLElement
  memory: Ref<Record<string, Memory>> = ref({
    Foo: {
      tex: '\\frac{1}{2}',
    },
    Bar: {
      tex: '\\frac{1}{3}',
    },
    Foo1: {
      tex: '\\frac{1}{2}',
    },
    Bar1: {
      tex: '\\frac{1}{3}',
    },
    Foo2: {
      tex: '\\frac{1}{2}',
    },
    Bar2: {
      tex: '\\frac{1}{3}',
    },
    Foo3: {
      tex: '\\frac{1}{2}',
    },
    Bar3: {
      tex: '\\frac{1}{3}',
    },
    Foo4: {
      tex: '\\frac{1}{2}',
    },
    Bar4: {
      tex: '\\frac{1}{3}',
    },
    Foo5: {
      tex: '\\frac{1}{2}',
    },
    Bar5: {
      tex: '\\frac{1}{3}',
    },
    FooBar: {
      tex: '\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}',
      preview: '<svg xmlns="http://www.w3.org/2000/svg" width="25.943ex" height="6.354ex" role="img" focusable="false" viewBox="0 -1562.5 11466.7 2808.5" xmlns:xlink="http://www.w3.org/1999/xlink" style="vertical-align: -2.819ex;"><defs><path id="MJX-1-TEX-LO-2211" d="M60 948Q63 950 665 950H1267L1325 815Q1384 677 1388 669H1348L1341 683Q1320 724 1285 761Q1235 809 1174 838T1033 881T882 898T699 902H574H543H251L259 891Q722 258 724 252Q725 250 724 246Q721 243 460 -56L196 -356Q196 -357 407 -357Q459 -357 548 -357T676 -358Q812 -358 896 -353T1063 -332T1204 -283T1307 -196Q1328 -170 1348 -124H1388Q1388 -125 1381 -145T1356 -210T1325 -294L1267 -449L666 -450Q64 -450 61 -448Q55 -446 55 -439Q55 -437 57 -433L590 177Q590 178 557 222T452 366T322 544L56 909L55 924Q55 945 60 948Z"></path><path id="MJX-1-TEX-I-1D456" d="M184 600Q184 624 203 642T247 661Q265 661 277 649T290 619Q290 596 270 577T226 557Q211 557 198 567T184 600ZM21 287Q21 295 30 318T54 369T98 420T158 442Q197 442 223 419T250 357Q250 340 236 301T196 196T154 83Q149 61 149 51Q149 26 166 26Q175 26 185 29T208 43T235 78T260 137Q263 149 265 151T282 153Q302 153 302 143Q302 135 293 112T268 61T223 11T161 -11Q129 -11 102 10T74 74Q74 91 79 106T122 220Q160 321 166 341T173 380Q173 404 156 404H154Q124 404 99 371T61 287Q60 286 59 284T58 281T56 279T53 278T49 278T41 278H27Q21 284 21 287Z"></path><path id="MJX-1-TEX-N-3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path><path id="MJX-1-TEX-N-31" d="M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z"></path><path id="MJX-1-TEX-I-1D45B" d="M21 287Q22 293 24 303T36 341T56 388T89 425T135 442Q171 442 195 424T225 390T231 369Q231 367 232 367L243 378Q304 442 382 442Q436 442 469 415T503 336T465 179T427 52Q427 26 444 26Q450 26 453 27Q482 32 505 65T540 145Q542 153 560 153Q580 153 580 145Q580 144 576 130Q568 101 554 73T508 17T439 -10Q392 -10 371 17T350 73Q350 92 386 193T423 345Q423 404 379 404H374Q288 404 229 303L222 291L189 157Q156 26 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 112 180T152 343Q153 348 153 366Q153 405 129 405Q91 405 66 305Q60 285 60 284Q58 278 41 278H27Q21 284 21 287Z"></path><path id="MJX-1-TEX-N-32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path><path id="MJX-1-TEX-N-28" d="M94 250Q94 319 104 381T127 488T164 576T202 643T244 695T277 729T302 750H315H319Q333 750 333 741Q333 738 316 720T275 667T226 581T184 443T167 250T184 58T225 -81T274 -167T316 -220T333 -241Q333 -250 318 -250H315H302L274 -226Q180 -141 137 -14T94 250Z"></path><path id="MJX-1-TEX-N-2B" d="M56 237T56 250T70 270H369V420L370 570Q380 583 389 583Q402 583 409 568V270H707Q722 262 722 250T707 230H409V-68Q401 -82 391 -82H389H387Q375 -82 369 -68V230H70Q56 237 56 250Z"></path><path id="MJX-1-TEX-N-29" d="M60 749L64 750Q69 750 74 750H86L114 726Q208 641 251 514T294 250Q294 182 284 119T261 12T224 -76T186 -143T145 -194T113 -227T90 -246Q87 -249 86 -250H74Q66 -250 63 -250T58 -247T55 -238Q56 -237 66 -225Q221 -64 221 250T66 725Q56 737 55 738Q55 746 60 749Z"></path><path id="MJX-1-TEX-N-36" d="M42 313Q42 476 123 571T303 666Q372 666 402 630T432 550Q432 525 418 510T379 495Q356 495 341 509T326 548Q326 592 373 601Q351 623 311 626Q240 626 194 566Q147 500 147 364L148 360Q153 366 156 373Q197 433 263 433H267Q313 433 348 414Q372 400 396 374T435 317Q456 268 456 210V192Q456 169 451 149Q440 90 387 34T253 -22Q225 -22 199 -14T143 16T92 75T56 172T42 313ZM257 397Q227 397 205 380T171 335T154 278T148 216Q148 133 160 97T198 39Q222 21 251 21Q302 21 329 59Q342 77 347 104T352 209Q352 289 347 316T329 361Q302 397 257 397Z"></path></defs><g stroke="#ffffff" fill="#ffffff" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="munderover"><g data-mml-node="mo"><use data-c="2211" xlink:href="#MJX-1-TEX-LO-2211"></use></g><g data-mml-node="TeXAtom" transform="translate(148.2,-1087.9) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="mi"><use data-c="1D456" xlink:href="#MJX-1-TEX-I-1D456"></use></g><g data-mml-node="mo" transform="translate(345,0)"><use data-c="3D" xlink:href="#MJX-1-TEX-N-3D"></use></g><g data-mml-node="mn" transform="translate(1123,0)"><use data-c="31" xlink:href="#MJX-1-TEX-N-31"></use></g></g><g data-mml-node="TeXAtom" transform="translate(509.9,1150) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="mi"><use data-c="1D45B" xlink:href="#MJX-1-TEX-I-1D45B"></use></g></g></g><g data-mml-node="msup" transform="translate(1610.7,0)"><g data-mml-node="mi"><use data-c="1D456" xlink:href="#MJX-1-TEX-I-1D456"></use></g><g data-mml-node="mn" transform="translate(378,413) scale(0.707)"><use data-c="32" xlink:href="#MJX-1-TEX-N-32"></use></g></g><g data-mml-node="mo" transform="translate(2670,0)"><use data-c="3D" xlink:href="#MJX-1-TEX-N-3D"></use></g><g data-mml-node="mfrac" transform="translate(3725.8,0)"><g data-mml-node="mrow" transform="translate(220,710)"><g data-mml-node="mi"><use data-c="1D45B" xlink:href="#MJX-1-TEX-I-1D45B"></use></g><g data-mml-node="mo" transform="translate(600,0)"><use data-c="28" xlink:href="#MJX-1-TEX-N-28"></use></g><g data-mml-node="mi" transform="translate(989,0)"><use data-c="1D45B" xlink:href="#MJX-1-TEX-I-1D45B"></use></g><g data-mml-node="mo" transform="translate(1811.2,0)"><use data-c="2B" xlink:href="#MJX-1-TEX-N-2B"></use></g><g data-mml-node="mn" transform="translate(2811.4,0)"><use data-c="31" xlink:href="#MJX-1-TEX-N-31"></use></g><g data-mml-node="mo" transform="translate(3311.4,0)"><use data-c="29" xlink:href="#MJX-1-TEX-N-29"></use></g><g data-mml-node="mo" transform="translate(3700.4,0)"><use data-c="28" xlink:href="#MJX-1-TEX-N-28"></use></g><g data-mml-node="mn" transform="translate(4089.4,0)"><use data-c="32" xlink:href="#MJX-1-TEX-N-32"></use></g><g data-mml-node="mi" transform="translate(4589.4,0)"><use data-c="1D45B" xlink:href="#MJX-1-TEX-I-1D45B"></use></g><g data-mml-node="mo" transform="translate(5411.7,0)"><use data-c="2B" xlink:href="#MJX-1-TEX-N-2B"></use></g><g data-mml-node="mn" transform="translate(6411.9,0)"><use data-c="31" xlink:href="#MJX-1-TEX-N-31"></use></g><g data-mml-node="mo" transform="translate(6911.9,0)"><use data-c="29" xlink:href="#MJX-1-TEX-N-29"></use></g></g><g data-mml-node="mn" transform="translate(3620.4,-686)"><use data-c="36" xlink:href="#MJX-1-TEX-N-36"></use></g><rect width="7500.9" height="60" x="120" y="220"></rect></g></g></g></svg>',
    },
  })

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
    g.setAttribute('fill', this.color.global)
    g.setAttribute('stroke', this.color.global)
  }

  process(element: Element) {
    // // eslint-disable-next-line no-console
    // console.log(element)
    if (this.currentTool.value === 'pen') {
      element.setAttribute('fill', this.color.pen)
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
      this.color.pen = isDark.value ? '#000000' : '#ffffff'
      this.color.brush = isDark.value ? '#ffffff' : '#000000'
      this.color.global = isDark.value ? '#ffffff' : '#000000'
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

    useStorage('memory', this.memory)
  }

  switchTool(tool: Tool = '') {
    if (this.currentTool.value === tool)
      this.currentTool.value = ''
    else
      this.currentTool.value = tool
  }

  setElement(element: Element | null) {
    // console.log(this.tex.value)
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

  usage(memory: Record<string, Memory>) {
    const usage = Object.entries(memory).reduce(
      (acc, [key, value]) =>
        acc + key.length + value.tex.length
        + (value.preview?.length ?? 0),
      0,
    )
    return usage / ArtWork.MAX_SIZE
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
}

export const art = new ArtWork()
