<script setup lang="ts">
const props = defineProps<{
  svg: string
}>()
const emits = defineEmits<{
  (e: 'update', value: SVGSVGElement): void
}>()

const container = ref<HTMLElement | null>(null)
const parent = ref<HTMLElement | null>(null)
const html = ref('')

const isGrabbing = shallowRef(false)
const [cx, cy] = [ref(0), ref(0)]
const [dx, dy] = [ref(0), ref(0)]
function handleDragingScroll() {
  let [x, y] = [0, 0]

  useEventListener(parent, 'mousedown', (e) => {
    [x, y] = [e.pageX, e.pageY]
    isGrabbing.value = true
  })
  useEventListener('mouseleave', () => {
    isGrabbing.value = false
    cx.value += dx.value
    cy.value += dy.value
    dx.value = 0
    dy.value = 0
  })
  useEventListener('mouseup', () => {
    isGrabbing.value = false
    cx.value += dx.value
    cy.value += dy.value
    dx.value = 0
    dy.value = 0
  })
  useEventListener('mousemove', (e) => {
    if (!isGrabbing.value)
      return
    e.preventDefault()
    dx.value = e.pageX - x
    dy.value = e.pageY - y
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
    ref="parent" of-auto
    style="
      display: flex;
      justify-content: safe center;
      align-items: safe start;
      background-image:
        linear-gradient(to right, rgba(128, 128, 128, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(128, 128, 128, 0.1) 1px, transparent 1px);
      background-size: 20px 20px;
    "
    :class="isGrabbing ? 'cursor-grabbing' : ''"
  >
    <div
      ref="container" m-4
      :style="`transform: translate(${cx + dx}px, ${cy + dy}px);`"
      v-html="html"
    />
  </div>
</template>
