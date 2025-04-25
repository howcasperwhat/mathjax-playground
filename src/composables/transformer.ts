import { browserAdaptor } from 'mathjax-full/js/adaptors/browserAdaptor'
import { HTMLDocument } from 'mathjax-full/js/handlers/html/HTMLDocument'
import { HTMLMathItem } from 'mathjax-full/js/handlers/html/HTMLMathItem'
import { TeX } from 'mathjax-full/js/input/tex'
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages'
import { SVG } from 'mathjax-full/js/output/svg'

class Transformer {
  private document: HTMLDocument<any, any, any>
  private tex: TeX<any, any, any>
  private svg: SVG<any, any, any>

  public constructor() {
    this.tex = new TeX({ packages: AllPackages })
    this.svg = new SVG({})
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

  public from(tex: string): HTMLElement {
    this.reset()
    const math = new HTMLMathItem(tex, this.tex, true)
    math.setMetrics(16, 8, 80 * 16, 100000, 1)
    math.compile(this.document)
    math.typeset(this.document)
    return math.typesetRoot
  }
}

export const transformer = new Transformer()
