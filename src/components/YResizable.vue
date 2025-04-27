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
    const mouseY = e.clientY - rect.top
    const rate = Math.min(Math.max(mouseY / rect.height, 0), 1)
    emits('rate', rate)
  }
  const onMouseUp = () => {
    document.body.style.cursor = 'auto'
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
  elem.addEventListener('mousedown', (e) => {
    e.preventDefault()
    document.body.style.cursor = 'ns-resize'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  })
})
</script>

<template>
  <div ref="dragger" h-1rem w-full flex="~ items-center justify-center">
    <div rounded bg-gray op-50 h-.25rem w="1/5" cursor-ns-resize />
  </div>
</template>
