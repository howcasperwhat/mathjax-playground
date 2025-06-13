<script setup lang='ts'>
import { clamp } from '@vueuse/core'

const {
  dir,
  size = 1,
  min = 0,
  max = 100,
} = defineProps<{
  dir: 'x' | 'y'
  size?: number
  min?: number
  max?: number
}>()
const perc = defineModel<number>({ default: 50 })

const dragger = useTemplateRef<HTMLElement>('dragger')
const percentage = computed<number>({
  get: () => clamp(Math.round(perc.value), min, max),
  set: value => perc.value = value,
})
const container = useTemplateRef<HTMLElement>('container')

const sstyle = computed(() => {
  return dir === 'x'
    ? `width: calc(${percentage.value}% - ${size / 2}rem)`
    : `height: calc(${percentage.value}% - ${size / 2}rem)`
})

const estyle = computed(() => {
  return dir === 'x'
    ? `width: calc(${100 - percentage.value}% - ${size / 2}rem)`
    : `height: calc(${100 - percentage.value}% - ${size / 2}rem)`
})

onMounted(() => {
  const elem = dragger.value!
  const parent = container.value!
  const onMouseMove = (e: MouseEvent) => {
    const rect = parent.getBoundingClientRect()
    percentage.value = clamp(
      dir === 'x'
        ? (e.clientX - rect.left) / rect.width * 100
        : (e.clientY - rect.top) / rect.height * 100,
      min,
      max,
    )
  }
  const onMouseUp = () => {
    document.body.style.cursor = 'auto'
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
  useEventListener(elem, 'mousedown', (e) => {
    e.preventDefault()
    document.body.style.cursor = dir === 'x'
      ? 'ew-resize'
      : 'ns-resize'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  })
})
</script>

<template>
  <div ref="container">
    <slot name="start" :style="sstyle" />
    <div
      :style="{
        width: dir === 'x' ? `${size}rem` : '100%',
        height: dir === 'y' ? `${size}rem` : '100%',
      }" flex
    >
      <div
        ref="dragger"
        m-auto rd bg-stone op-32
        :class="dir === 'x'
          ? 'w-1/4 h-1/5 cursor-ew-resize'
          : 'w-1/5 h-1/4 cursor-ns-resize'
        "
      />
    </div>
    <slot name="end" :style="estyle" />
  </div>
</template>
