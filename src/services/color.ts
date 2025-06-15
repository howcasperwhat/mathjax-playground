export class ColorHandler {
  props: Ref<ColorProps>
  hex: ComputedRef<string>

  constructor(light: string = '#000', dark: string = '#fff') {
    this.props = ref({
      light: hexify(light, '#000'),
      dark: hexify(dark, '#fff'),
      color: isDark.value ? hexify(dark, '#fff') : hexify(light, '#000'),
      opacity: 100,
    })
    this.hex = computed(() => {
      return hexify(
        this.props.value.color,
        isDark.value
          ? this.props.value.dark
          : this.props.value.light,
        this.props.value.opacity,
      )
    })
  }
}
