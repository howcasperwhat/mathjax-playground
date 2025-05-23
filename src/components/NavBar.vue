<script setup lang='ts'>
const tabs = computed(() => {
  return Array.from(playState.tabs.value)
})

const container = useTemplateRef<HTMLDivElement>('container')
const hover = ref('')
const src = ref(-1)
const tar = ref(-1)

function dragstart(name: string, idx: number) {
  playState.active = name
  src.value = idx
}
function dragend() {
  tar.value -= +(src.value < tar.value)
  playState.move(src.value, tar.value)
  src.value = -1
  tar.value = -1
}

function dragoverSep(e: DragEvent, idx: number) {
  e.preventDefault()
  e.dataTransfer && (e.dataTransfer.dropEffect = 'move')
  tar.value = idx
}
function dragoverBtn(e: DragEvent, idx: number) {
  e.preventDefault()
  e.dataTransfer && (e.dataTransfer.dropEffect = 'move')
  const target = e.currentTarget as HTMLButtonElement
  const { left, width } = target.getBoundingClientRect()
  tar.value = +(e.clientX - left > width / 2) + idx
}
function dragleave() {
  tar.value = -1
}
function getClass(idx: number) {
  if (tar.value === idx)
    return 'bg-linear-to-t from-stone:40 to-transparent'
  return ''
}
</script>

<template>
  <div
    ref="container"
    flex="~ items-center"

    w-full select-none relative z-tabs of-x-auto of-y-hidden color-base children:h-full
  >
    <div text-lg p-2 bd rd-t-xl b-b-none flex shadow translate-y-1>
      <div m-a p-1 rd-xl bg-stone:16>
        <div i:svg />
      </div>
    </div>
    <div
      b-b="1px solid stone:16" shrink-0 w-1
      :class="getClass(0)"
      @dragover="e => dragoverSep(e, 0)"
      @dragleave="dragleave()"
    />
    <template v-for="name, idx in tabs" :key="name">
      <button
        :title="name" draggable="true"
        bd rd-xl rd-b-0 min-w-24 shadow
        transition-transform-300 btn-sm icon-text
        :class="playState.active === name
          ? 'translate-y-1 b-stone:24'
          : hover === name
            ? 'translate-y-2 b-stone:20'
            : 'translate-y-3 b-stone:16'
        "
        @click="playState.active = name"
        @dragstart="dragstart(name, idx)"
        @dragend="dragend()"
        @dragover="e => dragoverBtn(e, idx)"
        @dragleave="dragleave()"
        @mouseenter="hover = name"
        @mouseleave="hover = ''"
      >
        <div :class="playState.icon(name)" />
        <div shrink-1 truncate v-text="name" />
        <div
          m-l-a rd bg-gray
          bg-op="0 hover:20 active:40"
          @click.stop="playState.remove(name)"
        >
          <div i-carbon:close />
        </div>
      </button>
      <div
        b-b="1px solid stone:16" shrink-0 w-1
        :class="getClass(idx + 1)"
        @dragover="e => dragoverSep(e, idx + 1)"
        @dragleave="dragleave()"
      />
    </template>
    <div
      flex-1 h-full b-b="1px solid stone:16"
      @dragover="e => dragoverSep(e, tabs.length)"
      @dragleave="dragleave()"
    />
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
