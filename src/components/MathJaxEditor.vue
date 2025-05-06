<script setup lang="ts">
// function error(elem: SVGSVGElement) {
//   const decisive = elem?.lastChild?.lastChild?.lastChild
//   return (
//     decisive instanceof SVGGElement
//     && decisive.getAttribute('data-mjx-error')
//   )
// }

const container = ref<HTMLElement | null>(null)
const html = ref('')

// playState.active -> monaco.content -> playState.tex
//  +-> playState.svg -> html, playState.elem   | (just for monaco-edit)
//         ^------------------------------------+
// [TODO]: `playState.tex` that changed by `playState.active` shouldn't affect `playState.svg`
onMounted(() => {
  watch(playState.active, () => {
    const item = playState.toItem(playState.active.value)
    if (item?.svg)
      playState.svg.value = item.svg
  }, { immediate: true })
  // watch(playState.tex, () => {
  //   const elem = mathjax.from(playState.tex.value)
  //   if (error(elem))
  //     return html.value = 'Error'
  //   playState.svg.value = elem.outerHTML
  // }, { immediate: true })
  watch(playState.svg, () => {
    html.value = playState.svg.value
    nextTick(() => {
      playState.elem = container.value!.firstChild as SVGSVGElement
    })
  }, { immediate: true })
})
</script>

<template>
  <div
    bd rd of-auto
    :style="{
      display: 'flex',
      justifyContent: 'safe center',
      alignItems: 'safe center',
    }"
  >
    <div ref="container" v-html="html" />
  </div>
</template>
