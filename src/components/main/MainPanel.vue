<script setup lang="ts">
const tex = computed({
  get: () => appState.tex.value,
  set: value => appState.tex.value = value,
})
const svg = computed({
  get: () => appState.svg.value,
  set: value => appState.svg.value = value,
})

// input
function editMonaco(value: string) {
  appState.tex.value = value
  const elem = mathjax.from(value)
  svg.value = elem.outerHTML
}
function editMathJax(value: SVGSVGElement) {
  appState.elem = value
}

onMounted(() => {
  // active
  watch(() => appState.active, () => {
    const item = appState.toItem(appState.active)
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
