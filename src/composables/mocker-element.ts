type Style = Partial<CSSStyleDeclaration>

export interface MockerElementOptions {
  show?: Style
  hide?: Style
}

export interface MockerElementShowOptions {
  w: string
  h: string
  x: string
  y: string
}

export class MockerElement {
  private readonly TRANSITION_DURATION = 0.1
  private _elem: HTMLDivElement
  private _showStyle?: Style
  private _hideStyle?: Style

  constructor(options?: MockerElementOptions) {
    this._showStyle = options?.show
    this._hideStyle = options?.hide
    this._elem = document.createElement('div')
    this._elem.style.position = 'absolute'
    this._elem.style.zIndex = '9999'
    this._elem.style.transition = ['width', 'height', 'top', 'left']
      .map(prop => `${prop} ${this.TRANSITION_DURATION}s linear`)
      .join(', ')
    document.body.appendChild(this._elem)
  }

  public hide(x: number = 0, y: number = 0) {
    Object.assign(this._elem.style, this._hideStyle)
    this._elem.style.width = '0'
    this._elem.style.height = '0'
    this._elem.style.top = `${x}px`
    this._elem.style.left = `${y}px`
  }

  public show(options: MockerElementShowOptions) {
    Object.assign(this._elem.style, this._showStyle)
    Object.assign(this._elem.style, {
      width: options.w,
      height: options.h,
      left: options.x,
      top: options.y,
    })
  }
}
