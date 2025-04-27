<script setup lang='ts'>
const emits = defineEmits<{
  (e: 'rate', rate: number): void
}>()
const dragger = ref<HTMLElement | null>(null)

onMounted(() => {
  const elem = dragger.value!
  const parent = elem.parentElement! as HTMLElement
  const onMouseMove = (e: MouseEvent) => {
    const rect = parent.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const rate = Math.min(Math.max(mouseX / rect.width, 0), 1)
    emits('rate', rate)
  }
  const onMouseUp = () => {
    document.body.style.cursor = 'auto'
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
  elem.addEventListener('mousedown', (e) => {
    e.preventDefault()
    document.body.style.cursor = 'ew-resize'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  })
})
</script>

<template>
  <div ref="dragger" h-full w-1rem flex="~ items-center justify-center">
    <div rounded bg-gray op-50 w-.25rem h="1/5" cursor-ew-resize />
  </div>
</template>
