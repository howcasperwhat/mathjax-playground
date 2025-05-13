<script setup lang="ts">
const props = defineProps<{
  svg: string
}>()
const emits = defineEmits<{
  (e: 'update', value: SVGSVGElement): void
}>()

const container = ref<HTMLElement | null>(null)
const html = ref('')

const isGrabbing = shallowRef(false)
function handleDragingScroll() {
  let x = 0
  let y = 0
  const SCROLLBAR_THICKNESS = 20

  useEventListener(container, 'mousedown', (e) => {
    // prevent dragging when clicking on scrollbar
    const rect = container.value!.getBoundingClientRect()
    const distRight = rect.right - e.clientX
    const distBottom = rect.bottom - e.clientY
    if (distRight <= SCROLLBAR_THICKNESS || distBottom <= SCROLLBAR_THICKNESS) {
      return
    }

    isGrabbing.value = true
    x = container.value!.scrollLeft + e.pageX
    y = container.value!.scrollTop + e.pageY
  })
  useEventListener('mouseleave', () => isGrabbing.value = false)
  useEventListener('mouseup', () => isGrabbing.value = false)
  useEventListener('mousemove', (e) => {
    if (!isGrabbing.value)
      return
    e.preventDefault()
    container.value!.scrollLeft = x - e.pageX
    container.value!.scrollTop = y - e.pageY
  })
}
onMounted(() => {
  handleDragingScroll()
  watch(() => props.svg, async () => {
    html.value = props.svg.includes('data-mjx-error')
      ? 'Error'
      : props.svg
    await nextTick()
    const elem = container.value!.firstChild as SVGSVGElement
    emits('update', elem)
    // console.log('svg in mathjax')
  })
})
</script>

<template>
  <div
    of-auto
    style="
      display: flex;
      justify-content: safe center;
      align-items: safe start;
      background-image:
        linear-gradient(to right, rgba(128, 128, 128, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(128, 128, 128, 0.1) 1px, transparent 1px);
      background-size: 20px 20px;
    "
  >
    <div
      ref="container" m-4 :class="isGrabbing ? 'cursor-grabbing' : ''"
      v-html="html"
    />
  </div>
</template>
