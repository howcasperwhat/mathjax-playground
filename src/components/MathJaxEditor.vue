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

const INITIAL_STATE = {
  zoom: 100,
  cx: 0,
  cy: 0,
  dx: 0,
  dy: 0,
}

const ZOOM_UNIT = 10
const zoom = ref(INITIAL_STATE.zoom)
function scale(factor: number) {
  zoom.value = shrink(
    zoom.value + factor * ZOOM_UNIT,
    30,
    300,
  )
}

const isGrabbing = shallowRef(false)
const [cx, cy] = [ref(INITIAL_STATE.cx), ref(INITIAL_STATE.cy)]
const [dx, dy] = [ref(INITIAL_STATE.dx), ref(INITIAL_STATE.dy)]
function setupDraggable() {
  let [x, y] = [0, 0]

  useEventListener(parent, 'mousedown', (e) => {
    e.preventDefault()
    void ([x, y] = [e.pageX, e.pageY])
    isGrabbing.value = true
  })
  useEventListener('mouseleave', (e) => {
    if (!isGrabbing.value)
      return
    e.preventDefault()
    isGrabbing.value = false
    cx.value += dx.value
    cy.value += dy.value
    dx.value = 0
    dy.value = 0
  })
  useEventListener('mouseup', (e) => {
    if (!isGrabbing.value)
      return
    e.preventDefault()
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

function reset() {
  zoom.value = INITIAL_STATE.zoom
  cx.value = INITIAL_STATE.cx
  cy.value = INITIAL_STATE.cy
  dx.value = INITIAL_STATE.dx
  dy.value = INITIAL_STATE.dy
}

onMounted(() => {
  setupDraggable()
  watch(() => props.svg, async () => {
    html.value = props.svg.includes('data-mjx-error')
      ? 'Error'
      : props.svg
    await nextTick()
    const elem = container.value!.firstChild as SVGSVGElement
    emits('update', elem)
  })
})
</script>

<template>
  <div
    ref="parent"
    style="
      display: flex;
      justify-content: safe center;
      align-items: safe start;
    "
    :class="isGrabbing ? 'cursor-grabbing' : ''"
  >
    <div

      text-lg m-2 p-1 rd-xl bg-stone:16 left-0 top-0 absolute backdrop-blur-8
    >
      <div i:svg />
    </div>
    <div
      ref="container"
      :style="`transform:
        translate(${cx + dx}px, ${cy + dy}px)
        scale(${zoom / 100});
      `" m-4
      v-html="html"
    />
    <div
      flex="~ col items-center justify-center gap-2"
      childrem:flex="~ col items-center justify-center"
      children:children:flex="~ items-center justify-center"
      text-stone m-4 children:bd bottom-2rem right-0 absolute
      children:rd-full children:shadow children:backdrop-blur-8
      children:children:h-10 children:children:w-10
    >
      <div>
        <button
          v-tooltip.left="'Zoom In'"
          rd-t-full hover:bg-stone:8 btn
          @click="scale(1)"
        >
          <div i-carbon:zoom-in />
        </button>
        <span
          text-sm bg-stone:8 op-80
          v-text="`${zoom}%`"
        />
        <button
          v-tooltip.left="'Zoom Out'"
          rd-b-full hover:bg-stone:8 btn
          @click="scale(-1)"
        >
          <div i-carbon:zoom-out />
        </button>
      </div>
      <div>
        <button v-tooltip.left="'Reset Position and Zoom'" btn @click="reset">
          <div i-carbon:reset />
        </button>
      </div>
    </div>
  </div>
</template>
