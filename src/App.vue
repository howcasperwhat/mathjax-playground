<script setup lang="ts">
const tex = computed({
  get: () => playState.tex.value,
  set: value => playState.tex.value = value,
})
const svg = computed({
  get: () => playState.svg.value,
  set: value => playState.svg.value = value,
})
const perc = ref({
  x: 72,
  l: 32,
  r: 32,
})
useLocalStorage(`${APP_NAME}_perc`, perc)

// input
function editMonaco(value: string) {
  playState.tex.value = value
  const elem = mathjax.from(value)
  svg.value = elem.outerHTML
  // console.log('tex in monaco')
}
function editMathJax(value: SVGSVGElement) {
  playState.elem = value
}

onMounted(() => {
  // active
  watch(playState.active, () => {
    // console.log('active', playState.active.value)
    const item = playState.toItem(playState.active.value)
    tex.value = item?.tex ?? ''
    svg.value = item?.svg ?? ''
    if (item?.tex && !item?.svg) {
      editMonaco(item.tex)
    }
  }, { immediate: true })
})
</script>

<template>
  <div flex="~ gap-4">
    <ToolBar w-16 />
    <div flex="~ col gap-2" w="[calc(100vw-7rem)]">
      <NavBar h-10 />
      <Resizable v-model="perc.x" dir="x" h="[calc(100vh-5rem)]" flex>
        <template #start="lprops">
          <Resizable v-model="perc.l" dir="y" flex="~ col" h-full :style="lprops.style">
            <template #start="tprops">
              <MathJaxEditor :svg :style="tprops.style" @update="editMathJax" />
            </template>
            <template #end="bprops">
              <MonacoEditor :tex :style="bprops.style" @update="editMonaco" />
            </template>
          </Resizable>
        </template>
        <template #end="rprops">
          <Resizable v-model="perc.r" dir="y" flex="~ col" h-full :style="rprops.style">
            <template #start="tprops">
              <ConfigPanel :style="tprops.style" />
            </template>
            <template #end="bprops">
              <HistoryPanel :style="bprops.style" />
            </template>
          </Resizable>
        </template>
      </Resizable>
    </div>
  </div>
  <!-- <div
    flex="~ items-center justify-center"
    h-full w-full sm:hidden
  >
    This app is not supported on mobile devices. Please try with a bigger screen.
  </div> -->
</template>
