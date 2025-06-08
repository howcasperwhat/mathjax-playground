export function fontSize(
  elem: HTMLElement = document.documentElement,
): number {
  return Number.parseInt(
    window.getComputedStyle(
      elem,
    ).fontSize,
  ) || 16
}
