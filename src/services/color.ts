export class ColorHandler {
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
}
