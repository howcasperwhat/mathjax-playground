<script setup lang="ts">
const tex = computed({
  get: () => playState.tex.value,
  set: value => playState.tex.value = value,
})
const svg = computed({
  get: () => playState.svg.value,
  set: value => playState.svg.value = value,
})

// input
function editMonaco(value: string) {
  playState.tex.value = value
  const elem = mathjax.from(value)
  svg.value = elem.outerHTML
}
function editMathJax(value: SVGSVGElement) {
  playState.elem = value
}

onMounted(() => {
  // active
  watch(playState.active, () => {
    const item = playState.toItem(playState.active.value)
    tex.value = item?.tex ?? ''
    svg.value = item?.svg ?? ''
    if (item?.tex && !item?.svg)
      editMonaco(item.tex)
  }, { immediate: true })
})
</script>

<template>
  <div relative of-hidden>
    <div flex="~ col" h-full>
      <NavBar h-3rem />
      <MathJaxEditor
        :svg h="[calc(100%-3rem)]"
        rd-b-xl b-t-none @update="editMathJax"
      />
    </div>
    <MonacoEditor
      bottom-2 left-2 absolute
      :tex @update="editMonaco"
    />
  </div>
</template>
