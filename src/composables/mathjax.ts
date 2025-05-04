import { browserAdaptor } from 'mathjax-full/js/adaptors/browserAdaptor'
import { HTMLDocument } from 'mathjax-full/js/handlers/html/HTMLDocument'
import { HTMLMathItem } from 'mathjax-full/js/handlers/html/HTMLMathItem'
import { TeX } from 'mathjax-full/js/input/tex'
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages'
import { SVG } from 'mathjax-full/js/output/svg'

const MATHJAX_PX_PER_EX = 8
const DEV_FONTSIZE = 16

class MathJax {
  private document: HTMLDocument<any, any, any>
  private tex: TeX<any, any, any>
  private svg: SVG<any, any, any>

  public constructor() {
    this.tex = new TeX({ packages: AllPackages })
    this.svg = new SVG()
    this.document = new HTMLDocument(
      document,
      browserAdaptor(),
      {
        InputJax: this.tex,
        OutputJax: this.svg,
      },
    )
  }

  public reset() {
    this.tex.parseOptions.tags.reset(0)
  }

  public from(tex: string): SVGSVGElement {
    this.reset()
    const math = new HTMLMathItem(tex, this.tex, true)
    math.setMetrics(16, 8, 80 * 16, 100000, 1)
    math.compile(this.document)
    math.typeset(this.document)
    const elem = math.typesetRoot.firstChild as SVGSVGElement
    const width = Number.parseInt(elem.getAttribute('width') ?? '0')
    const height = Number.parseInt(elem.getAttribute('height') ?? '0')
    const factor = MATHJAX_PX_PER_EX * fontSize() / DEV_FONTSIZE
    elem.setAttribute('width', `${width * factor}`)
    elem.setAttribute('height', `${height * factor}`)
    return elem
  }
}

export const mathjax = new MathJax()
