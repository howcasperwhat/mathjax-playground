export function shrink(value: number, min: number = 0, max: number = 100) {
  return Math.max(min, Math.min(max, value))
}
