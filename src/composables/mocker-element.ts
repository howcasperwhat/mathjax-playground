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
  private _elem: HTMLDivElement
  private _showStyle?: Style
  private _hideStyle?: Style

  constructor(options?: MockerElementOptions) {
    this._showStyle = options?.show
    this._hideStyle = options?.hide
    this._elem = document.createElement('div')
    this._elem.style.position = 'absolute'
    this._elem.style.zIndex = '9999'
    this.hide()
    document.body.appendChild(this._elem)
  }

  public hide() {
    Object.assign(this._elem.style, this._hideStyle)
    this._elem.style.width = '0'
    this._elem.style.height = '0'
    this._elem.style.top = '0'
    this._elem.style.left = '0'
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
