<script setup lang='ts'>
const props = defineProps<{
  dir: 'x' | 'y'
  size?: number
  min?: number
  max?: number
}>()
const perc = defineModel<number>()

const [min, max, dir, size] = [
  computed(() => props.min ?? 0),
  computed(() => props.max ?? 100),
  computed(() => props.dir),
  computed(() => props.size ?? 1),
]

const dragger = ref<HTMLElement | null>(null)
const percentage = computed({
  get: () => shrink(Math.round(perc.value ?? 50), min.value, max.value),
  set: value => perc.value = value,
})
const container = ref<HTMLElement | null>(null)

const sstyle = computed(() => {
  return dir.value === 'x'
    ? `width: calc(${percentage.value}% - ${size.value / 2}rem)`
    : `height: calc(${percentage.value}% - ${size.value / 2}rem)`
})

const estyle = computed(() => {
  return dir.value === 'x'
    ? `width: calc(${100 - percentage.value}% - ${size.value / 2}rem)`
    : `height: calc(${100 - percentage.value}% - ${size.value / 2}rem)`
})

onMounted(() => {
  const elem = dragger.value!
  const parent = container.value!
  const onMouseMove = (e: MouseEvent) => {
    const rect = parent.getBoundingClientRect()
    percentage.value = shrink(
      dir.value === 'x'
        ? (e.clientX - rect.left) / rect.width * 100
        : (e.clientY - rect.top) / rect.height * 100,
      min.value,
      max.value,
    )
  }
  const onMouseUp = () => {
    document.body.style.cursor = 'auto'
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
  elem.addEventListener('mousedown', (e) => {
    e.preventDefault()
    document.body.style.cursor = dir.value === 'x'
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
      flex :style="{
        width: dir === 'x' ? `${size}rem` : '100%',
        height: dir === 'y' ? `${size}rem` : '100%',
      }"
    >
      <div
        ref="dragger"
        m-auto rd bg-gray op-50
        :style="{
          width: dir === 'x' ? '25%' : '20%',
          height: dir === 'y' ? '25%' : '20%',
          cursor: dir === 'x' ? 'ew-resize' : 'ns-resize',
        }"
      />
    </div>
    <slot name="end" :style="estyle" />
  </div>
</template>
