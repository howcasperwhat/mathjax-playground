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
  <div flex="~ col" h-full>
    <NavBar h-3rem />
    <div
      h="[calc(100%-3rem)]"
      bd rd-b-xl b-t-none shadow relative of-hidden
      style="
        background-image:
          linear-gradient(to right, rgba(128, 128, 128, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(128, 128, 128, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
        background-position: 10px 10px;
      "
    >
      <MathJaxEditor :svg @update="editMathJax" />
      <MonacoEditor
        bottom-2 left-2 absolute
        :tex @update="editMonaco"
      />
    </div>
  </div>
</template>
