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
  private readonly TRANSITION_EASING = 'linear'
  private readonly TRANSITION_PROPERTIES = [
    'width',
    'height',
    'top',
    'left',
  ].map(prop =>
    `${prop} ${this.TRANSITION_DURATION}s ${this.TRANSITION_EASING}`,
  ).join(', ')

  private state: 'show' | 'hide' = 'hide'
  private _elem: HTMLDivElement
  private _showStyle?: Style
  private _hideStyle?: Style

  constructor(options?: MockerElementOptions) {
    this._showStyle = options?.show
    this._hideStyle = options?.hide
    this._elem = document.createElement('div')
    this._elem.style.position = 'absolute'
    this._elem.style.zIndex = '9999'
    this._elem.style.transition = this.TRANSITION_PROPERTIES
    document.body.appendChild(this._elem)
  }

  public hide(top: number = 0, left: number = 0) {
    Object.assign(this._elem.style, this._hideStyle)
    this._elem.style.width = '0'
    this._elem.style.height = '0'
    this._elem.style.top = `${top}px`
    this._elem.style.left = `${left}px`
    this.state = 'hide'
  }

  public show(options: MockerElementShowOptions) {
    Object.assign(this._elem.style, this._showStyle)
    Object.assign(this._elem.style, {
      width: options.w,
      height: options.h,
      left: options.x,
      top: options.y,
    })
    if (this.state === 'hide')
      this._elem.style.transition = 'none'
    else if (this._elem.style.transition === 'none')
      this._elem.style.transition = this.TRANSITION_PROPERTIES
    this.state = 'show'
  }
}
