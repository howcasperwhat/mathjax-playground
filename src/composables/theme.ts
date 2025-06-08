export const isDark = useDark()

export const toggleDark = useToggle(isDark)

export function toggleTheme(event?: MouseEvent) {
  // @ts-expect-error: Experimental API
  const isAppearanceTransition = document.startViewTransition
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!isAppearanceTransition) {
    toggleDark()
    return
  }
  const transition = document.startViewTransition(async () => {
    await nextTick()
    toggleDark()
  })
  const x = event ? event.clientX : useWindowSize().width.value >> 1
  const y = event ? event.clientY : useWindowSize().height.value >> 1
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )
  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    document.documentElement.animate({
      clipPath: isDark.value
        ? [...clipPath].reverse()
        : clipPath,
    }, {
      duration: 400,
      easing: 'ease-in',
      pseudoElement: isDark.value
        ? '::view-transition-old(root)'
        : '::view-transition-new(root)',
    })
  })
}
