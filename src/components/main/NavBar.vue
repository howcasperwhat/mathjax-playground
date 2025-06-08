<script setup lang='ts'>
const tabs = computed(() => {
  return Array.from(appState.tabs.value)
})

const container = useTemplateRef<HTMLDivElement>('container')
const hover = ref('')
const src = ref(-1)
const moving = ref(false)

function dragstart(e: DragEvent, name: string, idx: number) {
  e.dataTransfer && (e.dataTransfer.effectAllowed = 'move')
  appState.active = name
  src.value = idx
  moving.value = false
}
function dragenter(idx: number) {
  if (moving.value)
    return
  if (src.value === idx)
    return
  appState.move(src.value, idx)
  src.value = idx
  moving.value = true
}
function dragend() {
  src.value = -1
}
</script>

<template>
  <div
    ref="container" flex="~ items-center"
    w-full select-none relative z-tabs of-x-auto
    of-y-hidden color-base children:h-full
    children:transition-all-200
  >
    <div
      text-lg p-2 bd rd-t-xl b-b-none flex h-full
      shadow translate-y-1 left-0 top-0 sticky
      z-6 bg-base
    >
      <div m-a p-1 rd-xl bg-stone:16>
        <div i:svg />
      </div>
    </div>
    <TransitionGroup name="tab">
      <template v-for="name, idx in tabs" :key="name">
        <div b-b="1px solid stone:16" shrink-0 w-1 />
        <button
          :title="name" draggable="true"
          bd rd-xl rd-b-0 min-w-24 shadow
          btn-sm bg-base icon-text
          :class="appState.active === name
            ? 'translate-y-1 b-stone:24'
            : hover === name
              ? 'translate-y-2 b-stone:20'
              : 'translate-y-3 b-stone:16'
          "
          @click="appState.active = name"
          @dragstart.stop="e => dragstart(e, name, idx)"
          @dragend.stop="dragend()"
          @dragenter.stop.prevent="dragenter(idx)"
          @dragover.stop.prevent=""
          @transitionend="moving = false"
          @mouseenter="(src === -1) && (hover = name)"
          @mouseleave="(src === -1) && (hover = '')"
        >
          <div :class="appState.icon(name)" />
          <div shrink-1 truncate v-text="name" />
          <div
            ml-a rd bg-gray
            bg-op="0 hover:20 active:40"
            @click.stop="appState.remove(name)"
          >
            <div i-carbon:close />
          </div>
        </button>
      </template>
    </TransitionGroup>
    <div flex-1 h-full b-b="1px solid stone:16" />
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  --at-apply: hidden w-0 h-0 bg-transparent;
}

.tab-leave-to {
  --at-apply: min-w-0 w-0 p-0 b-0;
  interpolate-size: allow-keywords;
}
</style>
